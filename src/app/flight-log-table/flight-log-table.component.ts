import { Component, OnInit, ViewChild } from '@angular/core';
import { FlightLogServiceService } from '../service/flight-log-service.service';
import { FlightLog } from '../domain/flight-log';
import { FlightLogResponse } from '../response/flight-log-response';
import { HalResponsePage } from '../hal/hal-response-page';
import { HalResponseLinks } from '../hal/hal-response-links';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { SelectItem } from 'primeng/api/selectitem';
import { Airport } from '../domain/airport';
import { MakeModel } from '../domain/make-model';
import { Registration } from '../domain/registration';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CrudEnum } from '../crud-enum';
import { FlightLogHelper } from './flight-log-table-helper';
import { Pilot } from '../domain/pilot';
import { ComponentHelper } from '../util/ComponentHelper';
import { MyMessageService } from '../message/mymessage.service';
import { ReplicationService } from '../service/replication.service';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { GenericEntityService } from '../service/generic-entity.service';
import { MenuComponent } from '../menu/menu.component';
import { SessionService } from '../service/session.service';
import { PermissionEnum } from '../menu/permission-enum';
import { HttpErrorResponse } from '@angular/common/http';
import { IFlightLogTotalsVResponse } from '../response/IFlightLogTotalsVResponse';
import { IFlightLogTotalsV } from '../response/IFlightLogTotalsV';

@Component({
    selector: 'app-flight-log-table',
    templateUrl: './flight-log-table.component.html',
    styleUrls: ['./flight-log-table.component.css']
})
export class FlightLogTableComponent implements OnInit {

    readonly fieldNames: Array<string> = ['flightDate', 'makeModel', 'registration', 'pic', 'coPilot', 'routeFrom', 'routeTo', 'remarks', 'dayDual', 'daySolo', 'nightDual', 'nightSolo', 'instrumentSimulated', 'instrumentFlightSim', 'xcountryDay', 'xcountryNight', 'instrumentImc', 'instrumentNoIfrAppr', 'tosLdgsDay', 'tosLdgsNight'];

    flightLogForm: FormGroup;

    //flightLogResponse: FlightLogResponse = {} as FlightLogResponse;
    flightLogTotalsVResponse: IFlightLogTotalsVResponse = {} as IFlightLogTotalsVResponse;
    //flightLogArray: Array<FlightLog> = [];
    flightLogTotalsVs: Array<IFlightLogTotalsV> = [];
    //selectedFlightLog: FlightLog = {} as FlightLog;
    selectedFlightLogTotalsV: IFlightLogTotalsV = {} as IFlightLogTotalsV;
    overPanelFlightLogTotalsV: IFlightLogTotalsV = {} as IFlightLogTotalsV;
    crudFlightLog: FlightLog = {} as FlightLog;
    //crudFlightLogTotalsV: IFlightLogTotalsV = {} as IFlightLogTotalsV;
    page: HalResponsePage = {} as HalResponsePage;
    //links: HalResponseLinks = {} as HalResponseLinks;

    cols: any[] = [];
    colsPart2: any[] = [];

    columns: { name: string; header: string; order: number; format: string, filterable: boolean, type: string, fractionDigits: number }[] = [];
    sortColumns: Array<string> = []


    columnOptions: SelectItem[] = [];

    // toDateCols: any[] = [];

    modifyAndDeleteButtonsDisable: boolean = true;
    crudMode: CrudEnum = CrudEnum.ADD;// "Add";
    crudEnum = CrudEnum; // Used in html to refere to enum
    displayDialog: boolean = false;

    displayTotalsDialog: boolean = false;

    makeModelSelectItemArray: Array<SelectItem> = [];
    registrationSelectItemArray: Array<SelectItem> = [];
    pilotSelectItemArray: Array<SelectItem> = [];

    filteredAirportArray: Array<Airport> = [];
    fromAirport: Airport = {} as Airport;
    toAirport: Airport = {} as Airport;

    // used to pass as argument to getTableRowsLazy() when refreshing page after add/update/delete
    savedLazyLoadEvent: LazyLoadEvent = {} as LazyLoadEvent;

