import { Parcial } from '@/interface/parcial.interface';
import { diasHasta } from '@/utils/date-validator.util';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { FormatDateCustomPipe } from 'src/shared/pipes/format-date-custom.pipe';
import { ParcialPanel } from './parcial-panel';

@Component({
    standalone: true,
    imports: [
    CardModule,
    PanelModule,
    TagModule,
    DividerModule,
    ButtonModule,
    MenuModule,
    ParcialPanel
],
    selector: 'app-parcial-lista.',
    templateUrl: 'parcial-lista.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParcialLista {
    parciales = input<Parcial[]>();

    onEditParcial = output<Parcial>();
    onDeleteParcial = output<string>();


    test = computed(() => {
        console.log(this.parciales);
    });

    diasHasta(fecha: string): number {
        return diasHasta(fecha);
    }
}
