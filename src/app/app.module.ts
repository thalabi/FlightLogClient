import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule, ProgressSpinnerModule, ToggleButtonModule, MessagesModule, MessageModule, OverlayPanelModule, CheckboxModule } from 'primeng/primeng';
import {TableModule} from 'primeng/table';

import { AppComponent } from './app.component';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { FlightLogServiceService } from './service/flight-log-service.service';
import { HttpClientModule } from '@angular/common/http';
import { RegexValidatorDirective } from './regex-validator.directive';
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
import { CustomErrorHandler } from './custom-error-handler';
import { MyMessageService } from './message/mymessage.service';
import { MessageComponent } from './message/message.component';
import { SyncButtonComponent } from './sync-button/sync-button.component';
import { LoginComponent } from './security/login/login.component';
import { AuthGuard } from './security/auth.guard';
import { ChangePasswordComponent } from './security/change-password/change-password.component';
import { PasswordMaskPipe } from './util/password-mask-pipe';

@NgModule({
  declarations: [
    AppComponent,
    FlightLogTableComponent,
    RegexValidatorDirective,
    MenuComponent,
    AbbreviateComponent,
    FlightLogMonthlyTotalVTableComponent,
    FlightLogYearlyTotalVTableComponent,
    FlightLogLastXDaysTotalVTableComponent,
    JobLauncherComponent,
    GenericCrudComponent,
    MessageComponent,
    SyncButtonComponent,
    LoginComponent,
    ChangePasswordComponent,
    PasswordMaskPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    BrowserAnimationsModule, TableModule, ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule, ProgressSpinnerModule, ToggleButtonModule, MessageModule, MessagesModule, OverlayPanelModule, CheckboxModule,

    AppRoutingModule
  ],
  providers: [
        AppInfoService,
        FlightLogServiceService,
        GenericEntityService,
        JobLauncherService,
        ReplicationService,
        ConfigService,
        MyMessageService,
        AuthGuard,
        { provide: APP_INITIALIZER, useFactory: configServiceLoadConfig, deps: [ConfigService], multi: true },
        { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
        { provide: ErrorHandler, useClass: CustomErrorHandler }, // overrride default error handler
      ],
  bootstrap: [AppComponent]
})
export class AppModule { }
