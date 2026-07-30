import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { FlightLogMonthlyTotalVTableComponent } from './flight-log-monthly-total-v-table/flight-log-monthly-total-v-table.component';
import { FlightLogYearlyTotalVTableComponent } from './flight-log-yearly-total-v-table/flight-log-yearly-total-v-table.component';
import { FlightLogLastXDaysTotalVTableComponent } from './flight-log-last-x-days-total-v-table/flight-log-last-x-days-total-v-table.component';
import { JobLauncherComponent } from './job-launcher/job-launcher.component';
import { GenericCrudComponent } from './generic-crud/generic-crud.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AircraftHistoryPrintComponentComponent } from './aircraft-maintenance/aircraft-history-print-component/aircraft-history-print-component.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { Httpstatus404Component } from './httpstatus404/httpstatus404.component';

const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    //    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'flightLogTable', component: FlightLogTableComponent, canActivate: [AuthGuard] },
    { path: 'flightLogMonthlyTotalVTable', loadComponent: () => import('./flight-log-monthly-total-v-table/flight-log-monthly-total-v-table.component').then(m => m.FlightLogMonthlyTotalVTableComponent), canActivate: [AuthGuard] },
    { path: 'flightLogYearlyTotalVTable', loadComponent: () => import('./flight-log-yearly-total-v-table/flight-log-yearly-total-v-table.component').then(m => m.FlightLogYearlyTotalVTableComponent), canActivate: [AuthGuard] },
    { path: 'flightLogLastXDaysTotalVTableComponent', loadComponent: () => import('./flight-log-last-x-days-total-v-table/flight-log-last-x-days-total-v-table.component').then(m => m.FlightLogLastXDaysTotalVTableComponent), canActivate: [AuthGuard] },
    { path: 'jobLauncher', component: JobLauncherComponent, canActivate: [AuthGuard] },
    { path: 'genericCrud/:entityName', loadComponent: () => import('./generic-crud/generic-crud.component').then(m => m.GenericCrudComponent), canActivate: [AuthGuard] },
    { path: 'aircraftComponent', loadComponent: () => import('./aircraft-maintenance/aircraft-component/aircraft-component.component').then(m => m.AircraftComponentComponent), canActivate: [AuthGuard] },
    { path: 'aircraftHistoryPrintComponentComponent', loadComponent: () => import('./aircraft-maintenance/aircraft-history-print-component/aircraft-history-print-component.component').then(m => m.AircraftHistoryPrintComponentComponent), canActivate: [AuthGuard] },

    { path: 'emailUpcomingDueComponentsComponent', loadComponent: () => import('./aircraft-maintenance/email-upcoming-due-components/email-upcoming-due-components.component').then(m => m.EmailUpcomingDueComponentsComponent), canActivate: [AuthGuard] },

    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    //{ path: 'login', component: LoginComponent },
    { path: '**', component: Httpstatus404Component },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
