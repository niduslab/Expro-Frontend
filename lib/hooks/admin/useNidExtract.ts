import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/axios';

export interface NidFrontData {
  name_bn: string | null;
  name_en: string | null;
  father_name_bn: string | null;
  mother_name_bn: string | null;
  date_of_birth: string | null; // YYYY-MM-DD
  nid_number: string | null;
}

export interface NidBackData {
  address: string | null;
}

export type NidExtractResult = NidFrontData | NidBackData;

interface ExtractByFileParams {
  image: File;
  side: 'front' | 'back';
}

interface ExtractByPathParams {
  image_path: string;
  side: 'front' | 'back';
}

async function extractNid(params: ExtractByFileParams | ExtractByPathParams): Promise<NidExtractResult> {
  const formData = new FormData();
  formData.append('side', params.side);

  if ('image' in params) {
    formData.append('image', params.image);
  } else {
    formData.append('image_path', params.image_path);
  }

  const response = await apiRequest.post('/nid/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });

  return (response.data as any).data as NidExtractResult;
}

export function useNidExtractFront() {
  return useMutation<NidFrontData, Error, ExtractByFileParams | ExtractByPathParams>({
    mutationFn: (params) => extractNid({ ...params, side: 'front' }) as Promise<NidFrontData>,
  });
}

export function useNidExtractBack() {
  return useMutation<NidBackData, Error, ExtractByFileParams | ExtractByPathParams>({
    mutationFn: (params) => extractNid({ ...params, side: 'back' }) as Promise<NidBackData>,
  });
}
