import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { IGenericEntityListResponse } from '../response/i-generic-entity-list-response';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StringUtils } from '../string-utils';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { FlightLogServiceService } from './flight-log-service.service';
import { Observable, throwError } from 'rxjs';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { AssociationAttributes } from "../config/AssociationAttributes";
import { environment } from '../../environments/environment';

@Injectable()
export class GenericEntityService {
    readonly serviceUrl: string;

    constructor(
        private httpClient: HttpClient
    ) {
        this.serviceUrl = environment.beRestServiceUrl;
    }

    getAllGenericEntity(tableName: string, orderColumnName?: string): Observable<IGenericEntityResponse> {
        // TODO use the capitalize method in single-column-crud and make it a global method
        if (! /* not */ orderColumnName) {
            orderColumnName = tableName;
        }
        let url: string = this.serviceUrl + '/protected/data-rest/' + tableName + 's/search/findAllByOrderBy' + StringUtils.capitalize(orderColumnName);
        console.log(url);
        return this.httpClient.get<IGenericEntityResponse>(url);
    }

    addGenericEntity(tableName: string, row: IGenericEntity): Observable<IGenericEntityResponse> {
        let url: string = this.serviceUrl + '/protected/data-rest/' + tableName + 's';
        console.log('row: ', row);
        // row.created = new Date();
        // row.modified = new Date();
        // console.log('row: ', row);
        return this.httpClient.post<IGenericEntity>(url, row).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return throwError(() => new Error());
            }));
    }

    updateGenericEntity(row: IGenericEntity): Observable<IGenericEntityResponse> {
        console.log('row: ', row);
        // row.modified = new Date();
        // console.log('row: ', row);

        let url: string = row._links.self.href;
        console.log('url: ', url);
        return this.httpClient.patch<IGenericEntity>(url, row).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return throwError(() => new Error());
            }));
    }

    deleteGenericEntity(row: IGenericEntity): Observable<IGenericEntityListResponse> {
        let url: string = row._links.self.href;
        console.log('url: ', url);
        return this.httpClient.delete<void>(url).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return throwError(() => new Error());
            }));
    }

    getAssociationGenericEntity(tableName: string, queryOrderByColumns: string[]): Observable<IGenericEntityListResponse> {
        // TODO use queryOrderByColumns and call the controller instead of the resource repository directly
        let url: string = this.serviceUrl + '/protected/data-rest/' + tableName + 's?size=10000';
        console.log('url', url);
        return this.httpClient.get<IGenericEntityListResponse>(url);
    }

    getAssociatedRows(crudRow: IGenericEntity, associationAttributes: AssociationAttributes, queryOrderByColumns: string[]): Observable<IGenericEntityListResponse> {
        // TODO fix
        //let associationLink: string = crudRow._links[associationAttributes.associationPropertyName].href;
        let associationLink: string = crudRow._links.self.href;
        console.log('associationLink', associationLink);
        return this.httpClient.get<IGenericEntityListResponse>(associationLink);
    }

    getAssociatedRow(crudRow: IGenericEntity, associationAttributes: AssociationAttributes, queryOrderByColumns: string[]): Observable<IGenericEntity> {
        // TODO fix
        //let associationLink: string = crudRow._links[associationAttributes.associationPropertyName].href;
        let associationLink: string = crudRow._links.self.href;
        console.log('associationLink', associationLink);
        return this.httpClient.get<IGenericEntity>(associationLink);
    }

    updateAssociationGenericEntity(row: IGenericEntityResponse, associationPropertyName: string, associationArray: Array<IGenericEntity>): Observable<IGenericEntityResponse> {
        console.log('row._links.self', row._links.self);
        associationArray.forEach(association => console.log('association._links.self', association._links.self));
        let associationUriList: string = '';
        associationArray.forEach(association => associationUriList += association._links.self.href + '\n');
        associationUriList = associationUriList.substring(0, associationUriList.length);
        console.log('associationUriList', associationUriList);
        // TODO fix
        //return this.httpClient.put<IGenericEntity>(row._links[associationPropertyName].href, associationUriList, this.getUriListHttpOptions()).pipe(
        return this.httpClient.put<IGenericEntity>(row._links.self.href, associationUriList, this.getUriListHttpOptions()).pipe(
            map((response: any) => {
                console.log('response', response);
                return response;
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
                FlightLogServiceService.handleError(httpErrorResponse);
                return throwError(() => new Error());
            }));
    }

    getTableData2(tableName: string, searchCriteria: string, pageNumber: number, pageSize: number, sortColumns?: Array<string>, projection?: string): Observable<any> {
        searchCriteria = encodeURIComponent(searchCriteria)
        let sortQueryParams: string = ''
        if (sortColumns) {
            console.log('sortColumns', sortColumns)
            sortColumns.forEach(sortColumnAndDirection => {
                sortQueryParams = sortQueryParams + "&sort=" + sortColumnAndDirection
            })
            console.log('sortQueryParams', sortQueryParams)
        }
        const projectionParam: string = projection ? `&projection=${projection}` : ''

        const entityNameResource = GenericEntityService.toPlural(GenericEntityService.toCamelCase(tableName))
        console.log('entityNameResource', entityNameResource)
        return this.httpClient.get(this.serviceUrl + '/protected/genericEntityController/findAll?' + 'tableName=' + tableName + '&search=' + searchCriteria + '&page=' + pageNumber + '&size=' + pageSize + sortQueryParams + projectionParam)
    }
    getRecordCount(tableName: string): Observable<any> {
        return this.httpClient.get(this.serviceUrl + '/protected/genericEntityController/countAll?' + 'tableName=' + tableName);
    }

    public static toCamelCase(tableName: string): string {
        return tableName.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()); // convert to camel case
    }
    public static toPlural(entityName: string): string {
        return entityName.endsWith('s') ? entityName + 'es' : entityName + 's'
    }

    private getUriListHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'text/uri-list',
            })
        }
    };

}
