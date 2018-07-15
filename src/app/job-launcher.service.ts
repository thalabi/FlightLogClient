import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from './config/config.service';
import { ApplicationProperties } from './config/application.properties';
import { Observable } from 'rxjs/Observable';
import { FlightLogServiceService } from './service/flight-log-service.service';

@Injectable()
export class JobLauncherService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    startJob(jobName: string): Observable<any> {
        let url: string = this.serviceUrl + '/jobLauncherController/' + jobName;
        return this.http.get<any>(url)
            .map((response: any) => {
                let jobLauncherResponse = response;
                console.log('jobLauncherResponse', jobLauncherResponse);
                return jobLauncherResponse;
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
              });;
    }
}
