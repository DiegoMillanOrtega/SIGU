import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';

export default [
    { path: 'semestres', loadChildren: () => import('./semestre/semestre.routes') },
    { path: 'materias', loadChildren: () => import('./materia/materia.routes') },
    { path: 'archivos', loadChildren: () => import('./archivo/archivo.routes') },
    { path: 'tareas', loadChildren: () => import('./tarea/tarea.routes') },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
