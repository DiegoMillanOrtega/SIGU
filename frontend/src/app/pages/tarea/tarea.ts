import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TareaCalendario } from './components/tarea-calendario';
import { Router, RouterLink } from '@angular/router';
import { TareaService } from '../service/tarea.service';
import { TareaResponse } from '@/interface/tarea-response.interface';
import { TareaPanel } from './components/tarea-panel';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoadingSpinnerOverlayComponent } from '@/layout/component/app.loadingspinneroverlay';
import { TareaPatchRequest } from '@/interface/tarea-patch-request.interface';
import { LoadingComponent } from '@/layout/component/app.loading';
import { TareaAtrasadaPipe } from 'src/shared/pipes/tarea-atrasada.pipe';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { MateriaService } from '../service/materia.service';
import { esFechaAtrasada, esFechaHoy } from '@/utils/date-validator.util';

@Component({
    selector: 'app-tarea',
    standalone: true,
    imports: [
        CardModule,
        ToolbarModule,
        SelectButtonModule,
        FormsModule,
        ButtonModule,
        TareaCalendario,
        RouterLink,
        TareaPanel,
        LoadingSpinnerOverlayComponent,
        LoadingComponent,
        TareaAtrasadaPipe,
        MenuModule,
        SelectModule,
    ],
    templateUrl: 'tarea.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Tarea {
    private tareaService = inject(TareaService);
    private messageService = inject(MessageService);
    private router = inject(Router);
    private materiaService = inject(MateriaService);
    private ConfirmationService = inject(ConfirmationService);

    //Variables
    loading = signal(false);
    materiaSeleccionada = signal<string | undefined>(undefined);

    tareasPendientes = this.tareaService.getTareas(
        this.materiaSeleccionada,
        'PENDIENTE',
    );
    tareasCompletadas = this.tareaService.getTareas(undefined, 'COMPLETADA');
    
    materiasResource = this.materiaService.getAllMateriasBySemestreActivo();

    //Computeds
    tareasAtrasadas = computed<TareaResponse[]>(() => {
        const tareas = this.tareasPendientes.value();
        if (!tareas) return [];
        return tareas.filter((tarea) => esFechaAtrasada(tarea.fechaEntrega));
    });

    tareasHoy = computed<TareaResponse[]>(() => {
        const tareas = this.tareasPendientes.value();
        if (!tareas) return [];
        return tareas.filter((tarea) => esFechaHoy(tarea.fechaEntrega));
    });

    tareasPendientesFiltrada = computed<TareaResponse[]>(() => {
        const tareas = this.tareasPendientes.value();
        const sort = this.sortValue();

        if (!tareas) return [];

        switch (sort) {
            case 'todos':
                return tareas;
            case 'hoy':
                return this.tareasHoy() || [];
            case 'atrasadas':
                return this.tareasAtrasadas() || [];
            default:
                return tareas;
        }
    });

    sectionValue = signal('tablero');
    date = signal(new Date());
    sortValue = signal('todas');

    sectionOptions = [
        { label: 'Tablero', value: 'tablero', icon: 'pi pi-table' },
        {
            label: 'Calendario',
            value: 'calendario',
            icon: 'pi pi-calendar-clock',
        },
    ];

    sortOptions: MenuItem[] = [
        {
            label: 'Ordernar por',
            items: [
                {
                    label: 'Todas',
                    value: 'todas',
                    command: () => this.sortValue.set('todos'),
                },
                {
                    label: 'Hoy',
                    value: 'hoy',
                    command: () => this.sortValue.set('hoy'),
                },
                {
                    label: 'Atrasadas',
                    value: 'atrasadas',
                    command: () => this.sortValue.set('atrasadas'),
                },
            ],
        },
    ];

    cambiarEstadoTarea(tarea: TareaResponse) {
        this.loading.set(true);

        const payload: TareaPatchRequest = {
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            fechaEntrega: tarea.fechaEntrega,
            prioridad: tarea.prioridad,
            materiaId: tarea.materiaId,
            estado: tarea.estado,
            archivoId: tarea.archivoId,
        };

        this.tareaService.patchTarea(tarea.id, payload).subscribe({
            next: () => {
                this.tareasPendientes.reload();
                this.tareasCompletadas.reload();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        err.error?.message || 'Error al procesar la solicitud',
                });
                this.loading.set(false);
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }

    redirectToEditar(id: string) {
        this.router.navigate(['/pages/tareas/editar/' + id]);
    }

    abrirEnlanceArchivo(tarea: TareaResponse) {
        if (tarea.archivoView) {
            window.open(tarea.archivoView, '_blank');
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Tarea sin archivo',
                detail: 'No se encontró el archivo asociado a la tarea',
                life: 5000,
            });
        }
    }

    eliminarTarea(id: string) {
        this.ConfirmationService.confirm({
            key: 'globalConfirm',
            message: '¿Estás seguro de que deseas eliminar la tarea?',
            header: 'Eliminar tarea',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.loading.set(true);
                this.tareaService.deleteTarea(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Tarea eliminada correctamente',
                            detail: `La tarea con id ${id} ha sido eliminada correctamente`,
                        });
                        this.tareasPendientes.reload();
                        this.tareasCompletadas.reload();
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.error?.message || 'Error al procesar la solicitud',
                        });
                        this.loading.set(false);
                    },
                    complete: () => {
                        this.loading.set(false);
                    },
                });
            },
        });
    }
}