    readonly ROWS_PER_PAGE: number = 10; // default rows per page
    firstRowOfTable!: number; // triggers a page change, zero based. 0 -> first row, 1 -> second row, ...

    pageNumber!: number;

    loadingStatus: boolean = false;

    replicationStatus: boolean = false;
    replicationStatusLabel!: string;
    replicationStatusControlDisabled: boolean = true;

    readonly tableName: string = 'flightLog';

    hasWritePermission: boolean = false;

    pageRowKey: string = ''
    pageDayDual: number = 0;
    pageDaySolo: number = 0;
    pageNightDual: number = 0;
    pageNightSolo: number = 0;
    pageInstrumentImc: number = 0;
    pageInstrumentSimulated: number = 0;
    pageInstrumentFlightSim: number = 0;
    pageInstrumentNoIfrAppr: number = 0;
    pageXCountryDay: number = 0;
    pageXCountryNight: number = 0;
    pageTosLdgsDay: number = 0;
    pageTosLdgsNight: number = 0;
    pageTotal: number = 0;

    constructor(private formBuilder: FormBuilder, private flightLogService: FlightLogServiceService, private genericEntityService: GenericEntityService, private replicationService: ReplicationService, private messageService: MyMessageService, private sessionService: SessionService) {
        this.flightLogForm = FlightLogHelper.createForm(formBuilder);
    }

    ngOnInit() {
        this.messageService.clear();
        this.page = {} as HalResponsePage;
        this.cols = [
            { field: 'flightDate', header: 'Date', style: { 'width': '6em', 'white-space': 'nowrap' }, filterable: 'true', type: 'date' },
            { field: 'makeModel', header: 'Mk Mdl', style: { 'width': '6em' }, filterable: 'true', type: 'text' },
            { field: 'registration', header: 'Reg', style: { 'width': '4em' }, filterable: 'true', type: 'text' },
            { field: 'pic', header: 'PIC', style: { 'width': '8em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' }, filterable: 'true', type: 'text' },
            { field: 'coPilot', header: 'Co Pilot', style: { 'width': '8em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' }, filterable: 'true', type: 'text' },
            { field: 'routeFrom', header: 'From', style: { 'width': '4em' }, filterable: 'true', type: 'text' },
            { field: 'routeTo', header: 'To', style: { 'width': '4em' }, filterable: 'true', type: 'text' },
            // {field: 'remarks', header: 'Remarks', style: {'width': '30em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'}},
            { field: 'remarks', header: 'Remarks', style: { 'width': '10em', 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' } },
            { field: 'dayDual', header: 'D D', tooltipText: 'Day Dual', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },
            { field: 'daySolo', header: 'D S', tooltipText: 'Day Solo', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },
            { field: 'nightDual', header: 'N D', tooltipText: 'Night Dual', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },
            { field: 'nightSolo', header: 'N S', tooltipText: 'Night Solo', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },

            { field: 'xcountryDay', header: 'X D', tooltipText: 'Cross Country Day', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },
            { field: 'xcountryNight', header: 'X N', tooltipText: 'Cross Country Night', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },
            { field: 'tosLdgsDay', header: 'L D', tooltipText: 'Total Landings Day', style: { 'width': '3em' }, filterable: 'true', type: 'numeric' },
            { field: 'tosLdgsNight', header: 'L N', tooltipText: 'Total Landings Night', style: { 'width': '3em' }, filterable: 'true', type: 'numeric' },
        ];
        this.colsPart2 = [
            { field: 'instrumentSimulated', header: 'Inst Sim', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },
            { field: 'instrumentFlightSim', header: 'Inst Flt Sim', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },
            { field: 'instrumentImc', header: 'Inst IMC', style: { 'width': '3em' }, filterable: 'true', type: 'numeric', fractionDigits: 1 },
            { field: 'instrumentNoIfrAppr', header: '# IFR Apr', style: { 'width': '3em' }, filterable: 'true', type: 'numeric' },
        ];
        this.columnOptions = [];
        for (let i = 0; i < this.cols.length; i++) {
            this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i] });
        }
        for (let i = 0; i < this.colsPart2.length; i++) {
            this.columnOptions.push({ label: this.colsPart2[i].header, value: this.colsPart2[i] });
        }

