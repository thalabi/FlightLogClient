import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../flight-log-service.service';

@Component({
    selector: 'app-flight-log-table',
    templateUrl: './flight-log-table.component.html',
    styleUrls: ['./flight-log-table.component.css']
})
export class FlightLogTableComponent implements OnInit {

    flightLogArray: Array<any>;

    constructor(private flightLogService: FlightLogServiceService) { }

    ngOnInit() {
        this.flightLogService.getAll().subscribe(data => {
            this.flightLogArray = data;
            console.log('this.flightLogArray', this.flightLogArray)
        });
    }

}
