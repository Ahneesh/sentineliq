import { apiClient } from "./apiClient";
import type { UploadRecord } from "../types/dataPlatform";

export async function fetchUploads(): Promise<UploadRecord[]> {
  const response = await apiClient.get<UploadRecord[]>("/uploads");
  return response.data;
}

export async function uploadCsv(file: File): Promise<UploadRecord> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<{ upload: UploadRecord; message: string }>(
    "/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.upload;
}
