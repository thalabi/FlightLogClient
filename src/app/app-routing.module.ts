import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { MakeModelCrudComponent } from './make-model-crud/make-model-crud.component';
import { PilotCrudComponent } from './pilot-crud/pilot-crud.component';
import { RegistrationCrudComponent } from './registration-crud/registration-crud.component';
import { TestArraySortComponent } from './test-array-sort/test-array-sort.component';

const routes: Routes = [
    { path: '', redirectTo: '/flightLogTable', pathMatch: 'full' },
    { path: 'flightLogTable', component: FlightLogTableComponent },
    { path: 'makeModelCrud', component: MakeModelCrudComponent },
    { path: 'registrationCrud', component: RegistrationCrudComponent },
    { path: 'pilotCrud', component: PilotCrudComponent },
    { path: 'testArraySort', component: TestArraySortComponent },
    ];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
