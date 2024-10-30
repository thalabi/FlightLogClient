import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FlightLogServiceService } from './flight-log-service.service';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class JobLauncherService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient
    ) {
        this.serviceUrl = environment.beRestServiceUrl;
    }

    startJob(jobName: string): Observable<any> {
        let url: string = this.serviceUrl + '/protected/jobLauncherController/' + jobName;
        return this.http.get<any>(url).pipe(
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
}
