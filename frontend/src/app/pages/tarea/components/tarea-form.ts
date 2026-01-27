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
    model,
    output,
    signal,
    untracked,
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
import { Router, RouterLink } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TareaResponse } from '@/interface/tarea-response.interface';
import { DividerModule } from 'primeng/divider';
import { TareaRequest } from '@/interface/tarea-request.interface';
import { TareaPatchRequest } from '@/interface/tarea-patch-request.interface';

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
        FloatLabelModule,
        DialogModule,
        DividerModule,
    ],
    templateUrl: 'tarea-form.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TareaForm {
    // Providers
    private readonly fb = inject(FormBuilder);

    // Inputs y Models
    tarea = input<TareaResponse | null>(null);
    visible = model(false);

    // Outputs
    onSave = output<TareaRequest>();
    onUpdate = output<Partial<TareaRequest>>();

    // Estado local
    formEnviado = signal(false);

    // Recursos
    private readonly materiaService = inject(MateriaService);
    private readonly archivoService = inject(ArchivoService);

    materias = this.materiaService.getAllMateriasBySemestreActivo();
    archivos = this.archivoService.getAllArchivosBySemestreActive();

    // Logica Derivada
    esEdicion = computed<boolean>(() => !!this.tarea());
    headerText = computed<string>(() =>
        this.esEdicion() ? 'Editar tarea' : 'Nueva tarea',
    );

    // Options
    prioridades = [
        { label: 'Alta', value: 'ALTA' },
        { label: 'Media', value: 'MEDIA' },
        { label: 'Baja', value: 'BAJA' },
    ];

    form = this.fb.nonNullable.group({
        id: [''],
        titulo: [
            '',
            [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
            ],
        ],
        descripcion: [''],
        prioridad: ['', Validators.required],
        fechaEntrega: ['', Validators.required],
        estado: [''],
        materiaId: ['', Validators.required],
        archivoId: [''],
    });

    constructor() {
        effect(() => {
            console.log('llegue');
            
            const data = this.tarea();
            const visible = this.visible();
            const idEnFormulario = this.form.get('id')?.value;

            if (!visible) {
                this.form.reset();
                return;
            }

            if (data && data.id !== idEnFormulario) {
                this.form.patchValue(data, { emitEvent: false });
            }

            if (!data && idEnFormulario !== '') {
                this.form.reset()
            }

            this.formEnviado.set(false);
        });
    }

    get f() {
        return this.form.controls;
    }

    controlInvalido(name: keyof typeof this.form.controls): boolean {
        const control = this.form.controls[name];
        return !!(control?.invalid && (control.touched || this.formEnviado()));
    }

    enviar() {
        this.formEnviado.set(true);

        if (this.form.invalid) return;

        const rawValue = this.form.getRawValue();

        if (this.esEdicion()) {
            this.onUpdate.emit(this.getDirtyValues());
        } else {
            this.onSave.emit(rawValue as TareaRequest);
        }

        this.formEnviado.set(false);
    }

    getDirtyValues(): Partial<TareaRequest> {
        const dirtyValues: any = {};

        Object.keys(this.form.controls).forEach((key) => {
            const control = this.form.get(key);
            if (control?.dirty) {
                dirtyValues[key] = control.value;
            }
        });

        return dirtyValues;
    }
}
