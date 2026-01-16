import { TareaResponse } from "./tarea-response.interface";

export interface TareaList {
    tareasPendientes: TareaResponse[];
    tareasEnProceso: TareaResponse[];
    tareasCompletadas: TareaResponse[];
    tareasAtrasadasCount?: number;
}