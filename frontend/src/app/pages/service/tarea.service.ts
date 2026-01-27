import { inject, Injectable, Signal } from '@angular/core';
import {
    HttpClient,
    HttpParams,
    httpResource,
    HttpResourceRef,
} from '@angular/common/http';
import { TareaResponse } from '@/interface/tarea-response.interface';
import { TareaRequest } from '@/interface/tarea-request.interface';
import { TareaPatchRequest } from '@/interface/tarea-patch-request.interface';
import {
    TareaResponseList,
    TareaStats,
} from '@/interface/tarea-response-list.interface';
import { TareaEstado } from '@/interface/tarea-estado.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TareaService {
    private baseUrl = 'http://localhost:8080/api/tareas';
    private http = inject(HttpClient);

    getTareas(
        materiaId?: Signal<string | undefined>,
        estado?: TareaEstado | undefined,
    ): HttpResourceRef<TareaResponse[] | undefined> {

        return httpResource<TareaResponse[]>(() => {
            const id = materiaId?.()
            const est = estado
            

            let params = new HttpParams();
            if (id) params = params.append('materiaId', id);
            if (est) params = params.append('estado', est);

            console.log(params);
            
            return {
                url: this.baseUrl,
                params: params,
            };
        });
    }

    getTarea(id: Signal<string>): HttpResourceRef<TareaResponse | undefined> {
        return httpResource<TareaResponse>(() => {
            const idValue = id();
            return idValue ? `${this.baseUrl}/${idValue}` : undefined;
        });
    }

    getStats(): HttpResourceRef<TareaStats | undefined> {
        return httpResource<TareaStats>(
            () => 'http://localhost:8080/api/tareas/stats',
        );
    }

    create(tarea: TareaRequest): Observable<TareaResponse> {
        return this.http.post<TareaResponse>(this.baseUrl, tarea);
    }

    patchTarea(id: string, tarea: Partial<TareaRequest>): Observable<TareaResponse> {
        return this.http.patch<TareaResponse>(`${this.baseUrl}/${id}`, tarea);
    }

    actualizarEstadoTarea(id: string, estado: string) {
        return this.http.patch(`${this.baseUrl}/${id}`, {
            estado,
        });
    }

    deleteTarea(id: string) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
