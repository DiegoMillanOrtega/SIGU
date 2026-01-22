import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./parcial') }
] as Routes;