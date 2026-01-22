export type ParcialEstado = 'PENDIENTE' | 'COMPLETADO' | 'all';
export type ParcialTipo = 'EXAMEN' | 'QUIZ' | 'PARCIAL';
export type ParcialPrioridad = 'ALTA' | 'MEDIA' | 'BAJA';

export interface Parcial {
  id: string
  tipo: ParcialTipo
  fecha: string
  hora: string
  lugar: string
  temaEvaluar: string
  notaAdicional: string
  estado: ParcialEstado
  materiaId: string
  materiaNombre: string
  prioridad: ParcialPrioridad
}

export interface ParcialRequest {
  tipo: ParcialTipo
  fecha: string
  hora: string
  lugar: string
  temaEvaluar: string
  notaAdicional: string
  estado: ParcialEstado
  materiaId: string
  prioridad: ParcialPrioridad
}