        // this.toDateCols = [
        //     { field: 'toDateDayDual', header: 'D D', tooltipText: 'Day Dual', style: { 'width': '3em' } },
        //     { field: 'toDateDaySolo', header: 'D S', tooltipText: 'Day Solo', style: { 'width': '3em' } },
        //     { field: 'toDateNightDual', header: 'N D', tooltipText: 'Night Dual', style: { 'width': '3em' } },
        //     { field: 'toDateNightSolo', header: 'N S', tooltipText: 'Night Solo', style: { 'width': '3em' } },

        //     { field: 'toDateXCountryDay', header: 'X D', tooltipText: 'Cross Country Day', style: { 'width': '3em' } },
        //     { field: 'toDateXCountryNight', header: 'X N', tooltipText: 'Cross Country Night', style: { 'width': '3em' } },
        //     { field: 'toDateTosLdgsDay', header: 'L D', tooltipText: 'Total Landings Day', style: { 'width': '3em' } },
        //     { field: 'toDateTosLdgsNight', header: 'L N', tooltipText: 'Total Landings Night', style: { 'width': '3em' } },
        //     { field: 'toDateInstrumentSimulated', header: 'Inst Sim', style: { 'width': '3em' } },
        //     { field: 'toDateInstrumentFlightSim', header: 'Inst Flt Sim', style: { 'width': '3em' } },

        //     { field: 'toDateInstrumentImc', header: 'Inst IMC', style: { 'width': '3em' } },
        //     { field: 'toDateInstrumentNoIfrAppr', header: '# IFR Apr', style: { 'width': '3em' } },
        // ]

        this.getMakeModels();
        this.getRegistrations();
        this.getPilots();

        //this.getTableMetaData();

        // set the firstRowOfTable to the first row of the last page
        this.flightLogService.getFlightLogCount().subscribe({
            next: data => {
                let rowCount: number = data.count;
                console.log('rowCount', rowCount);
                let pageNumber: number = Math.floor(rowCount / this.ROWS_PER_PAGE);
                if (rowCount % this.ROWS_PER_PAGE != 0) pageNumber++;
                this.firstRowOfTable = (pageNumber - 1) * this.ROWS_PER_PAGE;
                console.log('this.firstRowOfTable', this.firstRowOfTable);
            }
        });

