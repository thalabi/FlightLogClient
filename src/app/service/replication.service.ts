import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionDataService } from './session-data.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ReplicationService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient,
        private sessionDataService: SessionDataService
    ) {
        this.serviceUrl = environment.beRestServiceUrl;
    }

    getTableReplicationStatus(entityName: string): Observable<number> {

        let url: string = this.serviceUrl + '/protected/replicationController/getTableReplicationStatus/' + entityName;
        return this.http.get<number>(url, this.getHttpOptions());
    }

    setTableReplicationStatus(entityName: string, status: boolean): Observable<void> {

        let url: string = this.serviceUrl + '/protected/replicationController/setTableReplicationStatus/' + entityName;
        let body = { "status": status };
        return this.http.put<void>(url, body, this.getHttpOptions());
    }

    private getHttpOptions() {
        console.log('this.sessionDataService.user.token', this.sessionDataService.user?.token);
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.sessionDataService.user?.token
            })
        }
    };

}
