import { diasHasta } from '@/utils/date-validator.util';
import { Pipe, PipeTransform } from '@angular/core';

export interface DiasRestantes {
    dias: number
    severity: string,
    textClass: string,
    label: string
}

@Pipe({
    name: 'diasRestantes'
})

export class DiasRestantesPipe implements PipeTransform {
    transform(fecha: string): DiasRestantes {
        const dias = diasHasta(fecha);
        return {
            dias,
            severity: dias <= 3 ? 'danger': dias <= 9 ? 'warn' : 'success',
            textClass: dias <= 3 ? 'text-status-critical' : dias <= 9 ? 'text-status-warning' : 'text-status-safe',
            label: dias === 0 ? '!Hoy!' : dias === 1 ? '!Mañana!' : `${dias} Días`
        }
    }
}