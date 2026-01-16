import { TareaResponse } from '@/interface/tarea-response.interface';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tareaAtrasada'
})

export class TareaAtrasadaPipe implements PipeTransform {
    transform(tareaId: string, tareasAtrasadas: TareaResponse[]): boolean {
        return tareasAtrasadas.find((tarea) => tarea.id === tareaId) ? true : false;
    }
}