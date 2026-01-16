import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'prioridadSeverity'
})

export class PrioridadSeverityPipe implements PipeTransform {
    transform(prioridad: string): string {
        const severity: Record<string, string> = {
            ALTA: 'danger',
            MEDIA: 'warn',
            BAJA: 'success',
        };
        return severity[prioridad] || '';
        
    }
}