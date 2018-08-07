import { Component, OnInit } from '@angular/core';
import { VersionService } from './service/version.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    version: string;
    title = 'app';

    constructor (
        private versionService: VersionService
    ) {}

    ngOnInit() {
        this.versionService.getVersion().subscribe({
            next: data => {
                this.version = data;
                console.log('this.version: ', this.version);
            }
        });
    }
}
