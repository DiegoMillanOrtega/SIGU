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
import { Router, RouterLink } from '@angular/router';
import { TareaService } from '../service/tarea.service';
import { TareaResponse } from '@/interface/tarea-response.interface';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoadingSpinnerOverlayComponent } from '@/layout/component/app.loadingspinneroverlay';
import { TareaPatchRequest } from '@/interface/tarea-patch-request.interface';
import { LoadingComponent } from '@/layout/component/app.loading';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { MateriaService } from '../service/materia.service';
import { TareaTable } from './components/tarea-table';
import { PickListModule } from 'primeng/picklist';
import { TareaForm } from './components/tarea-form';
import { TareaRequest } from '@/interface/tarea-request.interface';
import { finalize, Observable } from 'rxjs';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-tarea',
    standalone: true,
    imports: [
        CardModule,
        ToolbarModule,
        SelectButtonModule,
        FormsModule,
        ButtonModule,
        LoadingSpinnerOverlayComponent,
        LoadingComponent,
        MenuModule,
        SelectModule,
        TareaTable,
        PickListModule,
        TareaForm,
        DividerModule
    ],
    templateUrl: 'tarea.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Tarea {
    //Providers
    private readonly tareaService = inject(TareaService);
    private readonly materiaService = inject(MateriaService);
    private readonly messageService = inject(MessageService);
    private readonly confirmationService = inject(ConfirmationService);

    // Estado UI
    loading = signal(false);
    formVisible = signal(false);
    tareaSeleccionada = signal<TareaResponse | null>(null);

    //Resources
    tareasResource = this.tareaService.getTareas();
    materiasResource = this.materiaService.getAllMateriasBySemestreActivo();

    //Computeds
    readonly tareasPendientes = computed(() => 
        this.tareasResource.value()?.filter(t => t.estado === 'PENDIENTE') ?? []
    );

    readonly tareasCompletadas = computed(() => 
        this.tareasResource.value()?.filter(t => t.estado === 'COMPLETADA') ?? []
    );

    /**
     * Helper genérico para manejar peticiones y estados de carga/error.
     * Esto reduce el boilerplate de los subscribes.
     */
    private executeAction<T>(obs$: Observable<T>, successMsg: string, callback: (res: T) => void) {
        this.loading.set(true);
        obs$.pipe(
            finalize(() => this.loading.set(false))
        ).subscribe({
            next: (res) => {
                this.notify('success', 'Éxito', successMsg);
                callback(res);
            },
            error: (err) => this.notify('error', 'Error', err.error?.message || 'Error inesperado')
        });
    }

    private notify(severity: 'success' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }

    // --- Acciones ---

    actualizarTareaEstado(tarea: TareaResponse) {
        
        this.executeAction(
            this.tareaService.actualizarEstadoTarea(tarea.id, tarea.estado),
            'Estado actualizado',
            () => this.tareasResource.reload()
        );
    }

    crearTarea(nuevaTarea: TareaRequest) {
        nuevaTarea.estado = 'PENDIENTE';
        this.executeAction(
            this.tareaService.create(nuevaTarea),
            `Tarea ${nuevaTarea.titulo} creada`,
            (tareaCreada) => {
                this.tareasResource.update(actuales => [tareaCreada, ...(actuales ?? [])]);
                this.formVisible.set(false);
            }
        );
    }

    actualizarTarea(tarea: Partial<TareaRequest>) {
        console.log(tarea);
        
        // const id = this.tareaSeleccionada()?.id;
        // if (!id) return;

        // this.executeAction(
        //     this.tareaService.patchTarea(id, tarea),
        //     'Tarea actualizada',
        //     (actualizada) => {
        //         this.tareasResource.update(actuales => 
        //             actuales?.map(t => t.id === id ? actualizada : t) ?? []
        //         );
        //         this.formVisible.set(false);
        //     }
        // );
    }

    eliminarTarea(id: string) {
        this.confirmationService.confirm({
            key: 'globalConfirm',
            header: 'Confirmar eliminación',
            message: '¿Estás seguro de eliminar esta tarea?',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.executeAction(
                    this.tareaService.deleteTarea(id),
                    'Tarea eliminada',
                    () => this.tareasResource.update(actuales => actuales?.filter(t => t.id !== id) ?? [])
                );
            }
        });
    }
}
