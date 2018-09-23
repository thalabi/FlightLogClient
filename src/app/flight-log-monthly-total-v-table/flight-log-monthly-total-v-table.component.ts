import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../service/flight-log-service.service';
import { FlightLogMonthlyTotalVResponse } from '../response/flight-log-monthly-total-v-response';
import { FlightLogMonthlyTotalV } from '../domain/flight-log-monthly-total-v';

@Component({
  selector: 'app-flight-log-monthly-total-v-table',
  templateUrl: './flight-log-monthly-total-v-table.component.html',
  styleUrls: ['./flight-log-monthly-total-v-table.component.css']
})
export class FlightLogMonthlyTotalVTableComponent implements OnInit {

    flightLogMonthlyTotalVArray: Array<FlightLogMonthlyTotalV>;
    loadingFlag: boolean;

    constructor(private flightLogService: FlightLogServiceService) { }

    ngOnInit() {
        this.loadingFlag = true;
        this.flightLogService.getFlightLogMonthlyTotalV().subscribe({
            next: response => {
                let flightLogMonthlyTotalVResponse: FlightLogMonthlyTotalVResponse = response;
                console.log('flightLogMonthlyTotalVResponse', flightLogMonthlyTotalVResponse);
                this.flightLogMonthlyTotalVArray = flightLogMonthlyTotalVResponse._embedded.flightLogMonthlyTotalVs;
                console.log('this.flightLogMonthlyTotalVArray', this.flightLogMonthlyTotalVArray);
            },
            complete: () => {
                this.loadingFlag = false;
            },
            error: error => {
                this.loadingFlag = false;
                console.error(error);
                // TODO uncomment later
                //this.messageService.clear();
                //this.messageService.error(error);
            }
        });
    }

}
