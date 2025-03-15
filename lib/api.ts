import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export async function get<T>(
  url: string,
  params?: Record<string, any>
): Promise<T> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function post<T>(url: string, data: any): Promise<T> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function put<T>(url: string, data: any): Promise<T> {
  try {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function uploadFile<T>(
  url: string,
  file: File,
  onProgress?: (percentage: number) => void
): Promise<T> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

function handleApiError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const message = error.response.data?.message || error.message;
      throw new Error(message);
    } else if (error.request) {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
      );
    }
  }
  throw error;
}
