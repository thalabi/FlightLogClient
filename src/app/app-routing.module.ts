import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { MakeModelCrudComponent } from './make-model-crud/make-model-crud.component';
import { CalTestComponent } from './cal-test/cal-test.component';

const routes: Routes = [
    { path: '', redirectTo: '/flightLogTable', pathMatch: 'full' },
    { path: 'flightLogTable', component: FlightLogTableComponent },
    { path: 'makeModelCrud', component: MakeModelCrudComponent },
    { path: 'calTest', component: CalTestComponent }
    ];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
