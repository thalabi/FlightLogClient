import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { StringUtils } from '../string-utils';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { FlightLogServiceService } from './flight-log-service.service';
import { Observable } from 'rxjs';
import { SessionDataService } from './session-data.service';

@Injectable()
export class GenericEntityService {
    readonly serviceUrl: string;

    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService,
        private sessionDataService: SessionDataService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    // getGenericEntity(tableName: string, sortColumnName: string): Observable<IGenericEntityResponse> {
    //     // TODO use the capitalize method in single-column-crud and make it a global method
    //     let url: string = this.serviceUrl + '/' + tableName + 's/search/findAllByOrderBy' + StringUtils.capitalize(sortColumnName);
    //     console.log(url);
    //     return this.httpClient.get<IGenericEntityResponse>(url, this.getHttpOptions());
    // }

    getGenericEntityPage(tableName: string, first: number, size: number, search: string, queryOrderByColumns: string[]): Observable<IGenericEntityResponse> {
        console.log('first, size, search', first, size, search)
        let url: string = this.serviceUrl + '/' + tableName + 'Controller/findAll/?page=' + first / size + '&size=' + size + '&search=' + search + '&sort=' + queryOrderByColumns;
        console.log('url', url);
        return this.httpClient.get<IGenericEntityResponse>(url, this.getHttpOptions());
    }

    addGenericEntity(tableName: string, row: IGenericEntity): Observable<IGenericEntityResponse> {
        let url: string = this.serviceUrl + '/' + tableName + 's';
        console.log('row: ', row);
        row.created = new Date();
        row.modified = new Date();
        console.log('row: ', row);
        return this.httpClient.post<IGenericEntity>(url, row, this.getHttpOptions()).pipe(
            map((twoColumnEntityResponse: any) => {
                console.log('twoColumnEntityResponse', twoColumnEntityResponse);
                return twoColumnEntityResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
            }));
    }

    updateGenericEntity(row: IGenericEntity): Observable<IGenericEntityResponse> {
        console.log('row: ', row);
        row.modified = new Date();
        console.log('row: ', row);

        let url: string = row._links.self.href;
        console.log('url: ', url);
        return this.httpClient.put<IGenericEntity>(url, row, this.getHttpOptions()).pipe(
            map((response: any) => {
                let twoColumnEntityResponse = response;
                console.log('twoColumnEntityResponse', twoColumnEntityResponse);
                return twoColumnEntityResponse;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
            }));
    }

    deleteGenericEntity(row: IGenericEntity): Observable<IGenericEntityResponse> {
        let url: string = row._links.self.href;
        console.log('url: ', url);
        return this.httpClient.delete<void>(url, this.getHttpOptions()).pipe(
            map((response: any) => {
                let twoColumnEntityResponse = response;
                console.log('twoColumnEntityResponse', twoColumnEntityResponse);
                return twoColumnEntityResponse;
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
