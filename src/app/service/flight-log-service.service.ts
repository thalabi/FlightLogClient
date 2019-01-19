import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FlightLog } from '../domain/flight-log';


import { FlightLogResponse } from '../response/flight-log-response';
import { Airport } from '../domain/airport';
import { AirportResponse } from '../response/airport-response';
import { StringUtils } from '../string-utils';
import { FlightLogMonthlyTotalVResponse } from '../response/flight-log-monthly-total-v-response';
import { FlightLogYearlyTotalVResponse } from '../response/flight-log-yearly-total-v-response';
import { FlightLogLastXDaysTotalVResponse } from '../response/flight-log-last-x-days-total-v-response';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { Observable } from 'rxjs';
import { SessionDataService } from './session-data.service';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';

@Injectable()
export class FlightLogServiceService {
    readonly SORT_COLUMN: string = 'flightDate';
    readonly serviceUrl: string;

    //PAGE_SIZE: number = 10;
    //URL: string = 'http://localhost:8080/flightLogs/?sort=' + this.SORT_COLUMN + '&size=' + this.PAGE_SIZE;

    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService,
        private sessionDataService: SessionDataService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
        
    }

    // getAll(url?: string): Observable<FlightLogResponse> {
    //     if (! url) {
    //         url = this.serviceUrl + '/flightLogs/?size=9999&sort=flightDate';
    //     }
    //     return this.http.get<FlightLogResponse>(url);
    //         // .map((response: any) => {
    //         //     return response._embedded.flightLogs;
    //         // })
    //         ;
    //         //.catch(this.handleError);
    // }

    getFlightLogCount(): Observable<any> {
        let url: string = this.serviceUrl + '/flightLogController/count';
        return this.httpClient.get<FlightLogResponse>(url, this.getHttpOptions());
    }
    /*
    * first: first row, zero based
    * size: page size
    * search:
    */
    getPage(first: number, size: number, search: string): Observable<FlightLogResponse> {
        console.log('first, size, search', first, size, search)
        let url: string = this.serviceUrl + '/flightLogController/findAll/?page=' + first/size + '&size=' + size + '&search=' + search + '&sort=flightDate';
        // let url: string = 'http://localhost:8080/flightLogController/findAll/';
        // if ((first || first == 0) && size) {
        //     if (first == 999999) { // 999999 is indictaor of last page
        //         url += '?page=' + first + '&size=' + size;
        //     } else {
        //         url += '?page=' + first/size + '&size=' + size;
        //     }
        // } else {
        //     url += '?page=0&size=9999';
        // }
        // url += '&search=' + search + '&sort=flightDate';
        console.log('url', url);
        //let url: string = this.URL + '&page=' + first/size;
        // return this.http.get<FlightLogResponse>(url).pipe(
        //     map((response: any) => {
        //         let flightLogResponse: FlightLogResponse = response;
        //         let flightLogArray = flightLogResponse.page.totalElements ? flightLogResponse._embedded.flightLogs : [];
        //         // Revive dates to their proper format
        //         for (let flightLog of flightLogArray) {
        //             // console.log('flightLog.flightDate', flightLog.flightDate);
        //             // console.log('new Date(flightLog.flightDate)', new Date(flightLog.flightDate));
        //             flightLog.flightDate = new Date(flightLog.flightDate+' 00:00:00');
        //             //flightLog.flightDate = new Date(flightLog.flightDate);
        //             flightLog.created = new Date(flightLog.created);
        //         }
        //         return flightLogResponse;
        //     }))
        //     ;
        //     //.catch(this.handleError);
        return this.httpClient.get<FlightLogResponse>(url, this.getHttpOptions());
    }

    addFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        let url: string = this.serviceUrl + '/flightLogs';
        console.log('flightLog: ', flightLog);
        flightLog.created = new Date();
        flightLog.modified = new Date();
        console.log('flightLog: ', flightLog);
        return this.httpClient.post<FlightLog>(url, flightLog, this.getHttpOptions()).pipe(
            map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
              }));
    }
    
    updateFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        console.log('flightLog: ', flightLog);
        flightLog.modified = new Date();
        console.log('flightLog: ', flightLog);
        
        let url: string = flightLog._links.flightLog.href;
        console.log('url: ', url);
        return this.httpClient.put<FlightLog>(url, flightLog, this.getHttpOptions()).pipe(
            map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
              }));
    }

    deleteFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        
        let url: string = flightLog._links.flightLog.href;
        console.log('url: ', url);
        return this.httpClient.delete<void>(url, this.getHttpOptions()).pipe(
            map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
              }));
    }

    getAirportByIdentifierOrName(identifier: string, name: string): Observable<Array<Airport>> {
        let url: string = this.serviceUrl + '/airports/search/findByIdentifierContainingIgnoreCaseOrNameContainingIgnoreCase?identifier=' + identifier + '&name=' + name;
        return this.httpClient.get<AirportResponse>(url, this.getHttpOptions()).pipe(
            map((response: any) => {
                let airportResponse = response;
                //console.log('makeModelArray', makeModelArray);
                return airportResponse._embedded.airports;
            }));
            //.catch(this.handleError);
    }

    getAllGenericEntity(tableName: string): Observable<IGenericEntityResponse> {
        // TODO use the capitalize method in single-column-crud and make it a global method
        let url: string = this.serviceUrl + '/' + tableName + 's/search/findAllByOrderBy' + StringUtils.capitalize(tableName);
        console.log(url);
        return this.httpClient.get<IGenericEntityResponse>(url, this.getHttpOptions());
    }
    
    getFlightLogMonthlyTotalV(): Observable<FlightLogMonthlyTotalVResponse>  {
        let url: string = this.serviceUrl + '/flightLogMonthlyTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.httpClient.get<FlightLogMonthlyTotalVResponse>(url, this.getHttpOptions());
    }
    getFlightLogYearlyTotalV(): Observable<FlightLogYearlyTotalVResponse>  {
        let url: string = this.serviceUrl + '/flightLogYearlyTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.httpClient.get<FlightLogYearlyTotalVResponse>(url, this.getHttpOptions());
    }
    getFlightLogLastXDaysTotalV(): Observable<FlightLogLastXDaysTotalVResponse>  {
        let url: string = this.serviceUrl + '/flightLogLastXDaysTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.httpClient.get<FlightLogLastXDaysTotalVResponse>(url, this.getHttpOptions());
    }

    private getHttpOptions() {
        console.log('this.sessionDataService.user.token', this.sessionDataService.user.token);
        return {headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.sessionDataService.user.token,
            'Content-Type': 'application/json'
            })
        }
    };

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
