import { Component, OnInit } from '@angular/core';
import { VersionService } from './service/version.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    clientBuildTimestamp: string;
    version: string;
    title = 'app';

    constructor (
        private versionService: VersionService
    ) {}

    ngOnInit() {
        this.clientBuildTimestamp = environment.buildTimestamp;
        this.versionService.getVersion().subscribe({
            next: data => {
                this.version = data;
                console.log('this.version: ', this.version);
            }
        });
    }
}
