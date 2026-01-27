import { SemestreStatus } from "./semestre.interface";

export interface SemestreRequest {
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    estado: SemestreStatus;
    usuarioId: string;
}