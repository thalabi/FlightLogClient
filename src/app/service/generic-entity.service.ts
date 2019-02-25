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

    // getAllGenericEntity(tableName: string): Observable<IGenericEntityResponse> {
    //     // TODO use the capitalize method in single-column-crud and make it a global method
    //     let url: string = this.serviceUrl + '/' + tableName + 's/search/findAllByOrderBy' + StringUtils.capitalize(tableName);
    //     console.log(url);
    //     return this.httpClient.get<IGenericEntityResponse>(url, this.getHttpOptions());
    // }
    getAllGenericEntity(tableName: string, orderColumnName?: string): Observable<IGenericEntityResponse> {
        // TODO use the capitalize method in single-column-crud and make it a global method
        if (! /* not */ orderColumnName) {
            orderColumnName = tableName;
        }
        let url: string = this.serviceUrl + '/' + tableName + 's/search/findAllByOrderBy' + StringUtils.capitalize(orderColumnName);
        console.log(url);
        return this.httpClient.get<IGenericEntityResponse>(url, this.getHttpOptions());
    }
    
    getGenericEntityPage(tableName: string, first: number, size: number, search: string, queryOrderByColumns: string[]): Observable<IGenericEntityListResponse> {
        console.log('first, size, search', first, size, search)
        let url: string = this.serviceUrl + '/' + tableName + 'Controller/findAll/?page=' + first / size + '&size=' + size + '&search=' + search + '&sort=' + queryOrderByColumns;
        console.log('url', url);
        return this.httpClient.get<IGenericEntityListResponse>(url, this.getHttpOptions());
    }

    addGenericEntity(tableName: string, row: IGenericEntity): Observable<IGenericEntityResponse> {
        let url: string = this.serviceUrl + '/' + tableName + 's';
        console.log('row: ', row);
        row.created = new Date();
        row.modified = new Date();
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

    updateGenericEntity(row: IGenericEntity): Observable<IGenericEntityResponse> {
        console.log('row: ', row);
        row.modified = new Date();
        console.log('row: ', row);

        let url: string = row._links.self.href;
        console.log('url: ', url);
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

    deleteGenericEntity(row: IGenericEntity): Observable<IGenericEntityListResponse> {
        let url: string = row._links.self.href;
        console.log('url: ', url);
        return this.httpClient.delete<void>(url, this.getHttpOptions()).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
            }));
    }

    getAssociationGenericEntity(tableName: string, queryOrderByColumns: string[]): Observable<IGenericEntityListResponse> {
        // TODO use queryOrderByColumns and call the controller instead of the resource repository directly
        let url: string = this.serviceUrl + '/' + tableName + 's?size=10000';
        console.log('url', url);
        return this.httpClient.get<IGenericEntityListResponse>(url, this.getHttpOptions());
    }

    getAssociatedRows(crudRow: IGenericEntity, associationAttributes: AssociationAttributes, queryOrderByColumns: string[]): Observable<IGenericEntityListResponse> {
        // TODO fix
        let associationLink: string = crudRow._links[associationAttributes.associationPropertyName].href;
        console.log('associationLink', associationLink);
        return this.httpClient.get<IGenericEntityListResponse>(associationLink, this.getHttpOptions());
    }

    updateAssociationGenericEntity(row: IGenericEntityResponse, associationAttributes: AssociationAttributes, associationArray: Array<IGenericEntity>): Observable<IGenericEntityResponse> {
        console.log('row._links.self', row._links.self);
        associationArray.forEach(association=> console.log('association._links.self', association._links.self));
        let associationUriList: string = '';
        associationArray.forEach(association=> associationUriList += association._links.self.href + '\n');
        associationUriList = associationUriList.substring(0, associationUriList.length);
        console.log('associationUriList', associationUriList);
        // TODO fix
        return this.httpClient.put<IGenericEntity>(row._links[associationAttributes.associationPropertyName].href, associationUriList, this.getUriListHttpOptions()).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return null;
            }));
        return null;
    }

    private getHttpOptions() {
        console.log('this.sessionDataService.user.token', this.sessionDataService.user.token);
        return {headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.sessionDataService.user.token
            })
        }
    };
    private getUriListHttpOptions() {
        console.log('this.sessionDataService.user.token', this.sessionDataService.user.token);
        return {headers: new HttpHeaders({
            'Content-Type': 'text/uri-list',
            'Authorization': 'Bearer ' + this.sessionDataService.user.token
            })
        }
    };

}
