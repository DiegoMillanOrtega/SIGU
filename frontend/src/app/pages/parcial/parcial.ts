import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { ParcialEstadoFiltro } from './components/parcial-estado-filtro';
import { ParcialEstado } from '@/interface/parcial.interface';
import { ParcialCalendario } from './components/parcial-calendario';
import { ParcialLista } from './components/parcial-lista';
import { ParcialService } from '../service/parcial.service';
import { ParcialForm } from './components/parcial-form';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { Parcial } from '@/interface/parcial.interface';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingSpinnerOverlayComponent } from '@/layout/component/app.loadingspinneroverlay';

@Component({
    standalone: true,
    imports: [
        ParcialEstadoFiltro,
        ParcialCalendario,
        ParcialLista,
        ParcialForm,
        DatePickerModule,
        ButtonModule,
        ToolbarModule,
        LoadingSpinnerOverlayComponent
    ],
    selector: 'app-parcial',
    templateUrl: 'parcial.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParcialComponent {
    private parcialService = inject(ParcialService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    visibleForm = signal<boolean>(false);
    parcialSeleccionado = signal<Parcial | null>(null);
    fechaSeleccionada = signal<Date | null>(null);
    loading = signal(false);

    activeFilter = signal<ParcialEstado>('all');
    parcialesResource = this.parcialService.getParcialesSemestreActivo();

    parcialesFiltrados = computed(() => {
        const parciales = this.parcialesResource.value();
        const filter = this.activeFilter();

        if (!parciales) return [];

        if (filter === 'all') return parciales;

        return parciales.filter((parcial) => {
            return parcial.estado === filter;
        });
        
    });

    constructor() {
        effect(() => {
            const parcial = this.parcialSeleccionado();
            if (!parcial) return;
            this.visibleForm.set(true);
        })

        effect(() => {
            const fecha = this.fechaSeleccionada();
            if (!fecha) return;
            this.visibleForm.set(true);
        })
    }

    deleteParcial(id: string) {
        this.confirmationService.confirm({
            key: 'globalConfirm',
            message: '¿Estás seguro de que quieres eliminar el parcial?',
            header: 'Eliminar parcial',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.loading.set(true);

                this.parcialService.deleteParcial(id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Parcial eliminado correctamente',
                            detail: 'El parcial se ha eliminado correctamente',
                        });

                        this.parcialesResource.reload();
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.error.message,
                        });

                        this.loading.set(false);
                    },
                    complete: () => {
                        this.loading.set(false);
                    },
                });
            },
            reject: () => {},
        }); 
    }
}
