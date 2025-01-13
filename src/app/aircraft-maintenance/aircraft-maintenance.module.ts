import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { PickListModule } from 'primeng/picklist';
import { FieldsetModule } from 'primeng/fieldset';

import { FormsModule } from '@angular/forms';
import { AircraftComponentService } from './service/aircraft-component.service';
import { AircraftHistoryPrintComponentComponent } from './aircraft-history-print-component/aircraft-history-print-component.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ButtonModule, CalendarModule, MessageModule, MessagesModule, TabViewModule, PickListModule, FieldsetModule,
    ],
    providers: [
        AircraftComponentService
    ],
    declarations: [AircraftHistoryPrintComponentComponent,],
})
export class AircraftMaintenanceModule { }
