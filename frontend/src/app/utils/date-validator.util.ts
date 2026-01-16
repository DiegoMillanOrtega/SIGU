/**
 * Crea una fecha local ignorando la zona horaria UTC.
 * Si recibe "2026-01-05", garantiza que sea el 5 de enero en hora local.
 */
const normalizarFecha = (input: string | Date): Date => {
  if (input instanceof Date) {
    const d = new Date(input.getTime());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Si es string "YYYY-MM-DD", dividimos las partes manualmente
  // Esto evita el desfase de zona horaria (UTC vs Local)
  const [year, month, day] = input.split('-').map(Number);
  // month - 1 porque en JS los meses empiezan en 0 (Enero = 0)
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export function esFechaAtrasada(fechaInput: string): boolean {
  const hoy = normalizarFecha(new Date());
  const fecha = normalizarFecha(fechaInput);

  return fecha.getTime() < hoy.getTime();
}

export function esFechaHoy(fechaInput: string): boolean {
  const hoy = normalizarFecha(new Date());
  const fecha = normalizarFecha(fechaInput);

  return fecha.getTime() === hoy.getTime();
}