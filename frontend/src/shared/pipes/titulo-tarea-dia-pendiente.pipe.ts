import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tituloTareaDiaPendiente'
})

export class TituloTareaDiaPendientePipe implements PipeTransform {
    transform(dia: number, tareas: Array<{dia: number, titulo: string}>): string {
        return tareas.find((tarea) => tarea.dia === dia)?.titulo || '';
    }
}