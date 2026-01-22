import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime12',
  standalone: true // Si usas versiones anteriores a Angular 17, quita esta línea
})
export class FormatTime12Pipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // Dividir la hora y los minutos (asumiendo formato HH:mm)
    let [hours, minutes] = value.split(':').map(Number);
    
    // Determinar si es AM o PM
    const period = hours >= 12 ? 'p. m.' : 'a. m.';

    // Convertir la hora al formato 12h
    hours = hours % 12;
    hours = hours ? hours : 12; // Si la hora es 0, convertir a 12

    // Formatear minutos para que siempre tengan dos dígitos
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr} ${period}`;
  }
}