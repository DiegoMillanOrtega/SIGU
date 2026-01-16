import { TareaResponse } from '@/interface/tarea-response.interface';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { DiaPendientePipe } from 'src/shared/pipes/dia-pendiente.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { TituloTareaDiaPendientePipe } from 'src/shared/pipes/titulo-tarea-dia-pendiente.pipe';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tarea-calendario',
    standalone: true,
    imports: [
        DatePickerModule,
        DiaPendientePipe,
        TooltipModule,
        TituloTareaDiaPendientePipe,
        PanelModule,
        FormsModule
    ],
    templateUrl: 'tarea-calendario.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TareaCalendario {
    tareasPendientes = input<TareaResponse[]>();

    tituloTareas = computed(() => {
        const tareas = this.tareasPendientes();
        if (!tareas) return [];
        console.log(tareas);
        

        return tareas.map((tarea) => {
            return {
                dia: Number(tarea.fechaEntrega.split('-')[2]),
                titulo: tarea.titulo,
            };
        });
    });

    diasPendientes = computed(() => {
        const tareas = this.tareasPendientes();
        if (!tareas) return [];
        return tareas.map((tarea) => Number(tarea.fechaEntrega.split('-')[2]));
    });

    fechas = computed(() => {
        const tareas = this.tareasPendientes();
        if (!tareas) return [];
        return tareas.map((tarea) => new Date(tarea.fechaEntrega+'T00:00:00'));
    });
}
