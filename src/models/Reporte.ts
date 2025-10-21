export interface Reporte {
  id_reporte?: number;
  motivo?: string;
  descripcion?: string;
  estado?: string; // 'pendiente', 'en_revision', 'resuelto', 'rechazado'
  fecha_reporte?: Date | string;
  fecha_resolucion?: Date | string;
  id_usuario_reporta?: number; // Usuario que hace el reporte
  id_usuario_reportado?: number; // Usuario reportado (opcional)
  id_publicacion?: number; // Publicación reportada (opcional)
  id_comentario?: number; // Comentario reportado (opcional)
}

export interface ReporteConRelaciones extends Reporte {
  usuario_reporta?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  usuario_reportado?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  publicacion?: {
    id_publicacion: number;
    titulo: string;
  };
  comentario?: {
    id_comentario: number;
    contenido: string;
  };
}

export interface CreateReporteRequest {
  motivo: string;
  descripcion: string;
  id_usuario_reportado?: number;
  id_publicacion?: number;
  id_comentario?: number;
}

export interface UpdateReporteRequest {
  estado: string;
  fecha_resolucion?: Date | string;
}
