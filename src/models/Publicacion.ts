export interface Publicacion {
  id_publicacion?: number;
  titulo: string;
  contenido: string;
  fecha_creacion?: Date | string;
  id_usuario: number;
  id_categoria: number;
  tipo?: string; // 'articulo', 'pregunta', 'recurso', etc.
}

export interface PublicacionConRelaciones extends Publicacion {
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    foto_perfil?: string;
  };
  categoria?: {
    id_categoria: number;
    nombre: string;
  };
  etiquetas?: {
    id_etiqueta: number;
    nombre: string;
  }[];
}

export interface CreatePublicacionRequest {
  titulo: string;
  contenido: string;
  id_categoria: number;
  tipo?: string;
  etiquetas?: number[]; // Array de IDs de etiquetas
}

export interface UpdatePublicacionRequest {
  titulo?: string;
  contenido?: string;
  id_categoria?: number;
  tipo?: string;
  etiquetas?: number[];
}
