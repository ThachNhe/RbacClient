import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  data: T;
  status: number;
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
): Promise<ApiResponse<T>> {
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

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export interface ProjectGeneratorParams {
  name: string;
  packageManager: string;
  description: string;
  swagger: boolean;
  auth: boolean;
  file?: File;
}

export async function generateProject(
  url: string,
  params: ProjectGeneratorParams,
  onProgress?: (percentage: number) => void
): Promise<Blob> {
  try {
    const formData = new FormData();
    formData.append("name", params.name);
    formData.append("packageManager", params.packageManager);
    formData.append("description", params.description);
    formData.append("swagger", params.swagger.toString());
    formData.append("auth", params.auth.toString());

    if (params.file) {
      formData.append("file", params.file);
    }

    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob", // Important because it help identify the response type
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function generateAndDownloadProject(
  url: string,
  params: ProjectGeneratorParams,
  onProgress?: (percentage: number) => void
): Promise<{ success: boolean; filename: string }> {
  try {
    const blob = await generateProject(url, params, onProgress);

    let filename = `${params.name}.zip`;

    // Create download link and a tag to download the file
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Revoke URL and a tag
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);

    return { success: true, filename };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function uploadMultipleFiles<T>(
  url: string,
  files: Record<string, File>,
  onProgress?: (percentage: number) => void
): Promise<T> {
  try {
    const formData = new FormData();

    Object.entries(files).forEach(([fieldName, file]) => {
      formData.append(fieldName, file);
    });

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
      // If the response is a blob, it means the server responded with a file
      if (error.response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result as string);
            const message = errorData?.message || "Unknown error";
            throw new Error(message);
          } catch (e) {
            throw new Error("Error processing response");
          }
        };
        reader.readAsText(error.response.data);
        throw new Error("Server responded with an error");
      } else {
        const message = error.response.data?.message || error.message;
        throw new Error(message);
      }
    } else if (error.request) {
      throw new Error("Cannot connect with server.");
    }
  }
  throw error;
}
