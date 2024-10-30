import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ReplicationService {
    readonly serviceUrl: string;

    constructor(
        private http: HttpClient
    ) {
        this.serviceUrl = environment.beRestServiceUrl;
    }

    getTableReplicationStatus(entityName: string): Observable<number> {

        let url: string = this.serviceUrl + '/protected/replicationController/getTableReplicationStatus/' + entityName;
        return this.http.get<number>(url);
    }

    setTableReplicationStatus(entityName: string, status: boolean): Observable<void> {

        let url: string = this.serviceUrl + '/protected/replicationController/setTableReplicationStatus/' + entityName;
        let body = { "status": status };
        return this.http.put<void>(url, body);
    }
}