        //this.hasWritePermission = MenuComponent.isHolderOfAnyAuthority(this.sessionDataService.user || {} as User, PermissionEnum.FLIGHT_LOG_WRITE);
        this.sessionService.userInfo$.subscribe(userInfo => {
            console.log('userInfo', userInfo)
            this.hasWritePermission = MenuComponent.isHolderOfAnyRole(userInfo, PermissionEnum.FLIGHT_LOG_WRITE);
        });
    }

    private getTableMetaData() {
        this.flightLogService.getTableMetaDataAlps('flight_log_totals_v')
            .subscribe(
                {
                    next: (metaData: any) => {
                        console.log('alps metaData', metaData)
                        const alpsDescriptors = metaData.alps.descriptor
                        console.log('alps alpsDescriptors', alpsDescriptors)
                        const representationDescriptorId = FlightLogServiceService.toCamelCase('flight_log_totals_v') + '-representation';
                        const representationDescriptor = alpsDescriptors.find((descriptor: { id: string; }) => descriptor.id = representationDescriptorId)
                        console.log('representationDescriptor', representationDescriptor)
                        const columnDescriptors = representationDescriptor.descriptor
                        console.log('columnDescriptors', columnDescriptors)
                        this.columns = []
                        columnDescriptors.forEach((descriptor: any) => {
                            console.log(descriptor.name, descriptor.doc?.value)
                            const columnName = descriptor.name
                            if (columnName === 'version') return // skip version column
                            let columnAttributesMap = new Map()

                            if (descriptor.doc?.value) {
                                const columnAttributesArray: string[] = descriptor.doc?.value.split(',')
                                columnAttributesArray.forEach(columnAttribute => {
                                    const tuple = columnAttribute.split('=')
                                    columnAttributesMap.set(tuple[0], tuple[1])
                                })
                            }
                            console.log('columnAttributesMap', columnAttributesMap)
                            // 1) title attribute
                            let header: string = columnAttributesMap.get('title')
                            // If title attribute is not specified use the column name to generate the header
                            if (! /* not */ header) {
                                // use column name to generate a header. eq firstName => First Name
                                header = columnName[0].toUpperCase() + columnName.slice(1)
                                header = header.replace(/([A-Z])/g, ' $1').trim()
                            }
                            // 2) columnDisplayOrder attribute
                            let columnOrder: number = columnAttributesMap.get('columnDisplayOrder')
                            // 3) format attribute
                            let format: string = columnAttributesMap.get('format')
                            // 4) filterable attribute
                            let filterable: boolean = columnAttributesMap.get('filterable')
                            // 5) type attribute (text, numeric, boolean or date) see https://www.primefaces.org/primeng-v14-lts/table#:~:text=p%2DcolumnFilter%20component.-,Data%20Types,-ColumnFilter%20requires%20a
                            let type: string = columnAttributesMap.get('type')
                            // 6) fractionDigits attribute
                            let fractionDigits: number = columnAttributesMap.get('fractionDigits')


                            this.columns.push({ name: columnName, header: header, order: columnOrder ?? 1, format: format, filterable: filterable, type: type, fractionDigits: fractionDigits })
                            // 7) sortOrder and sortDirection attributes
                            if (columnAttributesMap.get('sortOrder')) {
                                const sortOrder: number = columnAttributesMap.get('sortOrder')
                                console.log('sortOrder', sortOrder)
                                this.sortColumns[sortOrder] = columnName
                                if (columnAttributesMap.get('sortDirection')) {
                                    const sortDirection: string = columnAttributesMap.get('sortDirection')
                                    console.log('sortDirection', sortDirection)
                                    this.sortColumns[sortOrder] = this.sortColumns[sortOrder] + "," + sortDirection
                                }
                            }
                        });
                        console.log('this.columns', this.columns)
                        this.columns.sort((a, b) => a.order > b.order ? 1 : -1)
                        console.log('this.columns sorted', this.columns)
                    },
                    complete: () => {

                        // test begin
                        // merge column attributes
                        let mc: [{}]
                        const mergedColumns = {
                            ...this.cols,
                            ...this.columns,
                        }
                        console.log('mergedColumns', mergedColumns)
                        // test end

                        console.log('Retrieving table meta data complete')
                    },
                    error: (httpErrorResponse: HttpErrorResponse) => {
                        this.messageService.error(httpErrorResponse.status.toString(), 'Server error. Please contact support.')
                    }

                }
            )

    }
    private getMakeModels() {
        this.genericEntityService.getAllGenericEntity('makeModel').subscribe({
            next: data => {
                let makeModelResponse: IGenericEntityResponse = data;
                this.makeModelSelectItemArray = new Array<SelectItem>();
                makeModelResponse['_embedded']['makeModels'].forEach((makeModel: MakeModel) => {
                    this.makeModelSelectItemArray.push({ label: makeModel.makeModel, value: makeModel.makeModel });
                });
            }
        });
    }

    private getRegistrations() {
        this.genericEntityService.getAllGenericEntity('registration').subscribe(data => {
            console.log('data', data);
            let registrationResponse: IGenericEntityResponse = data;
            console.log('registrationResponse', registrationResponse);
            this.registrationSelectItemArray = new Array<SelectItem>();
            registrationResponse['_embedded']['registrations'].forEach((registration: Registration) => {
                this.registrationSelectItemArray.push({ label: registration.registration, value: registration.registration });
            });
        });
    }

    private getPilots() {
        this.genericEntityService.getAllGenericEntity('pilot').subscribe(data => {
            console.log('data', data);
            let pilotResponse: IGenericEntityResponse = data;
            console.log('pilotResponse', pilotResponse);
            this.pilotSelectItemArray = new Array<SelectItem>();
            pilotResponse['_embedded']['pilots'].forEach((pilot: Pilot) => {
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
        //this.fetchPage(lazyLoadEvent.first || 0, lazyLoadEvent.rows || 0, ComponentHelper.buildSearchString(lazyLoadEvent, this.fieldNames));
        this.fetchPage(lazyLoadEvent);
    }

    // fetchPage(firstRowNumber: number, rowsPerPage: number, searchString: string) {
    //     this.loadingStatus = true;
    //     this.flightLogService.getPage(firstRowNumber, rowsPerPage, searchString).subscribe({
    //         next: flightLogResponse => {
    //             console.log('flightLogResponse', flightLogResponse);
    //             this.flightLogResponse = flightLogResponse;
    //             this.page = this.flightLogResponse.page;
    //             this.flightLogArray = this.page.totalElements ? this.flightLogResponse._embedded.flightLogs : [];
    //             // this.flightLogArray.forEach(flightLog => {
    //             //     flightLog.airportFrom = new Airport();
    //             //     flightLog.airportFrom.identifier = flightLog.routeFrom;
    //             // })
    //             this.clearTimes(this.flightLogArray);
    //             console.log('this.flightLogArray', this.flightLogArray);
    //             this.links = this.flightLogResponse._links;
    //         },
    //         complete: () => {
    //             this.loadingStatus = false;
    //         },
    //         error: error => {
    //             this.loadingStatus = false;
    //             console.error(error);
    //             // TODO uncomment later
    //             //this.messageService.clear();
    //             //this.messageService.error(error);
    //         }
    //     });
    // }

    fetchPage(lazyLoadEvent: LazyLoadEvent) {
        console.log(lazyLoadEvent)
        this.loadingStatus = true
        const pageSize = lazyLoadEvent.rows ?? 20
        const pageNumber = (lazyLoadEvent.first ?? 0) / pageSize;
        //const filters: { [s: string]: FilterMetadata[] } | undefined = lazyLoadEvent.filters
        const filters: any = lazyLoadEvent.filters
        console.log('filters', filters)
        console.log('pageNumber', pageNumber, 'pageSize', pageSize, 'filters', filters)
        let searchCriteria: string = ''
        if (filters) {
            console.log('Object.keys(filters)', Object.keys(filters))
            Object.keys(filters).forEach(columnName => {
                console.log('columeName', columnName, 'matchMode', filters[columnName][0].matchMode, 'value', filters[columnName][0].value)
                //searchCriteria += columnName + filters[columnName][0].matchMode + filters[columnName][0].value + ","
                if (filters[columnName][0].value) {
                    if (filters[columnName][0].value instanceof Date) {
                        searchCriteria += columnName + '|' + filters[columnName][0].matchMode + '|' + new Date(filters[columnName][0].value).toISOString() + ","
                    } else {
                        searchCriteria += columnName + '|' + filters[columnName][0].matchMode + '|' + filters[columnName][0].value + ","
                    }
                }
            })
            if (searchCriteria.length > 0) {
                searchCriteria = searchCriteria.slice(0, searchCriteria.length - 1)
            }
            console.log('searchCriteria', searchCriteria)
        }
        const entityNameResource = FlightLogServiceService.toPlural(FlightLogServiceService.toCamelCase('flight_log_totals_v'))
        console.log('entityNameResource 2', entityNameResource)
        this.flightLogService.getTableData2('flight_log_totals_v', searchCriteria, pageNumber, pageSize, ['flightDate', 'id'])
            .subscribe(
                {
                    next: (flightLogTotalsVResponse: IFlightLogTotalsVResponse) => {

                        this.loadingStatus = false

                        console.log('flightLogTotalsVResponse', flightLogTotalsVResponse);
                        this.flightLogTotalsVResponse = flightLogTotalsVResponse;
                        this.page = this.flightLogTotalsVResponse.page;
                        this.flightLogTotalsVs = this.page.totalElements ? this.flightLogTotalsVResponse._embedded.flightLogTotalsVs : [];
                        // this.flightLogArray.forEach(flightLog => {
                        //     flightLog.airportFrom = new Airport();
                        //     flightLog.airportFrom.identifier = flightLog.routeFrom;
                        // })
                        this.clearTimes(this.flightLogTotalsVs);
                        console.log('this.flightLogTotalsVs', this.flightLogTotalsVs);
                        //this.links = this.flightLogTotalsVResponse._links;

                        this.calculatePageTotals(this.flightLogTotalsVs)
                        this.pageRowKey = this.flightLogTotalsVs[this.flightLogTotalsVs.length - 1]._links.flightLogTotalsV.href
                    },
                    complete: () => {
                        // this.messageService.clear()
                        // this.uploadProgressMessage = '';
                        // this.uploadResponse = {} as UploadResponse;
                        // this.messageService.add({ severity: 'info', summary: '200', detail: this.tableFileDownloadProgressMessage })
                    }
                    ,
                    error: (httpErrorResponse: HttpErrorResponse): void => {
                        //this.messageService.add({ severity: 'error', summary: httpErrorResponse.status.toString(), detail: 'Server error. Please contact support.' })
                    }
                });
    }

    private calculatePageTotals(flightLogTotalsVs: IFlightLogTotalsV[]) {
        this.pageDayDual = this.pageDaySolo = this.pageNightDual = this.pageNightSolo = this.pageInstrumentImc = this.pageInstrumentSimulated = this.pageInstrumentFlightSim = this.pageInstrumentNoIfrAppr = this.pageXCountryDay = this.pageXCountryNight = this.pageTosLdgsDay = this.pageTosLdgsNight = this.pageTotal = 0

        flightLogTotalsVs.forEach(flightLogTotalsV => {
            this.pageDayDual += flightLogTotalsV.dayDual
            this.pageDaySolo += flightLogTotalsV.daySolo
            this.pageNightDual += flightLogTotalsV.nightDual
            this.pageNightSolo += flightLogTotalsV.nightSolo
            this.pageInstrumentImc += flightLogTotalsV.instrumentImc
            this.pageInstrumentSimulated += flightLogTotalsV.instrumentSimulated
            this.pageInstrumentFlightSim += flightLogTotalsV.instrumentFlightSim
            this.pageInstrumentNoIfrAppr += flightLogTotalsV.instrumentNoIfrAppr
            this.pageXCountryDay += flightLogTotalsV.xcountryDay
            this.pageXCountryNight += flightLogTotalsV.xcountryNight
            this.pageTosLdgsDay += flightLogTotalsV.tosLdgsDay
            this.pageTosLdgsNight += flightLogTotalsV.tosLdgsNight
            this.pageTotal += flightLogTotalsV.dayDual + flightLogTotalsV.daySolo + flightLogTotalsV.nightDual + flightLogTotalsV.nightSolo
        })
        console.log(this.pageDayDual, this.pageDaySolo)
    }


    onRowSelect(event: any) {
        console.log(event);

        this.crudFlightLog = FlightLogHelper.copyFlogLogProperties(this.selectedFlightLogTotalsV);
        console.log('this.selectedFlightLogTotalsV', this.selectedFlightLogTotalsV)
        console.log('this.crudFlightLog', this.crudFlightLog)
        this.modifyAndDeleteButtonsDisable = false;
        this.fromAirport = {} as Airport;
        this.fromAirport.identifier = this.crudFlightLog.routeFrom;
        this.toAirport = {} as Airport;
        this.toAirport.identifier = this.crudFlightLog.routeTo;
    }
    onRowUnselect(event: any) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = true;
        //this.selectedFlightLog = {} as FlightLog; // This a hack. If don't init selectedFlightLog, dialog will produce exception
        this.selectedFlightLogTotalsV = {} as IFlightLogTotalsV; // This a hack. If don't init selectedFlightLogTotalsV, dialog will produce exception
    }
    showDialog(crudMode: CrudEnum) {
        this.crudMode = crudMode;
        console.log('crudMode', crudMode);
        console.log('this.crudMode', this.crudMode);

        switch (this.crudMode) {
            case CrudEnum.ADD:
                this.flightLogForm.reset();
                this.flightLogForm.get('flightDate')?.setValue(new Date());
                this.flightLogForm.get('makeModel')?.setValue('PA28-181');
                this.flightLogForm.get('registration')?.setValue('GQGD');
                this.flightLogForm.get('pic')?.setValue('Self');
                let cyooAirport: Airport = {} as Airport
                cyooAirport.identifier = 'CYOO';
                this.flightLogForm.get('fromAirport')?.setValue(cyooAirport);
                this.flightLogForm.get('toAirport')?.setValue(cyooAirport);
                this.flightLogForm.get('remarks')?.setValue('VFR - ');
                FlightLogHelper.enableForm(this.flightLogForm);
                this.crudFlightLog = {} as FlightLog;
                break;
            case CrudEnum.UPDATE:
                FlightLogHelper.copyToForm(this.crudFlightLog, this.flightLogForm);
                FlightLogHelper.enableForm(this.flightLogForm);
                break;
            case CrudEnum.DELETE:
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
            case CrudEnum.ADD:
                this.clearTime(this.crudFlightLog);
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
            case CrudEnum.UPDATE:
                this.clearTime(this.crudFlightLog);
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
            case CrudEnum.DELETE:
                console.log('this.crudFlightLog: ', this.crudFlightLog);
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
        //this.selectedFlightLog = {} as FlightLog;
        this.selectedFlightLogTotalsV = {} as IFlightLogTotalsV;
        this.fromAirport = {} as Airport;
        this.toAirport = {} as Airport;
    }
    onCancel() {
        this.resetDialoForm();
        this.displayDialog = false;
    }

    searchAirport(event: { query: string; }) {
        this.flightLogService.getAirportByIdentifierOrName(event.query, event.query).subscribe({
            next: airportArray => {
                this.filteredAirportArray = airportArray;
            }
        });
    }

    onGoToPage() {
        console.log('this.pageNumber', this.pageNumber);
        this.firstRowOfTable = (this.pageNumber - 1) * this.ROWS_PER_PAGE;
        this.savedLazyLoadEvent.first = this.firstRowOfTable;
        this.onLazyLoad(this.savedLazyLoadEvent);
        //this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '');
        this.fetchPage(this.savedLazyLoadEvent);
        this.pageNumber = 0;
    }

    private clearTime(flightLog: FlightLog) {
        flightLog.flightDate.setHours(0);
        flightLog.flightDate.setMinutes(0);
        flightLog.flightDate.setSeconds(0);
        flightLog.flightDate.setMilliseconds(0);
    }

    private clearTimes(flightLogTotalsVs: Array<IFlightLogTotalsV>) {
        flightLogTotalsVs.forEach(flightLogTotalsV => {
            flightLogTotalsV.flightDate = new Date(flightLogTotalsV.flightDate + 'T00:00:00');
        });
    }

    private getTableReplicationStatus() {
        this.replicationStatusLabel = "Fetching";
        this.replicationStatusControlDisabled = false;
        ComponentHelper.getTableReplicationStatusAndLabel(this.replicationService, this.tableName).subscribe(params => {
            this.replicationStatus = params.replicationStatus;
            this.replicationStatusLabel = params.replicationStatusLabel;
        })
    }

    onChangeReplicationStatus(event: { checked: boolean; }) {
        this.replicationStatusLabel = "Updating";
        console.log('onChangeReplicationStatus', event);
        console.log('checked: ', event.checked);
        this.replicationStatusControlDisabled = true;
        this.replicationService.setTableReplicationStatus(this.tableName, event.checked).subscribe(params =>
            this.getTableReplicationStatus()
        );
    }

    displayTotals(event: MouseEvent, key: string) {
        console.log('displayTotals, event:', event, ', event type:', event.type, ', key:', key)
        event.stopPropagation() // top row from being selected
        //this.totalsOverlayPanel?.show()
        this.overPanelFlightLogTotalsV = this.flightLogTotalsVs.find(flightLogTotalsV => flightLogTotalsV._links.flightLogTotalsV.href === key) || {} as IFlightLogTotalsV

    }
    hideTotals(event: MouseEvent, key: string) {
        console.log('hideTotals, event:', event, ', event type:', event.type, ', key:', key)
    }
}
