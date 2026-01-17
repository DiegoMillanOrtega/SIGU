import { TareaResponse } from '@/interface/tarea-response.interface';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { DiaPendientePipe } from 'src/shared/pipes/dia-pendiente.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { TituloTareaDiaPendientePipe } from 'src/shared/pipes/titulo-tarea-dia-pendiente.pipe';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { esFechaHoy } from '@/utils/date-validator.util';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tarea-calendario',
    standalone: true,
    imports: [
        DatePickerModule,
        DiaPendientePipe,
        TooltipModule,
        TituloTareaDiaPendientePipe,
        PanelModule,
        FormsModule,
        CardModule,
        ButtonModule,
    ],
    templateUrl: 'tarea-calendario.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TareaCalendario {
    private router = inject(Router);

    tareasPendientes = input<TareaResponse[]>();

    currentDate = signal(new Date());

    monthNames = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];

    weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Lógica computada para el calendario
    calendarDays = computed(() => {
        const date = this.currentDate();
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Espacios vacíos mes anterior
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({ day: null, fullDate: null });
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(year, month, day);
            days.push({
                day,
                fullDate,
                isToday: new Date().toDateString() === fullDate.toDateString(),
                tasks: this.getTasksForDate(fullDate),
            });
        }

        return days;
    });

    get currentMonthName() {
        return this.monthNames[this.currentDate().getMonth()];
    }

    get currentYear() {
        return this.currentDate().getFullYear();
    }

    previousMonth() {
        const d = this.currentDate();
        this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }

    nextMonth() {
        const d = this.currentDate();
        this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }

    goToToday() {
        this.currentDate.set(new Date());
    }

    private getTasksForDate(date: Date) {
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);

        const tareas = this.tareasPendientes();
        if (!tareas) return [];

        return tareas.filter((tarea) => {
            const tareaDate = new Date(tarea.fechaEntrega + 'T00:00:00');
            tareaDate.setHours(0, 0, 0, 0);
            return tareaDate.getTime() === compareDate.getTime();
        });
    }

    handleTaskClick(task: TareaResponse) {
        this.router.navigate(['/pages/tareas/editar', task.id]);
    }
}
