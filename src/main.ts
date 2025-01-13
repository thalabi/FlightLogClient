import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { TabViewModule } from 'primeng/tabview';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { PickListModule } from 'primeng/picklist';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgIdleModule } from '@ng-idle/core';
import { AuthModule } from './app/auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { MenuItems } from './app/menu/menu-items';
import { HttpErrorInterceptor } from './app/http-error-interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { CustomRouteReuseStrategy } from './app/util/CustomRouteReuseStrategy';
import { RouteReuseStrategy } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ReplicationService } from './app/service/replication.service';
import { JobLauncherService } from './app/service/job-launcher.service';
import { GenericEntityService } from './app/service/generic-entity.service';
import { FlightLogServiceService } from './app/service/flight-log-service.service';
import { AppInfoService } from './app/service/appInfo.service';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, AuthModule.forRoot(), NgIdleModule.forRoot(), TableModule, ButtonModule, MultiSelectModule, DialogModule, CalendarModule, DropdownModule, AutoCompleteModule, MenubarModule, TooltipModule, ProgressSpinnerModule, ToggleButtonModule, MessageModule, MessagesModule, OverlayPanelModule, CheckboxModule, PickListModule, ProgressBarModule, InputSwitchModule, RadioButtonModule, OverlayPanelModule, TabViewModule, 
        //DeviceDetectorModule.forRoot(),
        AppRoutingModule),
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
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
