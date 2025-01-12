import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';

@Component({
    standalone: true,
    selector: 'app-backend-stacktrace-display',
    imports: [BrowserModule, ButtonModule, OverlayPanelModule],
    templateUrl: './backend-stacktrace-display.component.html',
    styleUrls: ['./backend-stacktrace-display.component.css']
})
export class BackendStacktraceDisplayComponent implements OnInit {

    stackTrace?: string

    constructor(private sessionService: SessionService) { }

    ngOnInit() {
        this.sessionService.backendExceptionstackTrace$.subscribe({
            next: backendExceptionstack => {
                this.stackTrace = backendExceptionstack
            }
        })
    }

    clearStackTrace() {
        this.sessionService.clearBackendStackTrace()
    }
}
