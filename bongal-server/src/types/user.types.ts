export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'buyer' | 'admin';
  avatar?: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}