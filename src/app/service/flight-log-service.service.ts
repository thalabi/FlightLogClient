import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FlightLog } from '../domain/flight-log';


import { FlightLogResponse } from '../response/flight-log-response';
import { Airport } from '../domain/airport';
import { AirportResponse } from '../response/airport-response';
import { StringUtils } from '../string-utils';
import { FlightLogMonthlyTotalVResponse } from '../response/flight-log-monthly-total-v-response';
import { FlightLogYearlyTotalVResponse } from '../response/flight-log-yearly-total-v-response';
import { FlightLogLastXDaysTotalVResponse } from '../response/flight-log-last-x-days-total-v-response';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericEntityService } from './generic-entity.service';
import { FlightLogPending } from '../domain/FlightLogPending';
import { FlightLogPendingAddRequest } from '../request/flight-log-pending-add-request';

@Injectable()
export class FlightLogServiceService {
    readonly SORT_COLUMN: string = 'flightDate';
    readonly serviceUrl: string;

    //PAGE_SIZE: number = 10;
    //URL: string = 'http://localhost:8080/flightLogs/?sort=' + this.SORT_COLUMN + '&size=' + this.PAGE_SIZE;

    constructor(
        private httpClient: HttpClient
    ) {
        this.serviceUrl = environment.beRestServiceUrl;

    }

    getTableMetaDataAlps(tableName: string): Observable<any> {
        const entityNameResource = GenericEntityService.toPlural(GenericEntityService.toCamelCase(tableName))
        return this.httpClient.get(this.serviceUrl + '/protected/data-rest/profile/' + entityNameResource)
    }

    addFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        let url: string = this.serviceUrl + '/protected/data-rest/flightLogs';
        console.log('flightLog: ', flightLog);
        // flightLog.created = new Date();
        // flightLog.modified = new Date();
        // console.log('flightLog: ', flightLog);
        return this.httpClient.post<FlightLog>(url, flightLog).pipe(
            map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return throwError(() => { });;
            }));
    }

    updateFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        console.log('flightLog: ', flightLog);
        // flightLog.modified = new Date();
        // console.log('flightLog: ', flightLog);

        //let url: string = flightLog._links.flightLog.href;
        let url: string = this.serviceUrl + '/protected/data-rest/flightLogs/' + flightLog.id;
        console.log('url: ', url);
        return this.httpClient.patch<FlightLog>(url, flightLog).pipe(
            map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return throwError(() => { });;
            }));
    }

    deleteFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        let url: string = this.serviceUrl + '/protected/data-rest/flightLogs/' + flightLog.id;
        console.log('url: ', url);
        return this.httpClient.delete<void>(url).pipe(
            map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return throwError(() => { });
            }));
    }

    deleteFlightLogPending(flightLogPending: FlightLogPending): Observable<HttpResponse<any>> {
        let url: string = flightLogPending._links.self.href.toString();
        console.log('url: ', url);
        return this.httpClient.delete<HttpResponse<any>>(url);
    }

    addFlightLogPending(flightLogPendingAddRequest: FlightLogPendingAddRequest): Observable<HttpResponse<any>> {
        return this.httpClient.post<HttpResponse<any>>(`${this.serviceUrl}/protected/flightLogPendingController/addFlightLogPending`, flightLogPendingAddRequest);
    }

    // addFlightLogPending(flightLogPendingAddRequest: FlightLogPendingAddRequest): Observable<> {
    //     let url: string = flightLogPendingAddRequest._links.self.href.toString();
    //     console.log('url: ', url);
    //     return this.httpClient.delete<void>(url).pipe(
    //         map((response: any) => {
    //             let flightLogPendingResponse = response;
    //             console.log('flightLogPendingResponse', flightLogPendingResponse);
    //             return flightLogPendingResponse;
    //         }),
    //         catchError((httpErrorResponse: HttpErrorResponse) => {
    //             FlightLogServiceService.handleError(httpErrorResponse);
    //             return throwError(() => { });
    //         }));
    // }

    getAirportByIdentifierOrName(identifier: string, name: string): Observable<Array<Airport>> {
        let url: string = this.serviceUrl + '/protected/data-rest/airports/search/findByIdentifierContainingIgnoreCaseOrNameContainingIgnoreCase?identifier=' + identifier + '&name=' + name;
        return this.httpClient.get<AirportResponse>(url).pipe(
            map((response: any) => {
                let airportResponse = response;
                //console.log('makeModelArray', makeModelArray);
                return airportResponse._embedded.airports;
            }));
        //.catch(this.handleError);
    }

    getFlightLogMonthlyTotalV(): Observable<FlightLogMonthlyTotalVResponse> {
        let url: string = this.serviceUrl + '/protected/data-rest/flightLogMonthlyTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.httpClient.get<FlightLogMonthlyTotalVResponse>(url);
    }
    getFlightLogYearlyTotalV(): Observable<FlightLogYearlyTotalVResponse> {
        let url: string = this.serviceUrl + '/protected/data-rest/flightLogYearlyTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.httpClient.get<FlightLogYearlyTotalVResponse>(url);
    }
    getFlightLogLastXDaysTotalV(): Observable<FlightLogLastXDaysTotalVResponse> {
        let url: string = this.serviceUrl + '/protected/data-rest/flightLogLastXDaysTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.httpClient.get<FlightLogLastXDaysTotalVResponse>(url);
    }


    getRecordCount(tableName: string): Observable<any> {
        return this.httpClient.get(`${this.serviceUrl}/protected/genericEntityController/countAll?tableName=${tableName}`);
    }

    // private getHttpOptions() {
    //     console.log('this.sessionDataService.user.token', this.sessionDataService.user?.token);
    //     return {
    //         headers: new HttpHeaders({
    //             'Authorization': 'Bearer ' + this.sessionDataService.user?.token,
    //             'Content-Type': 'application/json'
    //         })
    //     }
    // };

    // TODO needs rewrite
    public static handleError(httpErrorResponse: HttpErrorResponse) {
        console.error('An error occurred. See blow info.');
        console.error('httpErrorResponse', httpErrorResponse);
        console.error('httpErrorResponse.error', httpErrorResponse.error);
        console.error('httpErrorResponse.headers', httpErrorResponse.headers);
        console.error('httpErrorResponse.message', httpErrorResponse.message);
        console.error('httpErrorResponse.name', httpErrorResponse.name);
        console.error('httpErrorResponse.ok', httpErrorResponse.ok);
        console.error('httpErrorResponse.status', httpErrorResponse.status);
        console.error('httpErrorResponse.statusText', httpErrorResponse.statusText);
        console.error('httpErrorResponse.type', httpErrorResponse.type);
        console.error('httpErrorResponse.url', httpErrorResponse.url);
    }
}
