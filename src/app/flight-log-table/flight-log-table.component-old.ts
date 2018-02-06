import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../flight-log-service.service';
import { FlightLog } from '../domain/flight-log';
import { FlightLogResponse } from '../response/flight-log-response';
import { HalResponsePage } from '../hal/hal-response-page';
import { HalResponseLinks } from '../hal/hal-response-links';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { MakeModelResponse } from '../response/make-model-response';
import { Airport } from '../domain/airport';
import { MakeModel } from '../domain/make-model';
import { RegistrationResponse } from '../response/registration-response';
import { Registration } from '../domain/registration';

@Component({
    selector: 'app-flight-log-table',
    templateUrl: './flight-log-table.component.html',
    styleUrls: ['./flight-log-table.component.css']
})
export class FlightLogTableComponent implements OnInit {

    flightLogResponse: FlightLogResponse;
    flightLogArray: Array<FlightLog>;
    selectedFlightLog: FlightLog;
    page: HalResponsePage;
    links: HalResponseLinks;

    cols: any[];
    colsPart2: any[];
    columnOptions: SelectItem[];
    
    modifyAndDeleteButtonsDisable: boolean = true;
    crudMode: string;
    displayDialog: boolean;

    makeModelSelectItemArray: Array<SelectItem>;
    registrationSelectItemArray: Array<SelectItem>;

    filteredAirportArray: Array<Airport>;
    fromAirport: Airport;
    toAirport: Airport;

    // used to pass as argument to getTableRowsLazy() when refreshing page after add/update/delete
    savedLazyLoadEvent: LazyLoadEvent;

    constructor(private flightLogService: FlightLogServiceService) { }

    ngOnInit() {
        this.page = new HalResponsePage();
        this.cols = [
            {field: 'flightDate', header: 'Date', style: {'width': '6em', 'white-space': 'nowrap'}},
            {field: 'makeModel', header: 'Mk Mdl', style: {'width': '6em'}},
            {field: 'registration', header: 'Reg', style: {'width': '4em'}},
            {field: 'pic', header: 'PIC', style: {'width': '8em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'}},
            {field: 'coPilot', header: 'Co Pilot', style: {'width': '8em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'}},
            {field: 'routeFrom', header: 'From', style: {'width': '4em'}},
            {field: 'routeTo', header: 'To', style: {'width': '4em'}},
            {field: 'remarks', header: 'Remarks', style: {'width': '30em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'}},
            {field: 'dayDual', header: 'D D', style: {'width': '3em'}},
            {field: 'daySolo', header: 'D S', style: {'width': '3em'}},
            {field: 'nightDual', header: 'N D', style: {'width': '3em'}},
            {field: 'nightSolo', header: 'N S', style: {'width': '3em'}},
        ];
        this.colsPart2 = [
            {field: 'instrumentSimulated', header: 'Inst Sim', style: {'width': '3em'}},
            {field: 'instrumentFlightSim', header: 'Inst Flt Sim', style: {'width': '3em'}},
            {field: 'xcountryDay', header: 'X D', style: {'width': '3em'}},
            {field: 'xcountryNight', header: 'X N', style: {'width': '3em'}},
            {field: 'instrumentImc', header: 'Inst IMC', style: {'width': '3em'}},
            {field: 'instrumentNoIfrAppr', header: '# IFR Apr', style: {'width': '3em'}},
            {field: 'tosLdgsDay', header: 'L D', style: {'width': '3em'}},
            {field: 'tosLdgsNight', header: 'L N', style: {'width': '3em'}},            
        ];
        this.columnOptions = [];
        for(let i = 0; i < this.cols.length; i++) {
            this.columnOptions.push({label: this.cols[i].header, value: this.cols[i]});
        }
        for(let i = 0; i < this.colsPart2.length; i++) {
            this.columnOptions.push({label: this.colsPart2[i].header, value: this.colsPart2[i]});
        }
        //this.getTableRows();
        this.selectedFlightLog = new FlightLog();
        this.selectedFlightLog.flightDate = new Date();

        this.getMakeModels();
        this.getRegistrations();
    }

    // onNextPage() {
    //     this.getTableRows(this.flightLogResponse._links.next.href);
    // }

