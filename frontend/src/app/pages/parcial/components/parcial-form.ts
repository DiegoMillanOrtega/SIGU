import {
    Parcial,
    ParcialEstado,
    ParcialPrioridad,
    ParcialRequest,
    ParcialTipo,
} from '@/interface/parcial.interface';
import { LoadingComponent } from '@/layout/component/app.loading';
import { LoadingSpinnerOverlayComponent } from '@/layout/component/app.loadingspinneroverlay';
import { MateriaService } from '@/pages/service/materia.service';
import { ParcialService } from '@/pages/service/parcial.service';
import {
    formatDate,
    formatFormDates,
    getTimeFromDate,
    timeToDate,
} from '@/utils/date-formatter.util';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    linkedSignal,
    model,
    OnInit,
    output,
    signal,
    untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';

@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        DialogModule,
        SelectModule,
        DatePickerModule,
        TextareaModule,
        ButtonModule,
        LoadingComponent,
        SelectButtonModule,
        MessageModule,
        InputTextModule,
        LoadingSpinnerOverlayComponent,
    ],
    selector: 'app-parcial-form.',
    templateUrl: 'parcial-form.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParcialForm {
    private fb = inject(FormBuilder);
    private materiaService = inject(MateriaService);
    private messageService = inject(MessageService);
    private parcialService = inject(ParcialService);

    materias = this.materiaService.getAllMateriasBySemestreActivo();

    formEnviado = signal(false);
    loading = signal(false);

    parcialInput = input<Parcial | null>(null);
    parcial = linkedSignal(() => this.parcialInput());
    fecha = input<Date | null>(null);
    visible = model<boolean>(false);
    onFormSubmit = output();


    esEdicion = computed(() => {
        console.log(this.parcial());
        return !!this.parcial();
    });

    tipos: Array<{ label: string; value: ParcialTipo; icon?: string }> = [
        { label: 'Examen', value: 'EXAMEN', icon: 'pi pi-file-check' },
        { label: 'Quiz', value: 'QUIZ', icon: 'pi pi-bolt' },
        { label: 'Parcial', value: 'PARCIAL', icon: 'pi pi-clipboard' },
    ];

    prioridades: Array<{
        label: string;
        value: ParcialPrioridad;
        icon: string;
    }> = [
        { label: 'Alta', value: 'ALTA', icon: 'pi pi-flag-fill text-status-critical' },
        { label: 'Media', value: 'MEDIA', icon: 'pi pi-flag-fill text-status-warning' },
        { label: 'Baja', value: 'BAJA', icon: 'pi pi-flag-fill text-status-safe' },
    ];

    form = this.fb.group({
        id: [''],
        fecha: ['', Validators.required],
        hora: [null as Date | null, Validators.required],
        materiaId: ['', Validators.required],
        temaEvaluar: [''],
        tipo: ['', Validators.required],
        estado: ['PENDIENTE'],
        notaAdicional: [''],
        lugar: [''],
        prioridad: [''],
    });

    constructor() {
        effect(() => {
            const parcial = this.parcial();

            if (!parcial) {
                return;
            }

            untracked(() => {
                this.form.patchValue({
                    ...parcial,
                    hora: timeToDate(parcial.hora),
                    materiaId: parcial.materiaId,
                });
            });
        });

        effect(() => {
            const fecha = this.fecha();
            if (!fecha) return;

            untracked(() => {
                this.form.patchValue({
                    fecha: formatDate(fecha),
                });
            });
        });

        effect(() => {
            const visible = this.visible();
            if (!visible) {
                this.formEnviado.set(false);
                this.parcial.set(null);
                untracked(() => {
                    this.form.reset();
                });
            }
        });
    }

    controlInvalido(name: string): boolean {
        const control = this.form.get(name);
        return !!(control?.invalid && (control.touched || this.formEnviado()));
    }

    formToParcial(): ParcialRequest {
        const parcial = this.form.getRawValue();

        return {
            materiaId: parcial.materiaId!,
            temaEvaluar: parcial.temaEvaluar!,
            notaAdicional: parcial.notaAdicional!,
            lugar: parcial.lugar!,
            tipo: parcial.tipo as ParcialTipo,
            estado: parcial.estado as ParcialEstado,
            prioridad: parcial.prioridad as ParcialPrioridad,
            hora: getTimeFromDate(parcial.hora!),
            fecha: parcial.fecha!,
        };
    }

    guardarForm() {
        this.formEnviado.set(true);

        console.log(this.form.value);

        if (this.form.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, rellena todos los campos',
            });
            return;
        }

        this.loading.set(true);

        const parcial = this.formToParcial();

        console.log(parcial);
        this.parcialService.saveParcial(parcial).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Parcial ${this.esEdicion() ? 'actualizado' : 'creado'} correctamente`,
                });
                this.visible.set(false);
                this.onFormSubmit.emit();
            },
            error: (err) => {
                console.error(err);

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error || 'Error al procesar la solicitud',
                });
                this.loading.set(false);
            },
            complete: () => {
                this.formEnviado.set(false);
                this.loading.set(false);
            },
        });
    }
}
