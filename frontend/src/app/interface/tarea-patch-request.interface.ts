export interface TareaPatchRequest {
    titulo: string;
    descripcion: string;
    fechaEntrega: string;
    prioridad: string;
    materiaId: string;
    estado: string;
    archivoId: string;
}