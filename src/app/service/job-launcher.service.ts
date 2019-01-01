import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { catchError, map } from 'rxjs/operators';
import { FlightLogServiceService } from './flight-log-service.service';
import { Observable } from 'rxjs';
import { SessionDataService } from './session-data.service';

@Injectable()
export class JobLauncherService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private sessionDataService: SessionDataService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    startJob(jobName: string): Observable<any> {
        let url: string = this.serviceUrl + '/jobLauncherController/' + jobName;
        return this.http.get<any>(url, this.getHttpOptions()).pipe(
            map((response: any) => {
                let jobLauncherResponse = response;
                console.log('jobLauncherResponse', jobLauncherResponse);
                return jobLauncherResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
              }));
    }

    private getHttpOptions() {
        console.log('this.sessionDataService.user.token', this.sessionDataService.user.token);
        return {headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.sessionDataService.user.token,
            'Content-Type': 'application/json'
            })
        }
    };

}
