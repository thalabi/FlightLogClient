import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageModule } from 'primeng/message';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';

import { TableModule } from 'primeng/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlightLogTableComponent } from './flight-log-table/flight-log-table.component';
import { AbbreviateComponent } from './abbreviate/abbreviate.component';
import { FlightLogLastXDaysTotalVTableComponent } from './flight-log-last-x-days-total-v-table/flight-log-last-x-days-total-v-table.component';
import { FlightLogMonthlyTotalVTableComponent } from './flight-log-monthly-total-v-table/flight-log-monthly-total-v-table.component';
import { FlightLogYearlyTotalVTableComponent } from './flight-log-yearly-total-v-table/flight-log-yearly-total-v-table.component';
import { GenericCrudComponent } from './generic-crud/generic-crud.component';
import { JobLauncherComponent } from './job-launcher/job-launcher.component';
import { MenuComponent } from './menu/menu.component';
import { MessageComponent } from './message/message.component';
import { SyncButtonComponent } from './sync-button/sync-button.component';
import { PasswordMaskPipe } from './util/password-mask-pipe';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AircraftMaintenanceModule } from './aircraft-maintenance/aircraft-maintenance.module';
import { ValidatorModule } from './validator/validator.module';
import { RouteReuseStrategy } from '@angular/router';
import { HttpErrorInterceptor } from './http-error-interceptor';
import { MyMessageService } from './message/mymessage.service';
import { AppInfoService } from './service/appInfo.service';
import { FlightLogServiceService } from './service/flight-log-service.service';
import { GenericEntityService } from './service/generic-entity.service';
import { JobLauncherService } from './service/job-launcher.service';
import { ReplicationService } from './service/replication.service';
import { CustomRouteReuseStrategy } from './util/CustomRouteReuseStrategy';
import { AuthModule } from './auth/auth.module';
import { NgIdleModule } from '@ng-idle/core';
import { MenuItems } from './menu/menu-items';
import { MessagesModule } from 'primeng/messages';
import { WelcomeComponent } from './welcome/welcome.component';
import { Httpstatus404Component } from './httpstatus404/httpstatus404.component';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';
import { BackendStacktraceDisplayComponent } from './backend-stacktrace-display/backend-stacktrace-display.component';

@NgModule({
    declarations: [
        AppComponent,
        Httpstatus404Component,
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
        WelcomeComponent,
        BackendStacktraceDisplayComponent
    ],
    imports: [
        BrowserModule,
        FormsModule, ReactiveFormsModule,
        HttpClientModule,

        AuthModule.forRoot(),
        NgIdleModule.forRoot(),


        BrowserAnimationsModule, TableModule, ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule, ProgressSpinnerModule, ToggleButtonModule, MessageModule, OverlayPanelModule, CheckboxModule, PickListModule, ProgressBarModule, InputSwitchModule, RadioButtonModule, MessagesModule, OverlayPanelModule, TabViewModule,

        //DeviceDetectorModule.forRoot(),

        AppRoutingModule,

        ValidatorModule,
        AircraftMaintenanceModule,


    ],
    providers: [
        AppInfoService,
        FlightLogServiceService,
        GenericEntityService,
        JobLauncherService,
        ReplicationService,
        MessageService,
        //MyMessageService,
        { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
        //{ provide: ErrorHandler, useClass: CustomErrorHandler }, // overrride default error handler
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        MenuItems,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
