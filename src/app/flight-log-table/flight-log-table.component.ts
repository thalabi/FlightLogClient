import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../flight-log-service.service';
import { FlightLog } from '../flight-log';
import { FlightLogResponse } from '../flight-log-response';
import { HalResponsePage } from '../hal-response-page';
import { HalResponseLinks } from '../hal-response-links';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector: 'app-flight-log-table',
    templateUrl: './flight-log-table.component.html',
    styleUrls: ['./flight-log-table.component.css']
})
export class FlightLogTableComponent implements OnInit {

    flightLogResponse: FlightLogResponse;
    flightLogArray: Array<FlightLog>;
    page: HalResponsePage;
    links: HalResponseLinks;

    constructor(private flightLogService: FlightLogServiceService) { }

    ngOnInit() {
        this.page = new HalResponsePage();
        //this.page.totalElements = 777777;
        // this.flightLogService.getAll().subscribe(data => {
        //     this.flightLogResponse = data;
        //     console.log('this.flightLogResponse', this.flightLogResponse);
        //     console.log('this.flightLogResponse.page.number', this.flightLogResponse.page.number);
        //     console.log('this.flightLogResponse.page.size', this.flightLogResponse.page.size);
        //     console.log('this.flightLogResponse.page.totalElements', this.flightLogResponse.page.totalElements);
        //     console.log('this.flightLogResponse.page.totalPages', this.flightLogResponse.page.totalPages);
        //     console.log('this.flightLogResponse._links', this.flightLogResponse._links);

        //     console.log('this.flightLogResponse._embedded', this.flightLogResponse._embedded);
        //     console.log('this.flightLogResponse._embedded.flightLogs[0]', this.flightLogResponse._embedded.flightLogs[0]);
        //     this.flightLogArray = this.flightLogResponse._embedded.flightLogs;
        // });

        //this.getTableRows();
    }

    onNextPage() {
        this.getTableRows(this.flightLogResponse._links.next.href);
    }

    onPrevPage() {
        this.getTableRows(this.flightLogResponse._links.prev.href);
    }

    onFirstPage() {
        this.getTableRows(this.flightLogResponse._links.first.href);
    }

    onLastPage() {
        this.getTableRows(this.flightLogResponse._links.last.href);
    }

    getTableRows(url?: string) {

        this.flightLogService.getAll(url).subscribe(data => {
            this.flightLogResponse = data;
            this.flightLogArray = this.flightLogResponse._embedded.flightLogs;
            this.page = this.flightLogResponse.page;
            this.links = this.flightLogResponse._links;
        });
    }

    getTableRowsLazy(event: LazyLoadEvent) {
        console.log('event', event);
        let page: number = event.first / 10;
        console.log('page', event.first / 10);
        this.flightLogService.getPage(page).subscribe(data => {
            this.flightLogResponse = data;
            this.flightLogArray = this.flightLogResponse._embedded.flightLogs;
            this.page = this.flightLogResponse.page;
            this.links = this.flightLogResponse._links;
        });
    }
}
