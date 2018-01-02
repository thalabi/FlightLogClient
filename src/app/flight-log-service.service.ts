import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FlightLog } from './flight-log';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { FlightLogResponse } from './flight-log-response';

@Injectable()
export class FlightLogServiceService {
    SORT_COLUMN: string = 'flightDate';
    PAGE_SIZE: number = 10;
    URL: string = 'http://localhost:8080/flightLogs/?sort=' + this.SORT_COLUMN + '&size=' + this.PAGE_SIZE;

    constructor(private http: HttpClient) { }

    getAll(url?: string): Observable<FlightLogResponse> {
        if (! url) {
            url = 'http://localhost:8080/flightLogs/?sort=flightDate';
        }
        return this.http.get<FlightLogResponse>(url);
            // .map((response: any) => {
            //     return response._embedded.flightLogs;
            // })
            ;
            //.catch(this.handleError);
    }

    getPage(page: number): Observable<FlightLogResponse> {
        let url: string = this.URL + '&page=' + page;
        return this.http.get<FlightLogResponse>(url);
            // .map((response: any) => {
            //     return response._embedded.flightLogs;
            // })
            ;
            //.catch(this.handleError);
    }
}