    // onPrevPage() {
    //     this.getTableRows(this.flightLogResponse._links.prev.href);
    // }

    // onFirstPage() {
    //     this.getTableRows(this.flightLogResponse._links.first.href);
    // }

    // onLastPage() {
    //     this.getTableRows(this.flightLogResponse._links.last.href);
    // }

    // getTableRows(url?: string) {

    //     this.flightLogService.getAll(url).subscribe(data => {
    //         this.flightLogResponse = data;
    //         this.flightLogArray = this.flightLogResponse._embedded.flightLogs;
    //         this.page = this.flightLogResponse.page;
    //         this.links = this.flightLogResponse._links;
    //     });
    // }


    private getMakeModels() {
        this.flightLogService.getAllMakeModel().subscribe({
            next: data => {
                let makeModelResponse: MakeModelResponse = data;
                this.makeModelSelectItemArray = new Array<SelectItem>();
                makeModelResponse._embedded.makeModels.forEach((makeModel: MakeModel) => {
                    this.makeModelSelectItemArray.push({ label: makeModel.name, value: makeModel.name });
                });
            }
        });
    }

    private getRegistrations() {
        this.flightLogService.getAllRegistration().subscribe(data => {
            console.log('data', data);
            let registrationResponse: RegistrationResponse = data;
            console.log('registrationResponse', registrationResponse);
            this.registrationSelectItemArray = new Array<SelectItem>();
            registrationResponse._embedded.registrations.forEach((registration: Registration) => {
                this.registrationSelectItemArray.push({ label: registration.name, value: registration.name });
            });
        });
    }
    
    getTableRowsLazy(lazyLoadEvent: LazyLoadEvent) {
        this.savedLazyLoadEvent = lazyLoadEvent;
        console.log('event', lazyLoadEvent);
        console.log('event.first', lazyLoadEvent.first);
        console.log('event.rows', lazyLoadEvent.rows);
        console.log('event.filters', lazyLoadEvent.filters);
        console.log('event.filters._embedded', lazyLoadEvent.filters._embedded);
        console.log('event.filters.registration', lazyLoadEvent.filters.registration);
        // for (let filter of event.filters) {

        // }
        // let page: number = event.first / this.ROWS_PER_PAGE;
        // console.log('page', event.first / 10);
        this.flightLogService.getPage(lazyLoadEvent.first, lazyLoadEvent.rows, this.buildSearchString(lazyLoadEvent))
            .subscribe({
                next: flightLogResponse => {
                    console.log('data', flightLogResponse);
                    this.flightLogResponse = flightLogResponse;
                    console.log('this.flightLogResponse', this.flightLogResponse);
                    this.flightLogArray = this.flightLogResponse._embedded.flightLogs;
                    // this.flightLogArray.forEach(flightLog => {
                    //     flightLog.airportFrom = new Airport();
                    //     flightLog.airportFrom.identifier = flightLog.routeFrom;
                    // })
                    console.log('this.flightLogArray', this.flightLogArray);
                    this.page = this.flightLogResponse.page;
                    this.links = this.flightLogResponse._links;
            }});
    }

    selectedRowIndex: number;
    originalRow: FlightLog;
    onRowSelect(event) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = false;
        this.fromAirport = new Airport();
        this.fromAirport.identifier = this.selectedFlightLog.routeFrom;
        this.toAirport = new Airport();
        this.toAirport.identifier = this.selectedFlightLog.routeTo;

