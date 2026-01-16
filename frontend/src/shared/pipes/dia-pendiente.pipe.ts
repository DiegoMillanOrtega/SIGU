import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'esDiaPendiente'
})

export class DiaPendientePipe implements PipeTransform {
    transform(dia: number, diasPendientes: number[]): boolean {
        return diasPendientes.includes(dia) ? true : false;
    }
}