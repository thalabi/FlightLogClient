import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../service/flight-log-service.service';
import { FlightLogLastXDaysTotalV } from '../domain/flight-log-last-x-days-total-v';
import { FlightLogLastXDaysTotalVResponse } from '../response/flight-log-last-x-days-total-v-response';

@Component({
  selector: 'app-flight-log-last-x-days-total-v-table',
  templateUrl: './flight-log-last-x-days-total-v-table.component.html',
  styleUrls: ['./flight-log-last-x-days-total-v-table.component.css']
})
export class FlightLogLastXDaysTotalVTableComponent implements OnInit {

    flightLogLastXDaysTotalVArray: Array<FlightLogLastXDaysTotalV>;
    
    constructor(private flightLogService: FlightLogServiceService) { }

    ngOnInit() {
        this.flightLogService.getFlightLogLastXDaysTotalV().subscribe({
            next: response => {
                let flightLogLastXDaysTotalVResponse: FlightLogLastXDaysTotalVResponse = response;
                console.log('flightLogLastXDaysTotalVResponse', flightLogLastXDaysTotalVResponse);
                this.flightLogLastXDaysTotalVArray = flightLogLastXDaysTotalVResponse._embedded.flightLogLastXDaysTotalVs;
                console.log('this.flightLogLastXDaysTotalVArray', this.flightLogLastXDaysTotalVArray);
            },
            complete: () => {
            },
            error: error => {
                console.error(error);
                // TODO uncomment later
                //this.messageService.clear();
                //this.messageService.error(error);
            }
        });
    }

}
