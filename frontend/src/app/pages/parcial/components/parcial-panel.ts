import { Parcial } from '@/interface/parcial.interface';
import { Component, input, OnInit, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { DiasRestantesPipe } from 'src/shared/pipes/dias-restantes.pipe';
import { FormatDateCustomPipe } from 'src/shared/pipes/format-date-custom.pipe';
import { PrioridadStyleBorderPipe } from 'src/shared/pipes/prioridad-style-border.pipe';
import { PrioridadSeverityPipe } from 'src/shared/pipes/prioridad.pipe';

@Component({
    standalone: true,
    imports: [
        TagModule,
        MenuModule,
        ButtonModule,
        PanelModule,
        PrioridadStyleBorderPipe,
        DiasRestantesPipe,
        FormatDateCustomPipe,
        PrioridadSeverityPipe,
    ],
    selector: 'app-parcial-panel',
    templateUrl: 'parcial-panel.html',
})
export class ParcialPanel {

    parcial = input.required<Parcial>();

    onParcialEdit = output<Parcial>();
    onParcialDelete = output<string>();

    items: MenuItem[] = [
        { label: 'Editar', icon: 'pi pi-pencil', command: () => {this.onParcialEdit.emit(this.parcial())} },
        { label: 'Eliminar', icon: 'pi pi-trash', command: () => {this.onParcialDelete.emit(this.parcial().id)} },
    ]
}
