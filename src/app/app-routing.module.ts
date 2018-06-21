import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { SingleColumnEntityCrudComponent } from './single-column-entity-crud/single-column-entity-crud.component';
import { FlightLogMonthlyTotalVTableComponent } from './flight-log-monthly-total-v-table/flight-log-monthly-total-v-table.component';
import { FlightLogYearlyTotalVTableComponent } from './flight-log-yearly-total-v-table/flight-log-yearly-total-v-table.component';
import { FlightLogLastXDaysTotalVTableComponent } from './flight-log-last-x-days-total-v-table/flight-log-last-x-days-total-v-table.component';
import { TwoColumnEntityCrudComponent } from './two-column-entity-crud/two-column-entity-crud.component';
import { JobLauncherComponent } from './job-launcher/job-launcher.component';

const routes: Routes = [
    { path: '', redirectTo: '/flightLogTable', pathMatch: 'full' },
    { path: 'flightLogTable', component: FlightLogTableComponent },
    { path: 'testArraySort/:tableName', component: SingleColumnEntityCrudComponent },
    { path: 'twoColumnEntityCrud/:tableName', component: TwoColumnEntityCrudComponent },
    { path: 'flightLogMonthlyTotalVTable', component: FlightLogMonthlyTotalVTableComponent },
    { path: 'flightLogYearlyTotalVTable', component: FlightLogYearlyTotalVTableComponent },
    { path: 'flightLogLastXDaysTotalVTableComponent', component: FlightLogLastXDaysTotalVTableComponent },
    { path: 'jobLauncher', component: JobLauncherComponent },
    ];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
