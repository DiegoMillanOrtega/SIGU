export function formatFormDates(formValue: any): any {
  const data = { ...formValue };

  Object.keys(data).forEach(key => {
    const value = data[key];
    // Si el valor es una instancia de Date, lo formateamos
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const day = value.getDate().toString().padStart(2, '0');
      
      data[key] = `${year}-${month}-${day}`;
    }
  });

  return data;
}

/**
 * Formatea una fecha local ignorando la zona horaria UTC.
 * Devuelve por ejemplo"2026-01-05"
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function timeToDate(time: string): Date {
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));
  date.setSeconds(0);
  
  console.log(date);
  return date;
}

export function getTimeFromDate(date: Date): string {  
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${hour}:${minute}:${second}`;
}

