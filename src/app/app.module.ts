import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { MakeModelCrudComponent } from './make-model-crud/make-model-crud.component';
import { AbbreviateComponent } from './abbreviate/abbreviate.component';

@NgModule({
  declarations: [
    AppComponent,
    FlightLogTableComponent,
    RegexValidatorDirective,
    MenuComponent,
    MakeModelCrudComponent,
    AbbreviateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    BrowserAnimationsModule, TableModule, ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule,
    
    AppRoutingModule
  ],
  providers: [FlightLogServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
