import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemestreInterface } from '@/interface/semestre.interface';
import { SemestreRequest } from '@/interface/semestre-request.interface';

@Injectable({providedIn: 'root'})
export class SemestreService {
    
    
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/semestres';
    
    getAllSemestres(): HttpResourceRef<SemestreInterface[] | undefined> {
        return httpResource<SemestreInterface[]>(() => `${this.baseUrl}`);
    }
    
    obtenerSemestrePorId(id: Signal<string>): HttpResourceRef<SemestreInterface | undefined> {
        return httpResource<SemestreInterface>(() => {
            const idValue = id();
            return idValue ? `${this.baseUrl}/${idValue}` : undefined;
        });
    }

    guardaSemestre(semestre: SemestreInterface) {
        return this.http.post<SemestreInterface>(`${this.baseUrl}`, semestre);
    }

    actualizarSemestre(id: string, semestre: Partial<SemestreRequest>) {
        return this.http.patch<SemestreInterface>(`${this.baseUrl}/${id}`, semestre);
    }
    
    eliminarSemestre(id: string) {
        return this.http.delete<SemestreInterface>(`${this.baseUrl}/${id}`);
    }
}