import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FlightLogServiceService } from './flight-log-service.service';
import { Observable, throwError } from 'rxjs';
import { SessionDataService } from './session-data.service';
import { environment } from '../../environments/environment';

@Injectable()
export class JobLauncherService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private sessionDataService: SessionDataService
    ) {
        this.serviceUrl = environment.beRestServiceUrl;
    }

    startJob(jobName: string): Observable<any> {
        let url: string = this.serviceUrl + '/protected/jobLauncherController/' + jobName;
        return this.http.get<any>(url, this.getHttpOptions()).pipe(
            map((response: any) => {
                let jobLauncherResponse = response;
                console.log('jobLauncherResponse', jobLauncherResponse);
                return jobLauncherResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return throwError(() => { });
            }));
    }

    private getHttpOptions() {
        console.log('this.sessionDataService.user.token', this.sessionDataService.user?.token);
        return {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.sessionDataService.user?.token,
                'Content-Type': 'application/json'
            })
        }
    };

}
