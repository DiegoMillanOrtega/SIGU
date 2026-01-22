import { Parcial } from '@/interface/parcial.interface';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    OnInit,
    output,
    signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    standalone: true,
    imports: [CardModule, ButtonModule],
    selector: 'app-parcial-calendario',
    templateUrl: 'parcial-calendario.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParcialCalendario {
    parciales = input<Parcial[]>();
    selectedDate = input<Date | null>(null);

    // Output
    dateSelect = output<Date>();
    onEditParcial = output<Parcial>();

    currentDate = signal(new Date(2026, 0, 16));

    days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    months = [
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

    // Lógica reactiva para generar los días del mes
    calendarDays = computed(() => {
        const curr = this.currentDate();
        const year = curr.getFullYear();
        const month = curr.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        const daysInMonth = lastDayOfMonth.getDate();

        const daysArray = [];

        // Celdas vacías
        for (let i = 0; i < startingDayOfWeek; i++) {
            daysArray.push({ empty: true });
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            daysArray.push({
                empty: false,
                day,
                date,
                isToday: this.checkIsToday(day, month, year),
                isSelected: this.checkIsSelected(day, month, year),
                dayExams: this.getExamsForDate(day, month, year),
            });
        }

        return daysArray;
    });

    get currentMonthLabel() {
        return this.months[this.currentDate().getMonth()];
    }

    get currentYear() {
        return this.currentDate().getFullYear();
    }

    prevMonth() {
        const d = this.currentDate();
        this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }

    nextMonth() {
        const d = this.currentDate();
        this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }

    onDayClick(date: Date) {
        this.dateSelect.emit(date);
    }

    getPriorityColor(priority: string): string {
        switch (priority) {
            case 'high':
                return 'bg-priority-high';
            case 'medium':
                return 'bg-priority-medium';
            case 'low':
                return 'bg-priority-low';
            default:
                return 'bg-primary';
        }
    }

    private getExamsForDate(day: number, month: number, year: number) {
        const parciales = this.parciales();
        if (!parciales) return [];

        return parciales.filter((parcial) => {
            const examDate = new Date(parcial.fecha + 'T00:00:00');
            return (
                examDate.getDate() === day &&
                examDate.getMonth() === month &&
                examDate.getFullYear() === year
            );
        });
    }

    private checkIsToday(day: number, month: number, year: number) {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    }

    private checkIsSelected(day: number, month: number, year: number) {
        const selected = this.selectedDate();
        if (!selected) return false;
        return (
            day === selected.getDate() &&
            month === selected.getMonth() &&
            year === selected.getFullYear()
        );
    }
}
