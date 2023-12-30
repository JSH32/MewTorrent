import { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios, { AxiosError } from 'axios';
import { AxiosInstance } from 'axios';

export interface LoginPayload {
  auth: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  registrationCode: string;
}

export interface UserPayload {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  admin: boolean;
}

export interface RegistrationCode {
  uses?: number;
  id: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page<T> {
  page: number;
  totalPages: number;
  items: T[]
}

export interface MessageResponse {
  message: string
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add a request interceptor to inject the token into headers
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  async login(payload: LoginPayload): Promise<void> {
    const response = await this.client.post('/api/auth/login', payload);
    this.setToken(response.data.token);
  }

  async getMe(): Promise<UserPayload> {
    const response = await this.client.get<UserPayload>('/api/user/@me')
    return response.data;
  }

  async register(payload: RegisterPayload) {
    const response = await this.client.post('/api/user/register', payload);
    return response.data;
  }

  async getCode(id: string): Promise<RegistrationCode> {
    const response = await this.client.get<RegistrationCode>(`/api/admin/code/${id}`);
    return response.data;
  }

  async deleteCode(id: string): Promise<MessageResponse> {
    const response = await this.client.delete<MessageResponse>(`/api/admin/code/${id}`);
    return response.data;
  }

  async createCode(uses?: number): Promise<RegistrationCode> {
    const response = await this.client.post<RegistrationCode>(`/api/admin/code${uses ? `?uses=${uses}` : ''}`);
    return response.data;
  }

  async listCodes(page: number): Promise<Page<RegistrationCode>> {
    const response = await this.client.get<Page<RegistrationCode>>(`/api/admin/code/list?page=${page}`);
    return response.data;
  }
}

/**
 * Show error either on notification.
 *
 * @param error error object received from {@link ActiasClient}.
 */
export const showError = (error: AxiosError) =>
  notifications.show({
    color: 'red',
    title: 'Error',
    message: (error.response?.data as any).message
      || (error.response?.data as any).errors[0]?.message
      || 'Something went wrong',
  });

/**
 * Show error either on form or notification depending on error.
 *
 * @param error error object received from {@link ActiasClient}.
 * @param form mantine form to show possible errors on.
 */
export const errorForm = (
  error: AxiosError,
  form: UseFormReturnType<any, any>,
) => {
  const body = (error.response?.data as any)
  if ('errors' in body) {
    form.setErrors(flattenErrors(body.errors) as any);
  } else {
    showError(error);
  }
};

type ErrorNode = { [key: string]: ErrorNode | string };

const flattenErrors = (errors: ErrorNode): ErrorNode => {
  const result: ErrorNode = {};

  const helper = (obj: ErrorNode): void => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        result[key] = value;
      } else {
        helper(value as ErrorNode);
      }
    });
  };

  helper(errors);
  return result;
}

const client = new ApiClient();
export default client;