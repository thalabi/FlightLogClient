import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FlightLog } from './domain/flight-log';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { FlightLogResponse } from './response/flight-log-response';
import { MakeModelResponse } from './response/make-model-response';
import { Airport } from './domain/airport';
import { AirportResponse } from './response/airport-response';
import { RegistrationResponse } from './response/registration-response';
import { MakeModel } from './domain/make-model';

@Injectable()
export class FlightLogServiceService {
    readonly URL 
    readonly SORT_COLUMN: string = 'flightDate';
    //PAGE_SIZE: number = 10;
    //URL: string = 'http://localhost:8080/flightLogs/?sort=' + this.SORT_COLUMN + '&size=' + this.PAGE_SIZE;

    constructor(private http: HttpClient) { }

    getAll(url?: string): Observable<FlightLogResponse> {
        if (! url) {
            url = 'http://localhost:8080/flightLogs/?size=9999&sort=flightDate';
        }
        return this.http.get<FlightLogResponse>(url);
            // .map((response: any) => {
            //     return response._embedded.flightLogs;
            // })
            ;
            //.catch(this.handleError);
    }

    getPageOld(first: number, size: number, search: string): Observable<FlightLogResponse> {
        let url: string = 'http://localhost:8080/flightLogController/findAllBySpec2/?page=' + first/size + '&size=' + size + '&search=' + search;
        console.log('url', url);
        //let url: string = this.URL + '&page=' + first/size;
        return this.http.get<FlightLogResponse>(url);
            // .map((response: any) => {
            //     return response._embedded.flightLogs;
            // })
            ;
            //.catch(this.handleError);
    }
    getPage3(): Observable<FlightLogResponse> {
        return this.getPage(0, 9999, '');
    }
    getPage(first: number, size: number, search: string): Observable<FlightLogResponse> {
        console.log('first, size, search', first, size, search)
        // let url: string = 'http://localhost:8080/flightLogController/findAllBySpec2/?page=' + first/size + '&size=' + size + '&search=' + search;
        let url: string = 'http://localhost:8080/flightLogController/findAllBySpec2/';
        if ((first || first == 0) && size) {
            url += '?page=' + first/size + '&size=' + size;
        } else {
            url += '?page=0&size=9999';
        }
        url += '&search=' + search + '&sort=flightDate';
        console.log('url', url);
        //let url: string = this.URL + '&page=' + first/size;
        return this.http.get<FlightLogResponse>(url)
            .map((response: any) => {
                let flightLogResponse = response;
                let flightLogArray = flightLogResponse._embedded.flightLogs;
                // Revive dates to their proper format
                for (let flightLog of flightLogArray) {
                    flightLog.flightDate = new Date(flightLog.flightDate+' 00:00:00');
                    flightLog.created = new Date(flightLog.created);
                }
                return flightLogResponse;
            })
            ;
            //.catch(this.handleError);
    }

    addFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        let url: string = 'http://localhost:8080/flightLogs';
        console.log('flightLog: ', flightLog);
        flightLog.created = new Date();
        flightLog.modified = new Date();
        console.log('flightLog: ', flightLog);
        return this.http.post<FlightLog>(url, flightLog)
            .map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleError(httpErrorResponse);
                return null;
              });;
    }
    
    updateFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        console.log('flightLog: ', flightLog);
        flightLog.modified = new Date();
        console.log('flightLog: ', flightLog);
        
        let url: string = flightLog._links.flightLog.href;
        console.log('url: ', url);
        return this.http.put<FlightLog>(url, flightLog)
            .map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleError(httpErrorResponse);
                return null;
              });;
    }

    deleteFlightLog(flightLog: FlightLog): Observable<FlightLogResponse> {
        
        let url: string = flightLog._links.flightLog.href;
        console.log('url: ', url);
        return this.http.delete<void>(url)
            .map((response: any) => {
                let flightLogResponse = response;
                console.log('flightLogResponse', flightLogResponse);
                return flightLogResponse;
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleError(httpErrorResponse);
                return null;
              });;
    }

    //
    // make model
    //
    getAllMakeModel(): Observable<MakeModelResponse> {
        let url: string = 'http://localhost:8080/makeModels/search/findAllByOrderByName';
        return this.http.get<MakeModelResponse>(url);
    }
    
    addMakeModel(makeModel: MakeModel): Observable<MakeModelResponse> {
        let url: string = 'http://localhost:8080/makeModels';
        console.log('makeModel: ', makeModel);
        makeModel.created = new Date();
        makeModel.modified = new Date();
        console.log('makeModel: ', makeModel);
        return this.http.post<MakeModel>(url, makeModel)
            .map((response: any) => {
                let makeModelResponse = response;
                console.log('makeModelResponse', makeModelResponse);
                return makeModelResponse;
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleError(httpErrorResponse);
                return null;
              });;
    }

    updateMakeModel(makeModel: MakeModel): Observable<MakeModelResponse> {
        console.log('makeModel: ', makeModel);
        makeModel.modified = new Date();
        console.log('makeModel: ', makeModel);
        
        let url: string = makeModel._links.makeModel.href;
        console.log('url: ', url);
        return this.http.put<MakeModel>(url, makeModel)
            .map((response: any) => {
                let makeModelResponse = response;
                console.log('makeModelResponse', makeModelResponse);
                return makeModelResponse;
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleError(httpErrorResponse);
                return null;
              });;
    }

    deleteMakeModel(makeModel: MakeModel): Observable<MakeModelResponse> {
        
        let url: string = makeModel._links.makeModel.href;
        console.log('url: ', url);
        return this.http.delete<void>(url)
            .map((response: any) => {
                let makeModelResponse = response;
                console.log('makeModelResponse', makeModelResponse);
                return makeModelResponse;
            })
            .catch((httpErrorResponse: HttpErrorResponse) => {
                this.handleError(httpErrorResponse);
                return null;
              });;
    }

    //
    // registration
    //
    getAllRegistration(): Observable<RegistrationResponse> {
        let url: string = 'http://localhost:8080/registrations/search/findAllByOrderByName';
        return this.http.get<RegistrationResponse>(url);
    }
    
    getAirportByIdentifierOrName(identifier: string, name: string): Observable<Array<Airport>> {
        let url: string = 'http://localhost:8080/airports/search/findByIdentifierContainingIgnoreCaseOrNameContainingIgnoreCase?identifier=' + identifier + '&name=' + name;
        return this.http.get<AirportResponse>(url)
            .map((response: any) => {
                let airportResponse = response;
                //console.log('makeModelArray', makeModelArray);
                return airportResponse._embedded.airports;
            })
            ;
            //.catch(this.handleError);
    }
    // TODO needs rewrite
    private handleError(httpErrorResponse: HttpErrorResponse) {
        console.error('An error occurred. See blow info.');
        console.error('httpErrorResponse', httpErrorResponse);
        console.error('httpErrorResponse.error', httpErrorResponse.error);
        console.error('httpErrorResponse.headers', httpErrorResponse.headers);
        console.error('httpErrorResponse.message', httpErrorResponse.message);
        console.error('httpErrorResponse.name', httpErrorResponse.name);
        console.error('httpErrorResponse.ok', httpErrorResponse.ok);
        console.error('httpErrorResponse.status', httpErrorResponse.status);
        console.error('httpErrorResponse.statusText', httpErrorResponse.statusText);
        console.error('httpErrorResponse.type', httpErrorResponse.type);
        console.error('httpErrorResponse.url', httpErrorResponse.url);
    }
}
