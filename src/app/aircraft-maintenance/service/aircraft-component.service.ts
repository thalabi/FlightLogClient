import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../config/config.service';
import { ApplicationProperties } from '../../config/application.properties';
import { IGenericEntity } from '../../domain/i-gerneric-entity';
import { FlightLogServiceService } from '../../service/flight-log-service.service';
import { Observable } from 'rxjs';
import { SessionDataService } from '../../service/session-data.service';
import { AircraftComponentListResponse } from '../../response/aircraft-component-list-response';
import { AircraftComponentRequest } from '../../domain/aircraft-component-request';

@Injectable()
export class AircraftComponentService {
    readonly serviceUrl: string;

    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService,
        private sessionDataService: SessionDataService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    findAll(tableName: string, first: number, size: number, search: string, queryOrderByColumns: string[]): Observable<AircraftComponentListResponse> {
        console.log('first, size, search', first, size, search)
        let url: string = this.serviceUrl + '/' + tableName + 'Controller/findAll/?page=' + first / size + '&size=' + size + '&search=' + search + '&sort=' + queryOrderByColumns;
        console.log('url', url);
        return this.httpClient.get<AircraftComponentListResponse>(url, this.getHttpOptions());
    }


    addComponent(row: AircraftComponentRequest.Component): Observable<void> {
        let url: string = this.serviceUrl + '/componentController/add';
        console.log('row: ', row);
        return this.httpClient.post<IGenericEntity>(url, row, this.getHttpOptions()).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
            }));
    }

    modifyComponentAndHistory(row: AircraftComponentRequest.Component): Observable<void> {
        // console.log('modifyComponentAndHistory');
        // // return null just to make it compile
        // return new Observable();
        let url: string = this.serviceUrl + '/componentController/modifyComponentAndHistory';
        console.log('row: ', row);
        return this.httpClient.put<IGenericEntity>(url, row, this.getHttpOptions()).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
            }));
    }

    deleteComponent(componentUri: string, deleteHistoryRecords: boolean): Observable<void> {
        let url: string = this.serviceUrl + '/componentController/delete?componentUri='+componentUri+'&deleteHistoryRecords='+deleteHistoryRecords;
        console.log('componentUri: ', componentUri);
        return this.httpClient.delete<IGenericEntity>(url, this.getHttpOptions()).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
            }));
    }

    private getHttpOptions() {
        console.log('this.sessionDataService.user.token', this.sessionDataService.user.token);
        return {headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.sessionDataService.user.token
            })
        }
    };
}