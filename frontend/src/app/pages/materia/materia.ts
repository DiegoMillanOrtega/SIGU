import {
    Component,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { SemestreInterface } from '@/interface/semestre.interface';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { EstadisticasMaterias } from './components/estadisticas-materias';
import { MateriaInterface } from '@/interface/materia.interface';
import { MateriaService } from '../service/materia.service';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DetallesMateria } from './components/detalles-materia';
import { Router, RouterLink } from '@angular/router';
import { MateriaCard } from './components/materia-card';
import { MessageModule } from 'primeng/message';
import { httpResource } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SemestreService } from '../service/semestre.service';

@Component({
    selector: 'app-materia',
    imports: [
        CardModule,
        InputTextModule,
        SelectModule,
        ButtonModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        EstadisticasMaterias,
        BadgeModule,
        MenuModule,
        RouterLink,
        MateriaCard,
        MessageModule,
        ProgressSpinnerModule,
        DetallesMateria,
    ],
    templateUrl: 'materia.html',
})
export default class Materia {

    //Providers
    private router = inject(Router);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    //Services
    private materiaService = inject(MateriaService);
    private semestreService = inject(SemestreService);

    //DataApi
    semestresData = signal<SemestreInterface[]>([]);
    materiasData = signal<MateriaInterface[]>([]);

    //HttpResources
    semestresResource = this.semestreService.getAllSemestres();
    materiasResource = this.materiaService.getAllMateriasBySemestreActivo();

    //Variables
    readonly TODOS_LOS_SEMESTRES = '0';
    filterOptionSemestre = signal<string>(this.TODOS_LOS_SEMESTRES);
    filterOptionEstado = signal<string>('TODOS');
    filterInputText = signal<string>('');
    visibleModalDetalles = signal(false);
    materiaSeleccionada = signal<MateriaInterface | null>(null);

    //OptionsSelect
    optionsEstado = [
        { label: 'Todos los estados', value: 'TODOS' },
        { label: 'Activas', value: 'ACTIVA' },
        { label: 'Completadas', value: 'COMPLETADA' },
        { label: 'Canceladas', value: 'CANCELADA' },
    ];

    optionsSemestre = computed(() => {
        const base = [{ label: 'Todos los semestres', value: this.TODOS_LOS_SEMESTRES }];
        const data = this.semestresResource.value() ?? [];
        return [...base, ...data.map((s) => ({ label: s.nombre, value: s.id }))];
    })

    //Computed
    materiasFiltradas = computed(() => {
        const materias = this.materiasResource.value() ?? [];
        const query = this.filterInputText().toLocaleLowerCase().trim();
        const semId = this.filterOptionSemestre();
        const estado = this.filterOptionEstado();

        return materias.filter((m) => {
            const matchesSearch = !query ||
                [m.nombre, m.codigo, m.profesor].some(field => 
                    field.toLocaleLowerCase().includes(query)
                );
            const matchesSemestre = semId === this.TODOS_LOS_SEMESTRES || m.semestre.id === semId;
            const matchesEstado = estado === 'TODOS' || m.estado === estado;

            return matchesSearch && matchesSemestre && matchesEstado
        })
    });

    resumenFiltrado = computed(() => {
        const lista = this.materiasFiltradas();
        return {
            total: lista.length,
            creditos: lista.reduce((total, materia) => total + materia.numCreditos, 0),
            activas: lista.filter(materia => materia.estado === 'ACTIVA').length,
        }
    });

    constructor() {
        effect(() => {
            const semestres = this.semestresResource.value();
            if (!semestres || semestres.length === 0) return;

            const semestreActivo = semestres.find(s => s.estado === 'ACTIVO');
            if (semestreActivo) this.filterOptionSemestre.set(semestreActivo.id);
        });
    }

    limpiarFiltro() {
        this.filterInputText.set('');
        this.filterOptionSemestre.set(this.TODOS_LOS_SEMESTRES);
        this.filterOptionEstado.set('TODOS');
    }

    onEditMateria(id: string) {
        this.router.navigate([`/pages/materias/editar/${id}`]);
    }

    onVerDetalles(materia: MateriaInterface) {
        this.visibleModalDetalles.set(true);
        this.materiaSeleccionada.set(materia);
    }

    onDeleteMateria(materia: MateriaInterface) {
        this.confirmationService.confirm({
            key: 'globalConfirm',
            target: event?.target as HTMLElement,
            message: `¿Está seguro de que desea eliminar ${materia.nombre}? Esta acción no se puede deshacer.`,
            header: '¿Eliminar materia?',
            rejectLabel: 'Cancelar',
            rejectButtonProps: {
                label: 'Cancelar',
                icon: 'pi pi-times',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Eliminar',
                severity: 'danger',
                icon: 'pi pi-trash'
            },
            accept: () => {
                this.materiaService.eliminarMateria(materia.id).subscribe({
                    next: () => {

                        this.materiasResource.reload();
                        
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'La materia ha sido eliminada correctamente.',
                            life: 3000
                        });
                    },
                    error: (err: any) => {
                        // Es buena práctica manejar errores aquí
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.error.message,
                            life: 5000
                        });
                    }
                });
            }
        });
    }
}
