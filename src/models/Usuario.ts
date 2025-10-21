export interface Usuario {
  id_usuario?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;
  correo: string;
  contrasena: string;
  carrera?: string;
  foto_perfil?: string;
  fecha_registro?: Date | string;
  id_rol: number;
}

export interface UsuarioSinContrasena extends Omit<Usuario, 'contrasena'> {}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;
  correo: string;
  contrasena: string;
  carrera?: string;
  id_rol?: number;
}
