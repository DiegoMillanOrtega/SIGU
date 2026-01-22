import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'prioridadStyleBorder'
})

export class PrioridadStyleBorderPipe implements PipeTransform {
    transform(prioridad: string): string {
        const severity: Record<string, string> = {
            ALTA: '!border-l-red-500',
            MEDIA: '!border-l-yellow-500',
            BAJA: '!border-l-green-500',
        };
        return severity[prioridad] || '';
        
    }
}