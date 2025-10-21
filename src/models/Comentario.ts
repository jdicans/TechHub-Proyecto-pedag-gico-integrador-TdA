export interface Comentario {
  id_comentario?: number;
  contenido: string;
  fecha?: Date | string;
  id_usuario: number;
  id_publicacion: number;
}

export interface ComentarioConRelaciones extends Comentario {
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    foto_perfil?: string;
  };
}

export interface CreateComentarioRequest {
  contenido: string;
  id_publicacion: number;
}

export interface UpdateComentarioRequest {
  contenido: string;
}
