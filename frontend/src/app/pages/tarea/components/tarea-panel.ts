import { TareaResponse } from '@/interface/tarea-response.interface';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { FormatDateCustomPipe } from 'src/shared/pipes/format-date-custom.pipe';
import { PrioridadSeverityPipe } from 'src/shared/pipes/prioridad.pipe';

@Component({
    selector: 'app-tarea-panel',
    standalone: true,
    imports: [
        PanelModule,
        MenuModule,
        ButtonModule,
        TagModule,
        PrioridadSeverityPipe,
        FormatDateCustomPipe,
    ],
    templateUrl: 'tarea-panel.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TareaPanel {
    tarea = input.required<TareaResponse>();
    tareaAtrasada = input<boolean>(false);
    esTareaCompletada = input<boolean>(false);

    onEstadoChange = output<TareaResponse>();
    onEditar = output<string>();
    onVerArchivo = output<TareaResponse>();
    onEliminar = output<string>();

    items = computed<MenuItem[]>(() => {
        const tarea = this.tarea();

        let items: MenuItem[] = [];

        if (tarea.estado === 'PENDIENTE') {
            items.push({
                label: 'Marcar como Completada',
                icon: 'pi pi-info-circle',
                command: () => {
                    const tarea = this.tarea();
                    tarea.estado = 'COMPLETADA';
                    this.onEstadoChange.emit(tarea);
                },
            });
        }

        if (tarea.estado === 'COMPLETADA') {
            items.push({
                label: 'Marcar como Pendiente',
                icon: 'pi pi-info-circle',
                command: () => {
                    const tarea = this.tarea();
                    tarea.estado = 'PENDIENTE';
                    this.onEstadoChange.emit(tarea);
                },
            });
        }

        items.push(
            { separator: true },
            {
                label: 'Ver archivo asociado',
                icon: 'pi pi-eye',
                command: () => this.onVerArchivo.emit(this.tarea()),
            },
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => this.onEditar.emit(this.tarea().id),
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => this.onEliminar.emit(this.tarea().id),
            },
        );

        return items;
    });
}
