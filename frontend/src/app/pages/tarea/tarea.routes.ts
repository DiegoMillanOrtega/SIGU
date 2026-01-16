import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./tarea') },
    { path: 'agregar', loadComponent: () => import('./components/tarea-form') },
    { path: 'editar/:id', loadComponent: () => import('./components/tarea-form') },

] as Routes;