import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    getVersion(): Observable<string> {
        return this.http.get(this.serviceUrl + '/versionController/getVersion', {responseType: "text"});
    }

}
