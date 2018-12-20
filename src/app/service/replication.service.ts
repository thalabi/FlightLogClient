import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';
import { Observable } from 'rxjs';
import { SessionDataService } from './session-data.service';

@Injectable()
export class ReplicationService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private sessionDataService: SessionDataService
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    getTableReplicationStatus(entityName: string) : Observable<number> {

        let url: string = this.serviceUrl + '/replicationController/getTableReplicationStatus/' + entityName;
        return this.http.get<number>(url, this.getHttpOptions());
    }

    setTableReplicationStatus(entityName: string, status: boolean) : Observable<void> {

        let url: string = this.serviceUrl + '/replicationController/setTableReplicationStatus/' + entityName;
        let body = {"status": status};
        return this.http.put<void>(url, body, this.getHttpOptions());
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
