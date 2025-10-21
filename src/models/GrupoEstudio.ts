export interface GrupoEstudio {
  id_grupo?: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: Date | string;
}

export interface GrupoUsuario {
  id_grupo: number;
  id_usuario: number;
  rol_grupo?: string; // 'administrador', 'miembro', 'moderador'
  fecha_union?: Date | string;
}

export interface GrupoEstudioConMiembros extends GrupoEstudio {
  miembros?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    foto_perfil?: string;
    rol_grupo?: string;
    fecha_union?: Date | string;
  }[];
  total_miembros?: number;
}

export interface CreateGrupoEstudioRequest {
  nombre: string;
  descripcion?: string;
}

export interface UpdateGrupoEstudioRequest {
  nombre?: string;
  descripcion?: string;
}

export interface AddMiembroRequest {
  id_usuario: number;
  rol_grupo?: string;
}

export interface UpdateMiembroRequest {
  rol_grupo: string;
}
