import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { FlightLogServiceService } from './flight-log-service.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    FlightLogTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [FlightLogServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
