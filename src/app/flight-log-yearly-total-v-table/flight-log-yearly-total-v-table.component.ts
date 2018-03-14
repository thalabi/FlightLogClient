import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../flight-log-service.service';
import { FlightLogYearlyTotalV } from '../domain/flight-log-yearly-total-v';
import { FlightLogYearlyTotalVResponse } from '../response/flight-log-yearly-total-v-response';

@Component({
  selector: 'app-flight-log-yearly-total-v-table',
  templateUrl: './flight-log-yearly-total-v-table.component.html',
  styleUrls: ['./flight-log-yearly-total-v-table.component.css']
})
export class FlightLogYearlyTotalVTableComponent implements OnInit {

    flightLogYearlyTotalVArray: Array<FlightLogYearlyTotalV>;

    constructor(private flightLogService: FlightLogServiceService) { }

    ngOnInit() {
        this.flightLogService.getFlightLogYearlyTotalV().subscribe({
            next: response => {
                let flightLogYearlyTotalVResponse: FlightLogYearlyTotalVResponse = response;
                console.log('flightLogYearlyTotalVResponse', flightLogYearlyTotalVResponse);
                this.flightLogYearlyTotalVArray = flightLogYearlyTotalVResponse._embedded.flightLogYearlyTotalVs;
                console.log('this.flightLogYearlyTotalVArray', this.flightLogYearlyTotalVArray);
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
