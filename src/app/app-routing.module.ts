import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { SingleColumnEntityCrudComponent } from './single-column-entity-crud/single-column-entity-crud.component';

const routes: Routes = [
    { path: '', redirectTo: '/flightLogTable', pathMatch: 'full' },
    { path: 'flightLogTable', component: FlightLogTableComponent },
    { path: 'testArraySort/:tableName', component: SingleColumnEntityCrudComponent },
    ];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
