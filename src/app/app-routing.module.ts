import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { FlightLogMonthlyTotalVTableComponent } from './flight-log-monthly-total-v-table/flight-log-monthly-total-v-table.component';
import { FlightLogYearlyTotalVTableComponent } from './flight-log-yearly-total-v-table/flight-log-yearly-total-v-table.component';
import { FlightLogLastXDaysTotalVTableComponent } from './flight-log-last-x-days-total-v-table/flight-log-last-x-days-total-v-table.component';
import { JobLauncherComponent } from './job-launcher/job-launcher.component';
import { GenericCrudComponent } from './generic-crud/generic-crud.component';
import { LoginComponent } from './security/login/login.component';
import { AuthGuard } from './security/auth.guard';
import { ChangePasswordComponent } from './security/change-password/change-password.component';
import { CopyUserComponent } from './security/copy-user/copy-user.component';
import { _404Component } from './404.component';

const routes: Routes = [
    { path: '', redirectTo: '/flightLogTable', pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'flightLogTable', component: FlightLogTableComponent, canActivate: [AuthGuard] },
    { path: 'flightLogMonthlyTotalVTable', component: FlightLogMonthlyTotalVTableComponent, canActivate: [AuthGuard] },
    { path: 'flightLogYearlyTotalVTable', component: FlightLogYearlyTotalVTableComponent, canActivate: [AuthGuard] },
    { path: 'flightLogLastXDaysTotalVTableComponent', component: FlightLogLastXDaysTotalVTableComponent, canActivate: [AuthGuard] },
    { path: 'jobLauncher', component: JobLauncherComponent, canActivate: [AuthGuard] },
    { path: 'genericCrud/:tableName', component: GenericCrudComponent, canActivate: [AuthGuard] },
    { path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: 'copyUser', component: CopyUserComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', component: _404Component },
    ];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
