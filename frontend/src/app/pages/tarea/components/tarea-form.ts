import { ArchivoService } from '@/pages/service/archivo.service';
import { MateriaService } from '@/pages/service/materia.service';
import { TareaService } from '@/pages/service/tarea.service';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { formatFormDates } from '@/utils/date-formatter.util';
import { MessageService } from 'primeng/api';
import { LoadingSpinnerOverlayComponent } from '@/layout/component/app.loadingspinneroverlay';
import { LoadingComponent } from '@/layout/component/app.loading';
import { Router, RouterLink } from "@angular/router";
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-tarea-form',
    standalone: true,
    imports: [
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    LoadingSpinnerOverlayComponent,
    LoadingComponent,
    RouterLink,
    FloatLabelModule
],
    templateUrl: 'tarea-form.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TareaForm {
    // Providers
    private materiaService = inject(MateriaService);
    private archivoService = inject(ArchivoService);
    private tareaService = inject(TareaService);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);
    private router = inject(Router);

    formEnviado = signal(false);
    loading = signal(false);

    readonly id = input<string>('');

    esEdicion = computed<boolean>(() => !!this.id());
    headerText = computed<string>(() =>
        this.esEdicion() ? 'Editar tarea' : 'Nueva tarea',
    );

    //Resources
    materias = this.materiaService.getAllMateriasBySemestreActivo();
    archivos = this.archivoService.getAllArchivosBySemestreActive();
    tarea = this.tareaService.getTarea(this.id);

    // Options
    prioridades = [
        { label: 'Alta', value: 'ALTA' },
        { label: 'Media', value: 'MEDIA' },
        { label: 'Baja', value: 'BAJA' },
    ];

    tareaForm = this.fb.group({
        titulo: ['', Validators.required],
        descripcion: [''],
        prioridad: ['', Validators.required],
        fechaEntrega: ['', Validators.required],
        estado: [''],
        materiaId: ['', Validators.required],
        archivoId: [''],
    });

    constructor() {
        effect(() => {
            const tarea = this.tarea.value();
            if (!tarea) return;

            this.tareaForm.patchValue({
                ...tarea,
                materiaId: tarea.materiaId,
                archivoId: tarea.archivoId,
                fechaEntrega: tarea.fechaEntrega
            });
        });
    }

    controlInvalido(name: string): boolean {
        const control = this.tareaForm.get(name);
        return !!(control?.invalid && (control.touched || this.formEnviado()));
    }

    onSubmit() {
        this.formEnviado.set(true);
        if (this.tareaForm.invalid) return;

        const payload = formatFormDates(this.tareaForm.value);
        
        if (!this.esEdicion()) {
            payload.estado = 'PENDIENTE';
        } 

        this.loading.set(true);
        this.tareaService.saveTarea(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Tarea ${this.esEdicion() ? 'actualizada' : 'creada'} correctamente`,
                });
                this.router.navigate(['/pages/tareas']);
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
            }
        });
    }
}
