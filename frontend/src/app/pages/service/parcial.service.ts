import { inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Parcial, ParcialRequest } from '@/interface/parcial.interface';

@Injectable({providedIn: 'root'})
export class ParcialService {
    private baseUrl = 'http://localhost:8080/api/parciales';
    private http = inject(HttpClient);

    getParciales() {
        return httpResource<Parcial[]>(() => this.baseUrl);
    }

    saveParcial(parcial: ParcialRequest) {
        return this.http.post<Parcial>(this.baseUrl, parcial);
    }

    deleteParcial(id: string) {
        return this.http.delete<Parcial>(`${this.baseUrl}/${id}`);
    }
    
}