import { ArchivoRequest } from '@/interface/archivo-request.interface';
import { ArchivoResult } from '@/interface/archivo-result';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ArchivoService {
    readonly BASE_URL = 'http://localhost:8080/api/archivos';
    private http = inject(HttpClient);

    constructor() {}

    getAllArchivos(): HttpResourceRef<ArchivoResult[] | undefined> {
        return httpResource<ArchivoResult[]>(() => this.BASE_URL);
    }

    getAllArchivosBySemestreActive(): HttpResourceRef<ArchivoResult[] | undefined> {
        return httpResource<ArchivoResult[]>(() => `${this.BASE_URL}/semestre-activo`);
    }

    getArchivo(id: Signal<string>): HttpResourceRef<ArchivoResult | undefined> {
        return httpResource<ArchivoResult>(() => {
            const idValue = id();
            return idValue ? `${this.BASE_URL}/${idValue}` : undefined;
        });
    }

    saveArchivo(archivo: ArchivoRequest, file: File) {
        const formData = this.createFormData(archivo, file);
        return this.http.post(`${this.BASE_URL}`, formData);
    }

    patchArchivo(id: string, archivo: ArchivoRequest, file: File | null) {
        const formData = this.createFormData(archivo, file);
        return this.http.patch(`${this.BASE_URL}/${id}`, formData);
    }

    deleteArchivo(id: string) {
        return this.http.delete(`${this.BASE_URL}/${id}`);
    }

    private createFormData(archivo: ArchivoRequest, file?: File | null): FormData {
        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('nombre', archivo.nombre);
        formData.append('descripcion', archivo.descripcion);
        formData.append('materiaId', archivo.materiaId);
        return formData;
    }
}
