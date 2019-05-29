import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { IGenericEntityListResponse } from '../response/i-generic-entity-list-response';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { StringUtils } from '../string-utils';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { FlightLogServiceService } from './flight-log-service.service';
import { Observable } from 'rxjs';
import { of as observableOf } from 'rxjs/observable/of'
import { SessionDataService } from './session-data.service';
import { s } from '@angular/core/src/render3';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { AssociationAttributes } from "../config/AssociationAttributes";
import { ComponentRequest } from '../domain/component-request';
import { AircraftComponent } from '../domain/aircraft-component';
import { AircraftComponentListResponse } from '../response/aircraft-component-list-response';

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


    addComponent(row: ComponentRequest): Observable<void> {
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

    modifyComponent(row: ComponentRequest): Observable<void> {
        let url: string = this.serviceUrl + '/componentController/modify';
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

    deleteComponent(componentUri: string): Observable<void> {
        let url: string = this.serviceUrl + '/componentController/delete?componentUri='+componentUri;
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
