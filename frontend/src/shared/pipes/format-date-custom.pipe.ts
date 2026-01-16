import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateCustom',
  standalone: true // En Angular 20, standalone es el estándar
})
export class FormatDateCustomPipe implements PipeTransform {

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    // Convertimos a objeto Date si es un string
    // Agregamos 'T00:00:00' para evitar que se reste un día por la zona horaria local
    const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;

    if (isNaN(date.getTime())) return 'Fecha inválida';

    // Configuramos el formateador de Intl
    const formatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'short', // "sáb"
      day: 'numeric',   // "10"
      month: 'short'    // "ene"
    });

    // Formateamos: "sáb., 10 ene."
    let formatted = formatter.format(date);

    // Limpieza estética opcional (quitar puntos de abreviación y ajustar conectores)
    // Resultado deseado: "sáb, 10 de ene"
    formatted = formatted.replace('.', ''); // Quita puntos de "sáb." o "ene."
    
    const parts = formatted.split(' '); 
    // parts[0] = día semana, parts[1] = número, parts[2] = mes
    return `${parts[0]} ${parts[1]} de ${parts[2]}`;
  }
}