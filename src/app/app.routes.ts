import { Routes } from '@angular/router';
import { RegistrarEntradasComponent } from './componentes/registrar-entradas/registrar-entradas.component';
import { RegistrarSalidasComponent } from './componentes/registrar-salidas/registrar-salidas.component';
import { ConsultarExistenciasComponent } from './componentes/consultar-existencias/consultar-existencias.component';
import { ModuloVentasComponent } from './componentes/modulo-ventas/modulo-ventas.component';
import { ModuloReportesComponent } from './componentes/modulo-reportes/modulo-reportes.component';
import { EliminarEditarComponent } from './componentes/eliminar-editar/eliminar-editar.component';
import { LoginComponent } from './componentes/login/login.component';
import { MainLayoutComponent } from './componentes/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './componentes/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
        { path: 'login', component: LoginComponent },
        { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
        { path: 'registrar-entradas', component: RegistrarEntradasComponent },
        { path: 'registrar-salidas', component: RegistrarSalidasComponent },
        { path: 'eliminar-editar', component: EliminarEditarComponent },
        { path: 'consultar-existencias', component: ConsultarExistenciasComponent },
        { path: 'modulo-ventas', component: ModuloVentasComponent },
        { path: 'modulo-reportes', component: ModuloReportesComponent },
        ]
    },
    { path: '**', redirectTo: 'login' }
];
