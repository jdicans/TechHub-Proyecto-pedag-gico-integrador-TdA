export interface Notificacion {
  id_notificacion?: number;
  mensaje?: string;
  tipo?: string;
  fecha?: Date | string;
  leida?: boolean;
  id_usuario?: number;
}

export interface NotificacionConUsuario extends Notificacion {
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface CreateNotificacionRequest {
  mensaje: string;
  tipo: string;
  id_usuario: number;
}

export interface MarkAsReadRequest {
  leida: boolean;
}
