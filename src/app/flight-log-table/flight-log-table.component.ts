import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../service/flight-log-service.service';
import { FlightLog } from '../domain/flight-log';
import { FlightLogResponse } from '../response/flight-log-response';
import { HalResponsePage } from '../hal/hal-response-page';
import { HalResponseLinks } from '../hal/hal-response-links';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { Airport } from '../domain/airport';
import { MakeModel } from '../domain/make-model';
import { Registration } from '../domain/registration';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CrudEnum } from '../crud-enum';
import { FlightLogHelper } from './flight-log-table-helper';
import { PilotResponse } from '../response/pilot-response';
import { Pilot } from '../domain/pilot';
import { forEach } from '@angular/router/src/utils/collection';
import { ISingleColumnEntityResponse } from '../response/i-single-column-entity-response';
import { ComponentHelper } from '../util/ComponentHelper';

@Component({
    selector: 'app-flight-log-table',
    templateUrl: './flight-log-table.component.html',
    styleUrls: ['./flight-log-table.component.css']
})
export class FlightLogTableComponent implements OnInit {

    readonly fieldNames: Array<string> = ['flightDate', 'makeModel', 'registration', 'pic', 'coPilot', 'routeFrom', 'routeTo', 'remarks', 'dayDual', 'daySolo', 'nightDual', 'nightSolo', 'instrumentSimulated', 'instrumentFlightSim', 'xcountryDay', 'xcountryNight', 'instrumentImc', 'instrumentNoIfrAppr', 'tosLdgsDay', 'tosLdgsNight'];

    flightLogForm: FormGroup;

    flightLogResponse: FlightLogResponse;
    flightLogArray: Array<FlightLog>;
    selectedFlightLog: FlightLog;
    crudFlightLog: FlightLog;
    page: HalResponsePage;
    links: HalResponseLinks;

    cols: any[];
    colsPart2: any[];
    columnOptions: SelectItem[];
    
    modifyAndDeleteButtonsDisable: boolean = true;
    crudMode: CrudEnum;
    displayDialog: boolean = false;

    makeModelSelectItemArray: Array<SelectItem>;
    registrationSelectItemArray: Array<SelectItem>;
    pilotSelectItemArray: Array<SelectItem>;

    filteredAirportArray: Array<Airport>;
    fromAirport: Airport;
    toAirport: Airport;

    // used to pass as argument to getTableRowsLazy() when refreshing page after add/update/delete
    savedLazyLoadEvent: LazyLoadEvent;

    readonly ROWS_PER_PAGE: number = 10; // default rows per page
    firstRowOfTable: number; // triggers a page change, zero based. 0 -> first page, 1 -> second page, ...

    pageNumber: number;

    constructor(private formBuilder: FormBuilder, private flightLogService: FlightLogServiceService) {
        console.log('this.displayDialog', this.displayDialog);
        this.flightLogForm = FlightLogHelper.createForm(formBuilder);
    }

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
            // {field: 'remarks', header: 'Remarks', style: {'width': '30em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'}},
            {field: 'remarks', header: 'Remarks', style: {'width': '10em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'}},
            {field: 'dayDual', header: 'D D', tooltipText: 'Day Dual', style: {'width': '3em'}},
            {field: 'daySolo', header: 'D S', tooltipText: 'Day Solo', style: {'width': '3em'}},
            {field: 'nightDual', header: 'N D', tooltipText: 'Night Dual', style: {'width': '3em'}},
            {field: 'nightSolo', header: 'N S', tooltipText: 'Night Solo', style: {'width': '3em'}},

