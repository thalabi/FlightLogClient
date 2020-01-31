import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AircraftComponentComponent } from './aircraft-component/aircraft-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule, MultiSelectModule, DialogModule, MessageModule, TooltipModule, DropdownModule, CalendarModule, InputSwitchModule, AutoCompleteModule, TabViewModule, PickListModule, FieldsetModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AircraftComponentService } from './service/aircraft-component.service';
import { AircraftHistoryPrintComponentComponent } from './aircraft-history-print-component/aircraft-history-print-component.component';
import { ValidatorModule } from '../validator/validator.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule, TableModule, ButtonModule, MultiSelectModule, DialogModule, CalendarModule, AutoCompleteModule, DialogModule, TooltipModule, InputSwitchModule, MessageModule, TabViewModule, PickListModule, FieldsetModule,
        ValidatorModule
    ],
    providers: [
        AircraftComponentService
    ],
    declarations: [AircraftComponentComponent, AircraftHistoryPrintComponentComponent, ],
})
export class AircraftMaintenanceModule { }
