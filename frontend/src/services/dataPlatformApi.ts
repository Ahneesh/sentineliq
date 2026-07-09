import axios from "axios";
import type { DatasetProfile, UploadRecord } from "../types/dataPlatform";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export async function listUploads(): Promise<UploadRecord[]> {
  const response = await api.get<UploadRecord[]>("/uploads");
  return response.data;
}

export async function uploadCsv(file: File): Promise<UploadRecord> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<UploadRecord>("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getDatasetProfile(uploadId: number): Promise<DatasetProfile> {
  const response = await api.get<DatasetProfile>(`/uploads/${uploadId}/profile`);
  return response.data;
}
