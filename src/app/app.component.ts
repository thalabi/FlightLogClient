import { Component, OnInit } from '@angular/core';
import { AppInfoService } from './service/appInfo.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    clientBuildTimestamp: string;
    serverBuildTimestamp: string;
    title = 'app';

    constructor (
        private versionService: AppInfoService
    ) {}

    ngOnInit() {
        this.clientBuildTimestamp = environment.buildTimestamp;
        this.versionService.getServerBuildTimestamp().subscribe({
            next: data => {
                this.serverBuildTimestamp = data;
                console.log('this.serverBuildTimestamp: ', this.serverBuildTimestamp);
            }
        });
    }
}
