import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FlightLog } from '../domain/flight-log';


import { FlightLogResponse } from '../response/flight-log-response';
import { ISingleColumnEntityResponse } from '../response/i-single-column-entity-response';
import { Airport } from '../domain/airport';
import { AirportResponse } from '../response/airport-response';
import { PilotResponse } from '../response/pilot-response';
import { Pilot } from '../domain/pilot';
import { ISingleColumnEntity } from '../domain/i-single-column-entity';
import { StringUtils } from '../string-utils';
import { FlightLogMonthlyTotalVResponse } from '../response/flight-log-monthly-total-v-response';
import { FlightLogYearlyTotalVResponse } from '../response/flight-log-yearly-total-v-response';
import { FlightLogLastXDaysTotalVResponse } from '../response/flight-log-last-x-days-total-v-response';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class FlightLogServiceService {
    readonly SORT_COLUMN: string = 'flightDate';
    readonly serviceUrl: string;

    //PAGE_SIZE: number = 10;
    //URL: string = 'http://localhost:8080/flightLogs/?sort=' + this.SORT_COLUMN + '&size=' + this.PAGE_SIZE;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
        
    }

    getAll(url?: string): Observable<FlightLogResponse> {
        if (! url) {
            url = this.serviceUrl + '/flightLogs/?size=9999&sort=flightDate';
        }
        return this.http.get<FlightLogResponse>(url);
            // .map((response: any) => {
            //     return response._embedded.flightLogs;
            // })
            ;
            //.catch(this.handleError);
    }

    getFlightLogCount(): Observable<any> {
        let url: string = this.serviceUrl + '/flightLogController/count';
        return this.http.get<FlightLogResponse>(url);
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
        return this.http.get<FlightLogResponse>(url).pipe(
            map((response: any) => {
                let flightLogResponse: FlightLogResponse = response;
                let flightLogArray = flightLogResponse.page.totalElements ? flightLogResponse._embedded.flightLogs : [];
                // Revive dates to their proper format
                for (let flightLog of flightLogArray) {
                    console.log('flightLog.flightDate', flightLog.flightDate);
                    console.log('new Date(flightLog.flightDate)', new Date(flightLog.flightDate));
                    flightLog.flightDate = new Date(flightLog.flightDate+' 00:00:00');
                    //flightLog.flightDate = new Date(flightLog.flightDate);
                    flightLog.created = new Date(flightLog.created);
                }
                return flightLogResponse;
            }))
            ;
            //.catch(this.handleError);
    }

    addFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        let url: string = this.serviceUrl + '/flightLogs';
        console.log('flightLog: ', flightLog);
        flightLog.created = new Date();
        flightLog.modified = new Date();
        console.log('flightLog: ', flightLog);
        return this.http.post<FlightLog>(url, flightLog).pipe(
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
        return this.http.put<FlightLog>(url, flightLog).pipe(
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
        return this.http.delete<void>(url).pipe(
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
        return this.http.get<AirportResponse>(url).pipe(
            map((response: any) => {
                let airportResponse = response;
                //console.log('makeModelArray', makeModelArray);
                return airportResponse._embedded.airports;
            }));
            //.catch(this.handleError);
    }

    //
    // single entity end points, begin
    //
    getAllSingleColumnEntity(tableName: string): Observable<ISingleColumnEntityResponse> {
        // TODO use the capitalize method in single-column-crud and make it a global method
        let url: string = this.serviceUrl + '/' + tableName + 's/search/findAllByOrderBy' + StringUtils.capitalize(tableName);
        console.log(url);
        return this.http.get<ISingleColumnEntityResponse>(url);
    }

    addSingleColumnEntity(tableName: string, row: ISingleColumnEntity): Observable<ISingleColumnEntityResponse> {
        let url: string = this.serviceUrl + '/' + tableName + 's';
        console.log('row: ', row);
        row.created = new Date();
        row.modified = new Date();
        console.log('row: ', row);
        return this.http.post<ISingleColumnEntity>(url, row).pipe(
            map((singleColumnEntityResponse: any) => {
                console.log('singleColumnEntityResponse', singleColumnEntityResponse);
                return singleColumnEntityResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
              }));
    }

    updateSingleColumnEntity(row: ISingleColumnEntity): Observable<ISingleColumnEntityResponse> {
        console.log('row: ', row);
        row.modified = new Date();
        console.log('row: ', row);
        
        let url: string = row._links.self.href;
        console.log('url: ', url);
        return this.http.put<ISingleColumnEntity>(url, row).pipe(
            map((response: any) => {
                let singleColumnEntityResponse = response;
                console.log('singleColumnEntityResponse', singleColumnEntityResponse);
                return singleColumnEntityResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
              }));
    }

    deleteSingleColumnEntity(row: ISingleColumnEntity): Observable<ISingleColumnEntityResponse> {
        let url: string = row._links.self.href;
        console.log('url: ', url);
        return this.http.delete<void>(url).pipe(
            map((response: any) => {
                let singleColumnEntityResponse = response;
                console.log('singleColumnEntityResponse', singleColumnEntityResponse);
                return singleColumnEntityResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
              }));
    }
    //
    // single entity end points, end
    //

    //
    // two column entity end points, begin
    //
    /*
    * first: first row, zero based
    * size: page size
    * search:
    */

    //
    // two column entity end points, end
    //
    
    getFlightLogMonthlyTotalV(): Observable<FlightLogMonthlyTotalVResponse>  {
        let url: string = this.serviceUrl + '/flightLogMonthlyTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.http.get<FlightLogMonthlyTotalVResponse>(url);
    }
    getFlightLogYearlyTotalV(): Observable<FlightLogYearlyTotalVResponse>  {
        let url: string = this.serviceUrl + '/flightLogYearlyTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.http.get<FlightLogYearlyTotalVResponse>(url);
    }
    getFlightLogLastXDaysTotalV(): Observable<FlightLogLastXDaysTotalVResponse>  {
        let url: string = this.serviceUrl + '/flightLogLastXDaysTotalVs/search/findAllByOrderById';
        console.log(url);
        return this.http.get<FlightLogLastXDaysTotalVResponse>(url);
    }

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
