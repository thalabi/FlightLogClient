import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { StringUtils } from '../string-utils';

@Injectable()
export class GenericEntityService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    getGenericEntityCount(tableName: string): Observable<any> {
        let url: string = this.serviceUrl + '/' + tableName + 'Controller/count';
        return this.http.get<IGenericEntityResponse>(url);
    }

    getGenericEntity(tableName: string, sortColumnName: string): Observable<IGenericEntityResponse> {
        // TODO use the capitalize method in single-column-crud and make it a global method
        let url: string = this.serviceUrl + '/' + tableName + 's/search/findAllByOrderBy' + StringUtils.capitalize(sortColumnName);
        console.log(url);
        return this.http.get<IGenericEntityResponse>(url);
    }

    getGenericEntityPage(tableName: string, first: number, size: number, search: string, queryOrderByColumns: string[]): Observable<IGenericEntityResponse> {
        console.log('first, size, search', first, size, search)
        let url: string = this.serviceUrl + '/' + tableName + 'Controller/findAll/?page=' + first/size + '&size=' + size + '&search=' + search + '&sort=' + queryOrderByColumns;
        console.log('url', url);
        return this.http.get<IGenericEntityResponse>(url);
    }

}
