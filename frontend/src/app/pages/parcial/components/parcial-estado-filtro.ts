import { ParcialEstado } from '@/interface/parcial.interface';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    input,
    OnInit,
    output,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    standalone: true,
    imports: [ButtonModule, SelectButtonModule, FormsModule],
    selector: 'app-parcial-estado-filtro',
    templateUrl: 'parcial-estado-filtro.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParcialEstadoFiltro {
    activeFilter = signal<ParcialEstado>('all');
    onFilterChange = output<ParcialEstado>();

    filtros: Array<{ label: string; value: ParcialEstado; icon?: string }> = [
        { label: 'Todos', value: 'all', icon: undefined },
        { label: 'Pendiente', value: 'PENDIENTE', icon: 'pi pi-clock' },
        { label: 'Completado', value: 'COMPLETADO', icon: 'pi pi-check' },
    ];

    constructor() {
        effect(() => {
            const filter = this.activeFilter();
            this.onFilterChange.emit(filter);
        });
    }
}
