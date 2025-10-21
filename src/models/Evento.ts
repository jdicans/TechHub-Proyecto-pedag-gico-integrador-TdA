export interface Evento {
  id_evento?: number;
  nombre: string;
  descripcion?: string;
  fecha_evento: Date | string;
  hora_evento?: string;
  lugar?: string;
  modalidad?: string; // 'presencial', 'virtual', 'híbrido'
  id_categoria?: number;
}

export interface InscripcionEvento {
  id_inscripcion?: number;
  id_evento: number;
  id_usuario: number;
  fecha_inscripcion?: Date | string;
}

export interface EventoConRelaciones extends Evento {
  categoria?: {
    id_categoria: number;
    nombre: string;
  };
  inscritos?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    foto_perfil?: string;
    fecha_inscripcion?: Date | string;
  }[];
  total_inscritos?: number;
}

export interface CreateEventoRequest {
  nombre: string;
  descripcion?: string;
  fecha_evento: Date | string;
  hora_evento?: string;
  lugar?: string;
  modalidad?: string;
  id_categoria?: number;
}

export interface UpdateEventoRequest {
  nombre?: string;
  descripcion?: string;
  fecha_evento?: Date | string;
  hora_evento?: string;
  lugar?: string;
  modalidad?: string;
  id_categoria?: number;
}
