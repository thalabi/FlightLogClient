import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AircraftComponentComponent } from './aircraft-component/aircraft-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule, MultiSelectModule, DialogModule, MessageModule, TooltipModule, DropdownModule, CalendarModule, InputSwitchModule, AutoCompleteModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AircraftComponentService } from './service/aircraft-component.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule, TableModule, ButtonModule, MultiSelectModule, DialogModule, CalendarModule, AutoCompleteModule, DialogModule, TooltipModule, InputSwitchModule, MessageModule,
        
    ],
    providers: [
        AircraftComponentService
    ],
    declarations: [AircraftComponentComponent, ],
    exports: [
        //AircraftComponentComponent
    ]
})
export class AircraftMaintenanceModule { }
