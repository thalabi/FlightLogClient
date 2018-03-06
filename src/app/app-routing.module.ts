import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { PilotCrudComponent } from './pilot-crud/pilot-crud.component';
import { TestArraySortComponent } from './single-column-entity-crud/single-column-entity-crud.component';

const routes: Routes = [
    { path: '', redirectTo: '/flightLogTable', pathMatch: 'full' },
    { path: 'flightLogTable', component: FlightLogTableComponent },
    { path: 'pilotCrud', component: PilotCrudComponent },
    { path: 'testArraySort/:tableName', component: TestArraySortComponent },
    ];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
