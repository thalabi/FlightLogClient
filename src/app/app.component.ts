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
    buildTimestamp: string;
    title = 'app';

    constructor (
        private versionService: AppInfoService
    ) {}

    ngOnInit() {
        this.clientBuildTimestamp = environment.buildTimestamp;
        this.versionService.getBuildTimestamp().subscribe({
            next: data => {
                this.buildTimestamp = data;
                console.log('this.buildTimestamp: ', this.buildTimestamp);
            }
        });
    }
}
