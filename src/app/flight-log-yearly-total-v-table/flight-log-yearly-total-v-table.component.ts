import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../service/flight-log-service.service';
import { FlightLogYearlyTotalV } from '../domain/flight-log-yearly-total-v';
import { FlightLogYearlyTotalVResponse } from '../response/flight-log-yearly-total-v-response';
import { MyMessageService } from '../message/mymessage.service';

@Component({
  selector: 'app-flight-log-yearly-total-v-table',
  templateUrl: './flight-log-yearly-total-v-table.component.html',
  styleUrls: ['./flight-log-yearly-total-v-table.component.css']
})
export class FlightLogYearlyTotalVTableComponent implements OnInit {

    flightLogYearlyTotalVArray: Array<FlightLogYearlyTotalV>;

    loadingFlag: boolean;

    constructor(private flightLogService: FlightLogServiceService, private messageService: MyMessageService) { }

    ngOnInit() {
        this.messageService.clear();
        this.loadingFlag = true;
        this.flightLogService.getFlightLogYearlyTotalV().subscribe({
            next: response => {
                let flightLogYearlyTotalVResponse: FlightLogYearlyTotalVResponse = response;
                console.log('flightLogYearlyTotalVResponse', flightLogYearlyTotalVResponse);
                this.flightLogYearlyTotalVArray = flightLogYearlyTotalVResponse._embedded.flightLogYearlyTotalVs;
                console.log('this.flightLogYearlyTotalVArray', this.flightLogYearlyTotalVArray);
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
