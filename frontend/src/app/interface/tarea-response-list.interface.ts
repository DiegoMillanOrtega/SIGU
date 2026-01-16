import { TareaResponse } from "./tarea-response.interface";

export interface TareaResponseList {
    allTareas: TareaResponse[];
    pendientes: TareaResponse[];
    completadas: TareaResponse[];
    atrasadas: TareaResponse[];
    hoy: TareaResponse[];
    stats: TareaStats;
}

export interface TareaStats {
    totalCount: number;
    pendientesCount: number;
    completadasCount: number;
    atrasadasCount: number;
    hoyCount: number;
}

