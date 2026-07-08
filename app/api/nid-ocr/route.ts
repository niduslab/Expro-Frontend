import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not set on the server" },
      { status: 500 }
    );
  }

  const { base64, mimeType, prompt } = await request.json();
  if (!base64 || !mimeType || !prompt) {
    return NextResponse.json(
      { error: "base64, mimeType and prompt are required" },
      { status: 400 }
    );
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
      temperature: 0,
      max_completion_tokens: 512,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json(
      { error: `Groq API error ${response.status}: ${err}` },
      { status: 502 }
    );
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ content });
}
