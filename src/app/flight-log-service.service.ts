import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FlightLog } from './flight-log';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class FlightLogServiceService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<any>> {
        return this.http.get<Array<any>>('//localhost:8080/flightLogs')
            .map((response: any) => {
                return response._embedded.flightLogs;
            })
            ;
            //.catch(this.handleError);
    }

    getCategories(): Observable<FlightLog[]> {
        return this.http.get<FlightLog[]>('//localhost:8080/flightLogs')
            .map((result:any)=>{
               console.log(result); //<--it's an object
               //result={"_embedded": {"categories": [..]..}
               return result._embedded.categories; //just return "categories"
            });
    }
}