            {field: 'xcountryDay', header: 'X D', tooltipText: 'Cross Country Day', style: {'width': '3em'}},
            {field: 'xcountryNight', header: 'X N', tooltipText: 'Cross Country Night', style: {'width': '3em'}},
            {field: 'tosLdgsDay', header: 'L D', tooltipText: 'Total Landings Day', style: {'width': '3em'}},
            {field: 'tosLdgsNight', header: 'L N', tooltipText: 'Total Landings Night', style: {'width': '3em'}},            
        ];
        this.colsPart2 = [
            {field: 'instrumentSimulated', header: 'Inst Sim', style: {'width': '3em'}},
            {field: 'instrumentFlightSim', header: 'Inst Flt Sim', style: {'width': '3em'}},
            // {field: 'xcountryDay', header: 'X D', style: {'width': '3em'}},
            // {field: 'xcountryNight', header: 'X N', style: {'width': '3em'}},
            {field: 'instrumentImc', header: 'Inst IMC', style: {'width': '3em'}},
            {field: 'instrumentNoIfrAppr', header: '# IFR Apr', style: {'width': '3em'}},
            // {field: 'tosLdgsDay', header: 'L D', style: {'width': '3em'}},
            // {field: 'tosLdgsNight', header: 'L N', style: {'width': '3em'}},            
        ];
        this.columnOptions = [];
        for(let i = 0; i < this.cols.length; i++) {
            this.columnOptions.push({label: this.cols[i].header, value: this.cols[i]});
        }
        for(let i = 0; i < this.colsPart2.length; i++) {
            this.columnOptions.push({label: this.colsPart2[i].header, value: this.colsPart2[i]});
        }

        this.getMakeModels();
        this.getRegistrations();
        this.getPilots();
        // set the firstRowOfTable to the first row of the last page
        this.flightLogService.getFlightLogCount().subscribe({
            next: data => {
                let rowCount: number = data.count;
                console.log('rowCount', rowCount);
                let pageNumber: number = Math.floor(rowCount/this.ROWS_PER_PAGE);
                if (rowCount % this.ROWS_PER_PAGE != 0) pageNumber++;
                this.firstRowOfTable = (pageNumber - 1) * this.ROWS_PER_PAGE;
                console.log('this.firstRowOfTable', this.firstRowOfTable);
            }
        });
    }

    private getMakeModels() {
        this.flightLogService.getAllSingleColumnEntity('makeModel').subscribe({
            next: data => {
                let makeModelResponse: ISingleColumnEntityResponse = data;
                this.makeModelSelectItemArray = new Array<SelectItem>();
                makeModelResponse._embedded['makeModels'].forEach((makeModel: MakeModel) => {
                    this.makeModelSelectItemArray.push({ label: makeModel.makeModel, value: makeModel.makeModel });
                });
            }
        });
    }

    private getRegistrations() {
        this.flightLogService.getAllSingleColumnEntity('registration').subscribe(data => {
            console.log('data', data);
            let registrationResponse: ISingleColumnEntityResponse = data;
            console.log('registrationResponse', registrationResponse);
            this.registrationSelectItemArray = new Array<SelectItem>();
            registrationResponse._embedded['registrations'].forEach((registration: Registration) => {
                this.registrationSelectItemArray.push({ label: registration.registration, value: registration.registration });
            });
        });
    }
    
    private getPilots() {
        this.flightLogService.getAllSingleColumnEntity('pilot').subscribe(data => {
            console.log('data', data);
            let pilotResponse: ISingleColumnEntityResponse = data;
            console.log('pilotResponse', pilotResponse);
            this.pilotSelectItemArray = new Array<SelectItem>();
            pilotResponse._embedded['pilots'].forEach((pilot: Pilot) => {
                this.pilotSelectItemArray.push({ label: pilot.pilot, value: pilot.pilot });
            });
        });
    }
    
    onLazyLoad(lazyLoadEvent: LazyLoadEvent) {
        this.savedLazyLoadEvent = lazyLoadEvent;
        console.log('event', lazyLoadEvent);
        console.log('event.first', lazyLoadEvent.first);
        // console.log('this.firstRowOfTable', this.firstRowOfTable);
        // lazyLoadEvent.first = lazyLoadEvent.first || this.firstRowOfTable;
        // console.log('event.first', lazyLoadEvent.first);
        console.log('event.rows', lazyLoadEvent.rows);
        console.log('event.filters', lazyLoadEvent.filters);
        this.fetchPage(lazyLoadEvent.first,
            lazyLoadEvent.rows, ComponentHelper.buildSearchString(lazyLoadEvent, this.fieldNames));
    }

    fetchPage(firstRowNumber: number, rowsPerPage: number, searchString: string) {
        this.flightLogService.getPage(firstRowNumber, rowsPerPage, searchString)
            .subscribe({
                next: flightLogResponse => {
                    console.log('flightLogResponse', flightLogResponse);
                    this.flightLogResponse = flightLogResponse;
                    this.page = this.flightLogResponse.page;
                    this.flightLogArray = this.page.totalElements ? this.flightLogResponse._embedded.flightLogs : [];
                    // this.flightLogArray.forEach(flightLog => {
                    //     flightLog.airportFrom = new Airport();
                    //     flightLog.airportFrom.identifier = flightLog.routeFrom;
                    // })
                    console.log('this.flightLogArray', this.flightLogArray);
                    this.links = this.flightLogResponse._links;
            }});
    }

    onRowSelect(event) {
        console.log(event);

        this.crudFlightLog = Object.assign({}, this.selectedFlightLog);

        this.modifyAndDeleteButtonsDisable = false;
        this.fromAirport = new Airport();
        this.fromAirport.identifier = this.crudFlightLog.routeFrom;
        this.toAirport = new Airport();
        this.toAirport.identifier = this.crudFlightLog.routeTo;
    }
    onRowUnselect(event) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = true;
        this.selectedFlightLog = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }
    showDialog(crudMode: string) {
        this.crudMode = CrudEnum[crudMode];
        console.log('crudMode', crudMode);
        console.log('this.crudMode', this.crudMode);

        switch (this.crudMode) {
            case CrudEnum.Add:
                this.flightLogForm.reset();
                this.flightLogForm.get('flightDate').setValue(new Date());
                this.flightLogForm.get('makeModel').setValue('PA28-181');
                this.flightLogForm.get('registration').setValue('GQGD');
                this.flightLogForm.get('pic').setValue('Self');
                let cyooAirport: Airport = new Airport();
                cyooAirport.identifier = 'CYOO';
                this.flightLogForm.get('fromAirport').setValue(cyooAirport);
                this.flightLogForm.get('toAirport').setValue(cyooAirport);
                this.flightLogForm.get('remarks').setValue('VFR - ');
                FlightLogHelper.enableForm(this.flightLogForm);
                this.crudFlightLog = new FlightLog();
                break;
            case CrudEnum.Update:
                FlightLogHelper.copyToForm(this.crudFlightLog, this.flightLogForm);
                FlightLogHelper.enableForm(this.flightLogForm);
                break;
            case CrudEnum.Delete:
                FlightLogHelper.copyToForm(this.crudFlightLog, this.flightLogForm);
                FlightLogHelper.disableForm(this.flightLogForm);
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
        this.displayDialog = true;
    }

    onSubmit() {
        FlightLogHelper.copyFromForm(this.flightLogForm, this.crudFlightLog);
        console.log('this.crudFlightLog: ', this.crudFlightLog);
        switch (this.crudMode) {
            case CrudEnum.Add:
                this.flightLogService.addFlightLog(this.crudFlightLog).subscribe({
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
            case CrudEnum.Update:
                this.flightLogService.updateFlightLog(this.crudFlightLog).subscribe({
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
            case CrudEnum.Delete:
                this.flightLogService.deleteFlightLog(this.crudFlightLog).subscribe({
                    next: savedFlightLog => {
                        console.log('deleted flightLog', this.crudFlightLog);
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
        this.resetDialoForm();
        this.onLazyLoad(this.savedLazyLoadEvent);
    }
    private resetDialoForm() {
        this.flightLogForm.reset();
        this.selectedFlightLog = new FlightLog();
        this.fromAirport = new Airport();
        this.toAirport = new Airport();
    }
    onCancel() {
        this.resetDialoForm();
        this.displayDialog = false;
    }

    searchAirport(event) {
        this.flightLogService.getAirportByIdentifierOrName(event.query, event.query).subscribe({
            next: airportArray => {
                this.filteredAirportArray = airportArray;
            }});
    }

    onGoToPage() {
        console.log('this.pageNumber', this.pageNumber);
        this.firstRowOfTable = (this.pageNumber - 1) * this.ROWS_PER_PAGE;
        this.savedLazyLoadEvent.first = this.firstRowOfTable;
        this.onLazyLoad(this.savedLazyLoadEvent);
        this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '');
        this.pageNumber = null;
    }

}
