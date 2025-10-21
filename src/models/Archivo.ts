export interface Archivo {
  id_archivo?: number;
  nombre: string;
  tipo: string; // MIME type: 'application/pdf', 'image/png', etc.
  ruta: string; // URL o path del archivo
  tamanio?: number; // Tamaño en bytes
  fecha_subida?: Date | string;
  id_publicacion: number;
}

export interface ArchivoConRelaciones extends Archivo {
  publicacion?: {
    id_publicacion: number;
    titulo: string;
  };
}

export interface CreateArchivoRequest {
  nombre: string;
  tipo: string;
  ruta: string;
  tamanio?: number;
  id_publicacion: number;
}

export interface UpdateArchivoRequest {
  nombre?: string;
  tipo?: string;
  ruta?: string;
  tamanio?: number;
}
