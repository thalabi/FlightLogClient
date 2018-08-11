import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    getServerBuildTimestamp(): Observable<string> {
        return this.http.get(this.serviceUrl + '/appInfoController/getBuildTimestamp', {responseType: "text"});
    }
}
