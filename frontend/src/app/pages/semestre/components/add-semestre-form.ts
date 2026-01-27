import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DividerModule } from 'primeng/divider';
import {
    CargaAcademica,
    SemestreInterface,
    SemestreStatus,
} from '@/interface/semestre.interface';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SemestreService } from '@/pages/service/semestre.service';
import { formatFormDates } from '@/utils/date-formatter.util';
import { AuthService } from 'src/core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { EstadoSemestreColorPipe } from 'src/shared/pipes/estado-semestre.pipe';
import { LoadingComponent } from "@/layout/component/app.loading";
import { TareaRequest } from '@/interface/tarea-request.interface';

@Component({
    selector: 'app-add-semestre-form',
    imports: [
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    SelectModule,
    IftaLabelModule,
    DividerModule,
    ButtonModule,
    RouterLink,
    ToastModule,
    MessageModule,
    EstadoSemestreColorPipe,
    LoadingComponent
],
    standalone: true,
    templateUrl: 'add-semestre-form.html',
})
export default class AddSemestreForm {
    
    private formBuilder = inject(FormBuilder);
    private semestreService = inject(SemestreService);
    private router = inject(Router);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);


    readonly id = input<string>('');

    loading = signal(false);

    esEdicion = computed(() => !!this.id());
    headerText = computed(() =>
        this.esEdicion() ? 'Editar semestre' : 'Agregar nuevo semestre',
    );
    labelButtonText = computed(() =>
        this.esEdicion() ? 'Editar semestre' : 'Crear semestre',
    );
    formEnviado: boolean = false;
    
    semestreResource = this.semestreService.obtenerSemestrePorId(this.id);

    estadoOptions: { label: string; value: SemestreStatus }[] = [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Finalizado', value: 'FINALIZADO' },
        { label: 'Planificado', value: 'PLANIFICADO' },
    ];

    semestreForm = this.formBuilder.group({
        id: [null as string | null],
        nombre: ['', Validators.required],
        cargaAcademica: [''],
        fechaInicio: [null as Date | null, Validators.required],
        fechaFin: [null as Date | null, Validators.required],
        estado: ['', Validators.required],
    });

    constructor() {
        effect(() => {
            const semestre = this.semestreResource.value();
            if (!semestre) return;

            this.setSemestreForm(semestre);
        })
    }

    esInvalido(controlName: string) {
        const control = this.semestreForm.get(controlName);
        return control?.invalid && (control.touched || this.formEnviado);
    }


    setSemestreForm(semestre: SemestreInterface) {
        console.log(semestre);

        this.semestreForm.patchValue({
            ...semestre,
            fechaInicio: semestre.fechaInicio
                ? new Date(semestre.fechaInicio + 'T00:00:00')
                : null,
            fechaFin: semestre.fechaFin
                ? new Date(semestre.fechaFin + 'T00:00:00')
                : null,
        });
    }

    onSubmit() {
        this.formEnviado = true;
        console.log(this.semestreForm.invalid);

        if (this.semestreForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe completar todos los campos obligatorios',
            });
            return;
        };

        const payload: SemestreInterface = formatFormDates(
            this.semestreForm.value,
        );

        const userId = this.authService.getUserId();

        if (userId) {
            payload.usuarioId = userId;
        }

        this.loading.set(true);

        const request$ = this.esEdicion()
            ? this.semestreService.actualizarSemestre(this.id(), this.getDirtyValues())
            : this.semestreService.guardaSemestre(payload);

        
        request$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: `Semestre ${this.esEdicion() ? 'actualizado' : 'creado'} correctamente`,
                    life: 3000,
                });
                this.router.navigate(['/pages/semestres']);
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
                this.formEnviado = false;
                this.loading.set(false);
            },
        });
    }

    getDirtyValues(): Partial<SemestreInterface> {
        const dirtyValues: any = {};

        Object.keys(this.semestreForm.controls).forEach((key) => {
            const control = this.semestreForm.get(key);
            if (control?.dirty) {
                dirtyValues[key] = control.value;
            }
        });

        return dirtyValues;
    }
}
