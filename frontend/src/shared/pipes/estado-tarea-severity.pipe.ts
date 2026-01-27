import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'estadoTareaSeverity'
})

export class EstadoTareaSeverityPipe implements PipeTransform {
    transform(estado: string): string {
        const severity: Record<string, string> = {
            PENDIENTE: 'warn',
            COMPLETADA: 'success',
        };
        return severity[estado] || '';
    }
}