        this.originalRow = Object.assign({}, this.selectedFlightLog); //clone
        this.selectedRowIndex = this.flightLogArray.indexOf(this.selectedFlightLog);
        console.log('this.selectedRowIndex', this.selectedRowIndex);
    }
    onRowUnselect(event) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = true;
        this.selectedFlightLog = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }
    private resetDialoForm() {
        this.selectedFlightLog = new FlightLog();
        this.fromAirport = new Airport();
        this.toAirport = new Airport();
    }
    showDialog(crudMode: string) {
        this.crudMode = crudMode;
        console.log('crudMode', crudMode);
        console.log('this.crudMode', this.crudMode);
        if (crudMode == 'Add') {
            this.selectedFlightLog = new FlightLog();
            // this.selectedFlightLog.schoolYear = '';
            // this.selectedFlightLog.startDate = undefined;
            // this.selectedFlightLog.endDate = undefined;
        } else {
            console.log('this.selectedFlightLog', this.selectedFlightLog);
            console.log('this.selectedFlightLog.flightDate', this.selectedFlightLog.flightDate);
        }
        this.displayDialog = true;
    }

    onSubmit() {
        this.selectedFlightLog.makeModel = this.selectedFlightLog.makeModel.toUpperCase();
        this.selectedFlightLog.registration = this.selectedFlightLog.registration.toUpperCase();
        console.log('this.selectedFlightLog', this.selectedFlightLog);
        this.selectedFlightLog.routeFrom = this.fromAirport ? this.fromAirport.identifier : '';
        this.selectedFlightLog.routeTo = this.toAirport ? this.toAirport.identifier : '';
        
        switch (this.crudMode) {
            case 'Add':
                this.flightLogService.addFlightLog(this.selectedFlightLog).subscribe({
                    next: savedFlightLog => {
                        console.log('savedFlightLog', savedFlightLog);
                    },
                    error: error => {
                        console.error('flightLogService.saveFlightLog() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case 'Modify':
                this.flightLogService.updateFlightLog(this.selectedFlightLog).subscribe({
                    next: savedFlightLog => {
                        console.log('updatedFlightLog', savedFlightLog);
                    },
                    error: error => {
                        console.error('flightLogService.updateFlightLog() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case 'Delete':
                this.flightLogService.deleteFlightLog(this.selectedFlightLog).subscribe({
                    next: savedFlightLog => {
                        console.log('deleted flightLog', this.selectedFlightLog);
                    },
                    error: error => {
                        console.error('flightLogService.saveFlightLog() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
        
    }

    private afterCrud() {
        this.displayDialog = false;
        this.modifyAndDeleteButtonsDisable = true;
        this.getTableRowsLazy(this.savedLazyLoadEvent);
        this.resetDialoForm();
    }
    onCancel() {
        this.resetDialoForm();
        this.displayDialog = false;
        console.log('this.originalRow', this.originalRow);
        console.log('this.selectedRowIndex', this.selectedRowIndex);
        console.log('this.flightLogArray[this.selectedRowIndex]', this.flightLogArray[this.selectedRowIndex]);
        console.log('this.originalRow', this.originalRow)
        this.flightLogArray[this.selectedRowIndex] = this.originalRow;
        console.log('this.flightLogArray[this.selectedRowIndex]', this.flightLogArray[this.selectedRowIndex]);
    }

    // results: string[];

    // search(event) {
    //     // this.mylookupservice.getResults(event.query).then(data => {
    //     //     this.results = data;
    //     // });
    //     this.results = ['C-152', 'C-172', 'C-172RG', 'PA28-180', 'PA28-181'];
    // }

    searchAirport(event) {
        this.flightLogService.getAirportByIdentifierOrName(event.query, event.query).subscribe({
            next: airportArray => {
                this.filteredAirportArray = airportArray;
            }});
    }

    private disableSubmitButton(): boolean {
        return (this.selectedFlightLog.flightDate == null ||
            this.selectedFlightLog.makeModel == null || this.selectedFlightLog.registration == null) &&
                           (this.crudMode == 'Add' || this.crudMode == 'Modify');
    }
    private buildSearchString (event): string {
        let search: string = '';
        if (event.filters.flightDate) {
            search = search + 'flightDate:' + event.filters.flightDate.value + ',';
        }
        if (event.filters.registration) {
            search = search + 'registration:' + event.filters.registration.value + ',';
        }
        if (event.filters.makeModel) {
            search = search + 'makeModel:' + event.filters.makeModel.value + ',';
        }
        if (event.filters.pic) {
            search = search + 'pic:' + event.filters.pic.value + ',';
        }
        if (event.filters.coPilot) {
            search = search + 'coPilot:' + event.filters.coPilot.value + ',';
        }
        if (event.filters.routeFrom) {
            search = search + 'routeFrom:' + event.filters.routeFrom.value + ',';
        }
        if (event.filters.routeTo) {
            search = search + 'routeTo:' + event.filters.routeTo.value + ',';
        }
        search = search.slice(0, -1);
        console.log('search', search);
        return search;
    }
}
