import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FlightLogServiceService } from './flight-log-service.service';

@Injectable()
export class ReplicationService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    getTableReplicationStatus(entityName: string) : Observable<number> {

        let url: string = this.serviceUrl + '/replicationController/getTableReplicationStatus/' + entityName;
        return this.http.get<number>(url);
    }

    setTableReplicationStatus(entityName: string, status: boolean) : Observable<void> {

        let url: string = this.serviceUrl + '/replicationController/setTableReplicationStatus/' + entityName;
        let body = {"status": status};
        return this.http.put<void>(url, body);
    }

}
