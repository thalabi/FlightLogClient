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
import { ResponseType } from '@angular/http';
import { AircraftComponentName } from '../../domain/aircraft-component-name';
import { stringify } from 'querystring';

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

    downloadAllPdf(): Observable<Blob> {
        console.log('downloadAllPdf');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/printComponentHistoryByDatePerformedDesc';
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }

    downloadByDatePerformedFilterDateRangePdf(fromDatePerformed: Date, toDatePerformed: Date): Observable<Blob> {
        console.log('downloadByDatePerformedFilterDateRangePdf', fromDatePerformed.toISOString.toString());
        let url: string = this.serviceUrl
            + '/aircraftMaintenancePrintController/printComponentHistoryBetweenDatesPerformedByDatePerformedDesc' + '?' + 'fromDatePerformed=' + fromDatePerformed.toISOString() + '&' + 'toDatePerformed=' + toDatePerformed.toISOString();
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }

    downloadByComponentNamePdf(): Observable<Blob> {
        console.log('downloadByComponentNamePdf');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/printComponentHistoryByComponentName';
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }

    downloadByDateDuePdf(): Observable<Blob> {
        console.log('downloadByDateDuePdf');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/printComponentHistoryByDateDueDesc';
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }
    
    downloadByUpcomingDateDue(): Observable<Blob> {
        console.log('downloadByUpcomingDateDue');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/printComponentHistoryByUpcomingDateDue';
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }

    downloadByHoursDuePdf(): Observable<Blob> {
        console.log('downloadByHoursDuePdf');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/printComponentHistoryByHoursDueDesc';
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }

    downloadAfterLatestHoursPerformedByHoursDuePdf(): Observable<Blob> {
        console.log('downloadAfterHoursByHoursDuePdf');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/printComponentHistoryAfterLatestHoursPerformedByHoursDueDesc';
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }

    downloadAfterHoursByHoursDuePdf(hoursDue: number): Observable<Blob> {
        console.log('downloadAfterHoursByHoursDuePdf');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/printComponentHistoryAfterHoursByHoursDueDesc' + '?hoursDue=' + hoursDue;
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }

    getComponentNames(): Observable<Array<AircraftComponentName.ComponentName>> {
        console.log('getComponentNames2');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/getComponentNames';
        console.log('url', url);
        return this.httpClient.get<Array<AircraftComponentName.ComponentName>>(url, this.getHttpOptions());
    }

    downloadComponentNameInListPdf(componentNameArray: Array<AircraftComponentName.ComponentName>): Observable<Blob> {
        console.log('downloadComponentNameInListPdf');
        let url: string = this.serviceUrl + '/aircraftMaintenancePrintController/printComponentHistoryByComponentNameInList' + '?componentNameList=' + encodeURIComponent(componentNameArray.map(componentName => componentName.name).toString());
        console.log('url', url);
        return this.httpClient.get<Blob>(url, this.getHttpOptions('blobAsJson')).pipe(
            map((response: any) => {
                //return new Blob([response.blob()], { type: 'application/pdf' })
                console.log('response', response);
                return new Blob([response], { type: 'application/pdf' })
            }));
    }


    // private getHttpOptions() {
    //     //console.log('this.sessionDataService.user.token', this.sessionDataService.user.token);
    //     return {headers: new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + this.sessionDataService.user.token
    //         })
    //     }
    // };
    private getHttpOptions(responseType?: string) {
        //console.log('this.sessionDataService.user.token', this.sessionDataService.user.token);
        if (responseType) {
            return {
                responseType: 'blob' as 'json',
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.sessionDataService.user.token
                    })
            }
        } else {
            return {headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.sessionDataService.user.token
                })
            }
        }
    };
}
