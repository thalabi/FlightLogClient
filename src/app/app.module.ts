import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule } from 'primeng/primeng';
import {TableModule} from 'primeng/table';

import { AppComponent } from './app.component';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { FlightLogServiceService } from './flight-log-service.service';
import { HttpClientModule } from '@angular/common/http';
import { RegexValidatorDirective } from './regex-validator.directive';
import { MenuComponent } from './menu/menu.component';
import { AppRoutingModule } from './/app-routing.module';
import { AbbreviateComponent } from './abbreviate/abbreviate.component';
import { SingleColumnEntityCrudComponent } from './single-column-entity-crud/single-column-entity-crud.component';
import { FlightLogMonthlyTotalVTableComponent } from './flight-log-monthly-total-v-table/flight-log-monthly-total-v-table.component';
import { FlightLogYearlyTotalVTableComponent } from './flight-log-yearly-total-v-table/flight-log-yearly-total-v-table.component';
import { FlightLogLastXDaysTotalVTableComponent } from './flight-log-last-x-days-total-v-table/flight-log-last-x-days-total-v-table.component';
import { ConfigService, configServiceLoadConfig } from './config/config.service';

@NgModule({
  declarations: [
    AppComponent,
    FlightLogTableComponent,
    RegexValidatorDirective,
    MenuComponent,
    AbbreviateComponent,
    SingleColumnEntityCrudComponent,
    FlightLogMonthlyTotalVTableComponent,
    FlightLogYearlyTotalVTableComponent,
    FlightLogLastXDaysTotalVTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    BrowserAnimationsModule, TableModule, ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule,
    
    AppRoutingModule
  ],
  providers: [
      FlightLogServiceService,
      ConfigService,
      { provide: APP_INITIALIZER, useFactory: configServiceLoadConfig, deps: [ConfigService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
