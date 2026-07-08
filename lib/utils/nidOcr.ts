export interface NidOcrProgress {
  status: string;
  progress: number; // 0–100
}

export interface NidFrontExtracted {
  name_bn: string;
  name_en: string;
  father_name_bn: string;
  mother_name_bn: string;
  date_of_birth: string; // YYYY-MM-DD
  nid_number: string;
}

export interface NidBackExtracted {
  address: string;
}

const MONTH_MAP: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

function parseDate(raw: string): string {
  if (!raw) return "";
  raw = raw.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const dmy = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;

  const dMonY = raw.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
  if (dMonY) {
    const month = MONTH_MAP[dMonY[2].toLowerCase().slice(0, 3)];
    if (month) return `${dMonY[3]}-${month}-${dMonY[1].padStart(2, "0")}`;
  }

  return "";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callGroqVision(
  base64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const response = await fetch("/api/nid-ocr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64, mimeType, prompt }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.error ?? `NID OCR request failed with status ${response.status}`);
  }

  return json?.content ?? "";
}

const FRONT_PROMPT = `You are reading a Bangladesh National ID card image. Extract these fields exactly as printed:

- name_bn: Name in Bangla script (নাম field)
- name_en: Name in English (Name field)
- father_name_bn: Father's name in Bangla (পিতা field) or husband's name (স্বামী field)
- mother_name_bn: Mother's name in Bangla (মাতা field)
- date_of_birth: Date of Birth exactly as printed (e.g. "01 Feb 1993")
- nid_number: The digits after "ID NO:" (numbers only, no spaces)

Return ONLY a raw JSON object, no markdown, no explanation:
{"name_bn":"","name_en":"","father_name_bn":"","mother_name_bn":"","date_of_birth":"","nid_number":""}`;

export async function extractNidFront(
  imageFile: File,
  onProgress?: (p: NidOcrProgress) => void
): Promise<Partial<NidFrontExtracted>> {
  onProgress?.({ status: "Converting image", progress: 10 });
  const base64 = await fileToBase64(imageFile);
  const mimeType = imageFile.type || "image/jpeg";

  onProgress?.({ status: "Reading NID with AI", progress: 40 });
  const rawText = await callGroqVision(base64, mimeType, FRONT_PROMPT);

  if (process.env.NODE_ENV === "development") {
    console.log("=== GROQ RAW RESPONSE ===", rawText);
  }

  onProgress?.({ status: "Processing", progress: 80 });

  let parsed: Record<string, string> = {};
  try {
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    // Extract the JSON object in case the model adds any surrounding text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
  } catch {
    console.error("Failed to parse Groq JSON response:", rawText);
    return {};
  }

  const result: Partial<NidFrontExtracted> = {};
  if (parsed.name_bn)        result.name_bn        = parsed.name_bn.trim();
  if (parsed.name_en)        result.name_en        = parsed.name_en.trim();
  if (parsed.father_name_bn) result.father_name_bn = parsed.father_name_bn.trim();
  if (parsed.mother_name_bn) result.mother_name_bn = parsed.mother_name_bn.trim();
  if (parsed.nid_number)     result.nid_number     = parsed.nid_number.replace(/\D/g, "");
  if (parsed.date_of_birth) {
    const dob = parseDate(parsed.date_of_birth.trim());
    if (dob) result.date_of_birth = dob;
  }

  onProgress?.({ status: "Done", progress: 100 });

  if (process.env.NODE_ENV === "development") {
    console.log("=== NID EXTRACTED ===", result);
  }

  return result;
}

export async function extractNidBack(
  imageFile: File,
  onProgress?: (p: NidOcrProgress) => void
): Promise<Partial<NidBackExtracted>> {
  onProgress?.({ status: "Converting image", progress: 10 });
  const base64 = await fileToBase64(imageFile);
  const mimeType = imageFile.type || "image/jpeg";

  onProgress?.({ status: "Reading NID back with AI", progress: 40 });

  const prompt = `Extract the full address from the back of this Bangladesh National ID card.
Return ONLY a raw JSON object: {"address":"full address here"}
If not visible, return {"address":""}`;

  const rawText = await callGroqVision(base64, mimeType, prompt);

  onProgress?.({ status: "Processing", progress: 80 });

  let parsed: Record<string, string> = {};
  try {
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
  } catch {
    console.error("Failed to parse Groq back JSON:", rawText);
    return {};
  }

  onProgress?.({ status: "Done", progress: 100 });
  return { address: parsed.address ?? "" };
}
