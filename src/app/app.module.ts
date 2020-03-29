import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule, ProgressSpinnerModule, ToggleButtonModule, MessagesModule, MessageModule, OverlayPanelModule, CheckboxModule, PickListModule, ProgressBarModule, InputSwitchModule, RadioButtonModule } from 'primeng/primeng';
import {TableModule} from 'primeng/table';

import { AppComponent } from './app.component';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { FlightLogServiceService } from './service/flight-log-service.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { MenuComponent } from './menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { AbbreviateComponent } from './abbreviate/abbreviate.component';
import { FlightLogMonthlyTotalVTableComponent } from './flight-log-monthly-total-v-table/flight-log-monthly-total-v-table.component';
import { FlightLogYearlyTotalVTableComponent } from './flight-log-yearly-total-v-table/flight-log-yearly-total-v-table.component';
import { FlightLogLastXDaysTotalVTableComponent } from './flight-log-last-x-days-total-v-table/flight-log-last-x-days-total-v-table.component';
import { ConfigService, configServiceLoadConfig } from './config/config.service';
import { JobLauncherComponent } from './job-launcher/job-launcher.component';
import { JobLauncherService } from './service/job-launcher.service';
import { GenericCrudComponent } from './generic-crud/generic-crud.component';
import { GenericEntityService } from './service/generic-entity.service';
import { CustomRouteReuseStrategy } from './util/CustomRouteReuseStrategy';
import { RouteReuseStrategy } from '@angular/router';
import { AppInfoService } from './service/appInfo.service';
import { ReplicationService } from './service/replication.service';
//import { CustomErrorHandler } from './custom-error-handler';
import { MyMessageService } from './message/mymessage.service';
import { MessageComponent } from './message/message.component';
import { SyncButtonComponent } from './sync-button/sync-button.component';
import { LoginComponent } from './security/login/login.component';
import { AuthGuard } from './security/auth.guard';
import { PasswordMaskPipe } from './util/password-mask-pipe';
import { CopyUserComponent } from './security/copy-user/copy-user.component';
import { _404Component } from './404.component';
import { HttpErrorInterceptor } from './http-error-interceptor';
import { AircraftMaintenanceModule } from './aircraft-maintenance/aircraft-maintenance.module';
import { SecurityModule } from './security/security.module';
import { HomeComponent } from './home/home.component';
import { ValidatorModule } from './validator/validator.module';

@NgModule({
  declarations: [
    AppComponent,
    _404Component,
    FlightLogTableComponent,
    MenuComponent,
    AbbreviateComponent,
    FlightLogMonthlyTotalVTableComponent,
    FlightLogYearlyTotalVTableComponent,
    FlightLogLastXDaysTotalVTableComponent,
    JobLauncherComponent,
    GenericCrudComponent,
    MessageComponent,
    SyncButtonComponent,
    PasswordMaskPipe,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,

    BrowserAnimationsModule, TableModule, ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule, ProgressSpinnerModule, ToggleButtonModule, MessageModule, OverlayPanelModule, CheckboxModule, PickListModule, ProgressBarModule, InputSwitchModule, RadioButtonModule,

    DeviceDetectorModule.forRoot(),

    AppRoutingModule,

    ValidatorModule,
    AircraftMaintenanceModule,

    SecurityModule
  ],
  providers: [
        AppInfoService,
        FlightLogServiceService,
        GenericEntityService,
        JobLauncherService,
        ReplicationService,
        ConfigService,
        MyMessageService,
        { provide: APP_INITIALIZER, useFactory: configServiceLoadConfig, deps: [ConfigService], multi: true },
        { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
        //{ provide: ErrorHandler, useClass: CustomErrorHandler }, // overrride default error handler
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
      ],
  bootstrap: [AppComponent]
})
export class AppModule { }
