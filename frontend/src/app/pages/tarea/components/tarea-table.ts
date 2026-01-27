import { TareaResponse } from '@/interface/tarea-response.interface';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FormatDateCustomPipe } from 'src/shared/pipes/format-date-custom.pipe';
import { PrioridadSeverityPipe } from 'src/shared/pipes/prioridad.pipe';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MateriaService } from '@/pages/service/materia.service';
import { DatePickerModule } from 'primeng/datepicker';
import { formatDate } from '@/utils/date-formatter.util';
import { EstadoTareaSeverityPipe } from 'src/shared/pipes/estado-tarea-severity.pipe';


@Component({
    standalone: true,
    imports: [
        TableModule,
        FormatDateCustomPipe,
        TagModule,
        PrioridadSeverityPipe,
        MenuModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        SelectModule,
        FormsModule,
        DatePickerModule,
        EstadoTareaSeverityPipe
    ],
    selector: 'app-tarea-table',
    templateUrl: 'tarea-table.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TareaTable {
    // Providers
    private materiaService = inject(MateriaService);

    // Inputs 
    tareas = input.required<TareaResponse[]>();
    headerTable = input('Titulo tabla');

    // Outputs
    onStatusChange = output<TareaResponse>();
    onEditTarea = output<TareaResponse>();
    onDelete = output<string>();

    // Recursos
    materiasResource = this.materiaService.getAllMateriasBySemestreActivo();

    // Variables
    tareaEstados = [
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Completada', value: 'COMPLETADA' },
    ];

    optionsPrioridad: Array<{ label: string, value: string }> = [
        { label: 'Alta', value: 'ALTA' },
        { label: 'Media', value: 'MEDIA' },
        { label: 'Baja', value: 'BAJA' },
    ];

    // Estado local
    tareaSeleccionada = signal<TareaResponse | null>(null);

    tareasChecked = computed(() => {
        return this.tareas().filter(t => t.estado === 'COMPLETADA')
    })

    items = computed<MenuItem[]>(() => {
        const seleccionada = this.tareaSeleccionada();
        if (!seleccionada) return [];

        const menu: MenuItem[] = [
            { label: 'Ver', icon: 'pi pi-eye' },
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => this.onEditTarea.emit(seleccionada),
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => {
                    this.onDelete.emit(seleccionada.id);
                },
            },
        ];

        if (seleccionada.archivoView) {
            menu.push({
                label: 'Ver archivo',
                icon: 'pi pi-file',
                command: () => window.open(seleccionada.archivoView, '_blank'), // Ejemplo de acción
            });
        }

        return menu;
    });

    cambiarEstado(tarea: any, completada: boolean) {
        const nuevoEstado: TareaResponse = {
            ...tarea,
            estado: completada ? 'COMPLETADA' : 'PENDIENTE',
        };

        this.onStatusChange.emit(nuevoEstado);
    }

    formatearFecha(fecha: Date): string {
        console.log(fecha);
        console.log('fecha formateada', formatDate(fecha));
        
        
        return formatDate(fecha);
    }
}
