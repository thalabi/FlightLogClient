import { Component, OnInit } from '@angular/core';
import { GenericEntityService } from '../../service/generic-entity.service';
import { AircraftComponentService } from '../service/aircraft-component.service';
import { MyMessageService } from '../../message/mymessage.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { Constant } from '../../constant';
import { IGenericEntity } from '../../domain/i-gerneric-entity';
import { ComponentHelper } from '../../util/ComponentHelper';
import { AircraftComponent } from '../../domain/aircraft-component';
import { HalResponsePage } from '../../hal/hal-response-page';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { HalResponseLinks } from '../../hal/hal-response-links';
import { CrudEnum } from '../../crud-enum';
import { AircraftComponentRequest } from '../../domain/aircraft-component-request';
import { SessionService } from '../../service/session.service';
import { PermissionEnum } from '../../menu/permission-enum';
import { AircraftComponentListResponse } from '../../response/aircraft-component-list-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { BackendStacktraceDisplayComponent } from '../../backend-stacktrace-display/backend-stacktrace-display.component';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
    standalone: true,
    selector: 'app-aircraft-component',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MessagesModule, TableModule, TooltipModule, AutoCompleteModule, CalendarModule, ButtonModule, DialogModule, InputSwitchModule, OverlayPanelModule, BackendStacktraceDisplayComponent],
    templateUrl: './aircraft-component.component.html',
    styleUrls: ['./aircraft-component.component.css'],
    providers: [AircraftComponentService]
})
export class AircraftComponentComponent implements OnInit {

    componentForm!: FormGroup;
    hasWritePermission: boolean = false;
    readonly COMPONENT_TABLE_NAME: string = 'component';
    readonly PART_TABLE_NAME: string = 'part';
    readonly SORT_COLUMNS: Array<string> = ['name'];

    partRowArray!: Array<IGenericEntity>;
    filteredParts!: Array<IGenericEntity>;
    selectedPartRow!: IGenericEntity;

    componentRowArray!: Array<AircraftComponent>;
    selectedComponentRow!: AircraftComponent;
    selectedComponentRowCopy!: AircraftComponent;
    selectedComponentAndHistoryRow!: AircraftComponent;
    selectedComponentAndHistoryRowCopy!: AircraftComponent;

    componentAndHistoryArray!: Array<AircraftComponent>;

    loadingStatus!: boolean;
    page!: HalResponsePage;

    displayDialog!: boolean;

    crudMode!: CrudEnum;
    componentHistoryCrudMode!: CrudEnum | null;
    historyCrudMode!: CrudEnum;
    crudEnum = CrudEnum; // Used in html to refere to enum
    modifyAndDeleteButtonsDisable: boolean = true;

    // used to pass as argument to getTableRowsLazy() when refreshing page after add/update/delete
    savedLazyLoadEvent!: LazyLoadEvent;
    readonly ROWS_PER_PAGE: number = 10; // default rows per page
    firstRowOfTable!: number; // triggers a page change, zero based. 0 -> first page, 1 -> second page, ...
    pageNumber!: number;
    links!: HalResponseLinks;

    tempAircraftComponentHistorySelfHrefSeq: number = 0; // temp href used to assign to added aircraftComponentHistory records
    readonly tempAircraftComponentHistorySelfHrefPrefix: string = 'tempSelfHref';

    constructor(private genericEntityService: GenericEntityService, private aircraftComponentService: AircraftComponentService, private messageService: MyMessageService,
        private sessionService: SessionService) { }

    ngOnInit() {
        this.messageService.clear();
        this.sessionService.clearBackendStackTrace()

        this.componentRowArray = [];
        this.page = {} as HalResponsePage;
        this.createForm();
        this.fetchPartTable();

        console.log('Constant.entityToWritePermissionMap.get(this.COMPONENT_TABLE_NAME)', Constant.entityToWritePermissionMap.get(this.COMPONENT_TABLE_NAME))

        this.sessionService.userInfo$.subscribe(userInfo => {
            console.log('userInfo', userInfo)
            this.hasWritePermission = MenuComponent.isHolderOfAnyRole(userInfo, PermissionEnum.COMPONENT_WRITE);
        });
    }

    createForm() {
        this.componentForm = new FormGroup({
            name: new FormControl('', Validators.required),
            description: new FormControl(),
            part: new FormControl('', Validators.required),
            workPerformed: new FormControl('', Validators.required),
            datePerformed: new FormControl('', Validators.required),
            hoursPerformed: new FormControl('', Validators.required),
            dateDue: new FormControl(),
            hoursDue: new FormControl(),
            //createHistoryRecord: new FormControl(),
            deleteHistoryRecords: new FormControl(false)
        });
    }

    private fetchPartTable() {
        // Get all rows of part table
        this.genericEntityService.getAssociationGenericEntity(this.PART_TABLE_NAME, []).subscribe({
            next: rowResponse => {
                console.log('part rowResponse: ', rowResponse);
                if (rowResponse._embedded) {
                    this.partRowArray = rowResponse._embedded[this.PART_TABLE_NAME + 's'];
                    ComponentHelper.sortGenericEntity(this.partRowArray, ['name']);
                    console.log('this.partRowArray: ', this.partRowArray);
                } else {
                    this.partRowArray = [];
                }
            },
            error: error => {
                console.error(error);
                this.messageService.error(error);
            }
        });
    }

    onLazyLoad(lazyLoadEvent: LazyLoadEvent) {
        this.savedLazyLoadEvent = lazyLoadEvent;
        console.log('event', lazyLoadEvent);
        console.log('event.first', lazyLoadEvent.first);
        console.log('event.rows', lazyLoadEvent.rows);
        console.log('event.filters', lazyLoadEvent.filters);
        // this.fetchPage(lazyLoadEvent.first || 0, lazyLoadEvent.rows || 0,
        //     ComponentHelper.buildSearchString(lazyLoadEvent, ['name', 'description', 'part.name', 'workPerformed', 'datePerformed', 'hoursPerformed', 'dateDue', 'hoursDue']), this.SORT_COLUMNS);
        // this.fetchPage(lazyLoadEvent.first || 0, lazyLoadEvent.rows || 0,
        //     '', this.SORT_COLUMNS);
        this.fetchPage(lazyLoadEvent)
    }


    fetchPageOld(firstRowNumber: number, rowsPerPage: number, searchString: string, queryOrderByColumns: string[]) {
        console.log("in fetchPage");
        this.loadingStatus = true;
        this.modifyAndDeleteButtonsDisable = true;
        this.selectedComponentRow = {} as AircraftComponent; // unselect row
        this.resetDialoForm();

        this.aircraftComponentService.findAll(this.COMPONENT_TABLE_NAME, firstRowNumber, rowsPerPage, searchString, queryOrderByColumns)
            .subscribe({
                next: rowResponse => {
                    console.log('component rowResponse', rowResponse);
                    this.page = rowResponse.page;
                    if (rowResponse._embedded) {
                        this.firstRowOfTable = this.page.number * this.ROWS_PER_PAGE;

                        this.componentRowArray = rowResponse._embedded.componentModels;
                        // convert date strings to date objects

                        this.componentRowArray.forEach(componentRow => {
                            //componentRow.datePerformed = componentRow.datePerformed ? new Date(componentRow.datePerformed) : null;
                            componentRow.datePerformed = new Date(componentRow.datePerformed);
                            //componentRow.dateDue = componentRow.dateDue ? new Date(componentRow.dateDue) : null;
                            componentRow.dateDue = componentRow.dateDue ? new Date(componentRow.dateDue) : null;
                            //componentRow.created = componentRow.created ? new Date(componentRow.created) : null;
                            //componentRow.created = new Date(componentRow.created);
                            //componentRow.modified = componentRow.modified ? new Date(componentRow.modified) : null;
                            //componentRow.modified = new Date(componentRow.modified);
                            componentRow.componentHistorySet.forEach(componentHistory => {
                                // componentHistory.datePerformed = componentHistory.datePerformed ? new Date(componentHistory.datePerformed) : null;
                                // componentHistory.dateDue = componentHistory.dateDue ? new Date(componentHistory.dateDue) : null;
                                // componentHistory.created = componentHistory.created ? new Date(componentHistory.created) : null;
                                // componentHistory.modified = componentHistory.modified ? new Date(componentHistory.modified) : null;
                                componentHistory.datePerformed = new Date(componentHistory.datePerformed);
                                componentHistory.dateDue = componentHistory.dateDue ? new Date(componentHistory.dateDue) : null;
                                //componentHistory.created = new Date(componentHistory.created);
                                //componentHistory.modified = new Date(componentHistory.modified);
                            });
                        });

                        // this.rowArray = this.transformAttributes(this.rowArray);
                    } else {
                        this.firstRowOfTable = 0;
                        this.componentRowArray = [];
                    }

                    // this.rowArray = page.totalElements ? rowResponse._embedded[this.tableName+'s'] : [];
                    // console.log('this.rowArray', this.rowArray);
                    this.links = rowResponse._links;
                },
                complete: () => {
                    this.loadingStatus = false;
                }
                /*,
                error: error => {
                    this.loadingFlag = false;
                    this.messageService.error('summary', error);
                    console.error(error);
                    let message: {summaryMessage: string, detailMessage: string} = CustomErrorHandler.getHttpErrorResponseMessages(error);
                    console.log(message.summaryMessage, message.detailMessage);
                    this.messageService.error(message.summaryMessage, message.detailMessage);
                    this.messageService.error('summary', 'detail');
                    // TODO uncomment later
                    //this.messageService.clear();
                    //this.messageService.error(error);
                }
                */
            });

    }
    fetchPage(lazyLoadEvent: LazyLoadEvent) {
        console.log(lazyLoadEvent)
        this.loadingStatus = true
        this.modifyAndDeleteButtonsDisable = true;
        this.selectedComponentRow = {} as AircraftComponent; // unselect row
        this.resetDialoForm();
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
                if (filters[columnName][0].value !== null) {
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
        const entityNameResource = GenericEntityService.toPlural(GenericEntityService.toCamelCase(this.COMPONENT_TABLE_NAME))
        console.log('entityNameResource 2', entityNameResource)
        this.genericEntityService.getTableData2(this.COMPONENT_TABLE_NAME, searchCriteria, pageNumber, pageSize, ['name'])
            .subscribe(
                {
                    next: (aircraftComponentListResponse: AircraftComponentListResponse) => {

                        this.loadingStatus = false

                        console.log('aircraftComponentListResponse', aircraftComponentListResponse);
                        //this.flightLogTotalsVResponse = aircraftComponentListResponse;
                        this.page = aircraftComponentListResponse.page;
                        this.firstRowOfTable = this.page.number * this.ROWS_PER_PAGE;
                        this.componentRowArray = this.page.totalElements ? aircraftComponentListResponse._embedded.componentModels : [];
                        // this.clearTimePortionOfDates(this.componentRowArray);
                        console.log('this.componentRowArray', this.componentRowArray);
                        //this.links = this.flightLogTotalsVResponse._links;

                        //this.calculatePageTotals(this.flightLogTotalsVs)
                        //this.pageRowKey = this.flightLogTotalsVs[this.flightLogTotalsVs.length - 1]._links.flightLogTotalsV.href
                        this.componentRowArray.forEach(componentRow => {
                            //this.clearTimePortionOfDates(componentRow);

                            componentRow.datePerformed = new Date(componentRow.datePerformed);
                            componentRow.dateDue = componentRow.dateDue ? new Date(componentRow.dateDue) : null;
                            //componentRow.created = new Date(componentRow.created);
                            //componentRow.modified = new Date(componentRow.modified);
                            componentRow.componentHistorySet.forEach(componentHistory => {
                                // componentHistory.datePerformed = componentHistory.datePerformed ? new Date(componentHistory.datePerformed) : null;
                                // componentHistory.dateDue = componentHistory.dateDue ? new Date(componentHistory.dateDue) : null;
                                // componentHistory.created = componentHistory.created ? new Date(componentHistory.created) : null;
                                // componentHistory.modified = componentHistory.modified ? new Date(componentHistory.modified) : null;
                                componentHistory.datePerformed = new Date(componentHistory.datePerformed);
                                componentHistory.dateDue = componentHistory.dateDue ? new Date(componentHistory.dateDue) : null;
                                //componentHistory.created = new Date(componentHistory.created);
                                //componentHistory.modified = new Date(componentHistory.modified);
                            });
                        });

                    },
                    complete: () => {
                        console.log('this.flightLogService.getTableData2 completed')

                        // this.messageService.clear()
                        // this.uploadProgressMessage = '';
                        // this.uploadResponse = {} as UploadResponse;
                        // this.messageService.add({ severity: 'info', summary: '200', detail: this.tableFileDownloadProgressMessage })
                    }
                    ,
                    error: (httpErrorResponse: HttpErrorResponse): void => {
                        this.loadingStatus = false
                        // this.messageService.add({ severity: 'error', summary: httpErrorResponse.status.toString(), detail: 'Server error. Please contact support.' })
                    }
                });
    }
    // private clearTimePortionOfDates(aircraftComponent: AircraftComponent) {
    //     aircraftComponent.datePerformed.setHours(0);
    //     aircraftComponent.datePerformed.setMinutes(0);
    //     aircraftComponent.datePerformed.setSeconds(0);
    //     aircraftComponent.datePerformed.setMilliseconds(0);
    //     aircraftComponent.dateDue.setHours(0);
    //     aircraftComponent.dateDue.setMinutes(0);
    //     aircraftComponent.dateDue.setSeconds(0);
    //     aircraftComponent.dateDue.setMilliseconds(0);
    // }

    onGoToPage() {
        console.log('this.pageNumber', this.pageNumber);
        // TODO this might be redundant since it is set in fetchPage
        this.firstRowOfTable = (this.pageNumber - 1) * this.ROWS_PER_PAGE;
        this.savedLazyLoadEvent.first = this.firstRowOfTable;
        this.onLazyLoad(this.savedLazyLoadEvent);
        //this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '', this.SORT_COLUMNS);
        this.pageNumber = 0;
    }

    onRowSelect(event: any) {
        console.log('onRowSelect, event', event);
        // Make a copy of selectedComponentRow
        this.selectedComponentRowCopy = Object.assign({}, this.selectedComponentRow);
        console.log('selectedComponentRow', this.selectedComponentRow);
        console.log('selectedComponentRowCopy', this.selectedComponentRowCopy);
        this.modifyAndDeleteButtonsDisable = false;

        // Create componentAndHistoryArray which contains the selected component and its history
        this.componentAndHistoryArray = [];
        let selectedComponent: AircraftComponent = {} as AircraftComponent;

        selectedComponent._links = this.selectedComponentRowCopy._links;
        selectedComponent.name = this.selectedComponentRowCopy.name;
        selectedComponent.description = this.selectedComponentRowCopy.description;
        selectedComponent.part = this.selectedComponentRowCopy.part;
        selectedComponent.datePerformed = this.selectedComponentRowCopy.datePerformed;
        selectedComponent.workPerformed = this.selectedComponentRowCopy.workPerformed;
        selectedComponent.hoursPerformed = this.selectedComponentRowCopy.hoursPerformed;
        selectedComponent.hoursDue = this.selectedComponentRowCopy.hoursDue;
        selectedComponent.dateDue = this.selectedComponentRowCopy.dateDue;
        // selectedComponent.created = this.selectedComponentRowCopy.created;
        // selectedComponent.modified = this.selectedComponentRowCopy.modified;
        console.log('pushing selectedComponent', selectedComponent);
        this.componentAndHistoryArray.push(selectedComponent);

        this.selectedComponentRowCopy.componentHistorySet.forEach(componentHistory => {
            let selectedComponentHistory: AircraftComponent = {} as AircraftComponent;
            selectedComponentHistory._links = componentHistory._links;
            selectedComponentHistory.name = componentHistory.name;
            selectedComponentHistory.description = componentHistory.description;
            selectedComponentHistory.part = componentHistory.part;
            selectedComponentHistory.datePerformed = componentHistory.datePerformed;
            selectedComponentHistory.workPerformed = componentHistory.workPerformed;
            selectedComponentHistory.hoursPerformed = componentHistory.hoursPerformed;
            selectedComponentHistory.hoursDue = componentHistory.hoursDue;
            selectedComponentHistory.dateDue = componentHistory.dateDue;
            // selectedComponentHistory.created = componentHistory.created;
            // selectedComponentHistory.modified = componentHistory.modified;
            console.log('pushing selectedComponentHistory', selectedComponentHistory);
            this.componentAndHistoryArray.push(selectedComponentHistory);
        });

        console.log('componentAndHistoryArray: %o', this.componentAndHistoryArray);
        // this will highlight the first row in table
        this.selectedComponentAndHistoryRow = selectedComponent;
        // make a copy of the selected row
        this.selectedComponentAndHistoryRowCopy = Object.assign({}, this.selectedComponentAndHistoryRow);
    }

    onRowUnselect(event: any) {
        console.log('onRowUnselect, event', event);
        this.modifyAndDeleteButtonsDisable = true;
        //this.selectedRow = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }

    onComponentAndHistoryRowSelect(event: any) {
        console.log('onComponentAndHistoryRowSelect', event);
        console.log('selectedComponentAndHistoryRow', this.selectedComponentAndHistoryRow);
        this.selectedComponentAndHistoryRowCopy = Object.assign({}, this.selectedComponentAndHistoryRow);
        console.log('selectedComponentAndHistoryRowCopy', this.selectedComponentAndHistoryRowCopy);
        // this.selectedComponentAndHistoryRowCopy.datePerformed = new Date(this.selectedComponentAndHistoryRowCopy.datePerformed+'T00:00:00');
        // if (this.selectedComponentAndHistoryRowCopy.dateDue) {
        //     this.selectedComponentAndHistoryRowCopy.dateDue = new Date(this.selectedComponentAndHistoryRowCopy.dateDue+'T00:00:00');
        // }
        this.updateDialogComponent(this.selectedComponentAndHistoryRowCopy);

    }
    // Used as a hack to make componentAndHistory table refresh after setting the selected row
    componentAndHistoryTableVisible: boolean = true;
    onComponentAndHistoryRowUnselect(event: any) {
        console.log('onComponentAndHistoryRowUnselect', event);
        // Set onComponentAndHistoryRowSelect back to its value to prevent Row Unselect
        this.selectedComponentAndHistoryRow = event.data;
        // Turn off and on componentAndHistoryTableVisible to make componentAndHistory refresh showing the selected row
        this.componentAndHistoryTableVisible = false;
        setTimeout(() => this.componentAndHistoryTableVisible = true, 0);

    }

    showDialog(crudMode: CrudEnum) {
        this.displayDialog = true;
        this.sessionService.setDisableParentMessages(true)
        this.crudMode = crudMode;
        this.componentHistoryCrudMode = null;
        console.log('this.crudMode', this.crudMode);
        switch (this.crudMode) {
            case CrudEnum.ADD:
                this.enableFormControls(true);
                break;
            case CrudEnum.UPDATE:
                // this.componentForm.controls.name.patchValue(this.selectedComponentRowCopy.name);
                // this.componentForm.controls.description.patchValue(this.selectedComponentRowCopy.description);
                // this.componentForm.controls.part.patchValue(this.selectedPartRow);
                // this.componentForm.controls.workPerformed.patchValue(this.selectedComponentRowCopy.workPerformed);
                // this.componentForm.controls.datePerformed.patchValue(this.selectedComponentRowCopy.datePerformed);
                // this.componentForm.controls.hoursPerformed.patchValue(this.selectedComponentRowCopy.hoursPerformed);
                // this.componentForm.controls.dateDue.patchValue(this.selectedComponentRowCopy.dateDue);
                // this.componentForm.controls.hoursDue.patchValue(this.selectedComponentRowCopy.hoursDue);
                this.updateDialogComponent(this.selectedComponentRowCopy);
                //this.componentForm.controls.createHistoryRecord.patchValue(null);
                this.enableFormControls(false);
                break;
            case CrudEnum.DELETE:
                // this.componentForm.controls.name.patchValue(this.selectedComponentRowCopy.name);
                // this.componentForm.controls.description.patchValue(this.selectedComponentRowCopy.description);
                // this.componentForm.controls.part.patchValue(this.selectedPartRow);
                // this.componentForm.controls.workPerformed.patchValue(this.selectedComponentRowCopy.workPerformed);
                // this.componentForm.controls.datePerformed.patchValue(this.selectedComponentRowCopy.datePerformed);
                // this.componentForm.controls.hoursPerformed.patchValue(this.selectedComponentRowCopy.hoursPerformed);
                // this.componentForm.controls.dateDue.patchValue(this.selectedComponentRowCopy.dateDue);
                // this.componentForm.controls.hoursDue.patchValue(this.selectedComponentRowCopy.hoursDue);
                this.updateDialogComponent(this.selectedComponentRowCopy);
                this.componentForm.controls['deleteHistoryRecords'].patchValue(false);
                this.enableFormControls(false);
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
        console.log('this.componentForm', this.componentForm);
    }


    setComponentHistoryCrudMode(componentHistoryCrudMode: CrudEnum) {
        this.componentHistoryCrudMode = componentHistoryCrudMode;
        console.log('this.componentHistoryCrudMode', this.componentHistoryCrudMode);
        switch (this.componentHistoryCrudMode) {
            case CrudEnum.ADD:
                this.componentForm.reset();
                this.enableFormControls(true);
                break;
            case CrudEnum.UPDATE:
                this.enableFormControls(true);
                break;
            case CrudEnum.DELETE:
                break;
            default:
                console.error('this.componentHistoryCrudMode is invalid. this.componentHistoryCrudMode: ' + this.componentHistoryCrudMode);
        }
    }

    private updateDialogComponent(selectedComponent: AircraftComponent) {
        console.log('begin updateDialogComponent');
        this.componentForm.controls['name'].patchValue(selectedComponent.name);
        this.componentForm.controls['description'].patchValue(selectedComponent.description);
        this.componentForm.controls['part'].patchValue(this.partRowArray.find(part => part['name'] === selectedComponent.part['name']));
        this.componentForm.controls['workPerformed'].patchValue(selectedComponent.workPerformed);
        this.componentForm.controls['datePerformed'].patchValue(selectedComponent.datePerformed);
        this.componentForm.controls['hoursPerformed'].patchValue(selectedComponent.hoursPerformed);
        this.componentForm.controls['dateDue'].patchValue(selectedComponent.dateDue);
        this.componentForm.controls['hoursDue'].patchValue(selectedComponent.hoursDue);
        //this.componentForm.controls.deleteHistoryRecords.patchValue(false);
        console.log('end updateDialogComponent');
    }
    private clearDialogComponent() {
        this.componentForm.controls['name'].reset();
        this.componentForm.controls['description'].reset();
        this.componentForm.controls['part'].reset();
        this.componentForm.controls['workPerformed'].reset();
        this.componentForm.controls['datePerformed'].reset();
        this.componentForm.controls['hoursPerformed'].reset();
        this.componentForm.controls['dateDue'].reset();
        this.componentForm.controls['hoursDue'].reset();
    }

    onSubmit() {
        console.log('this.crudMode', this.crudMode);
        console.log('this.componentHistoryCrudMode', this.componentHistoryCrudMode);

        // TODO should rename to aircraftComponentRequestComponent
        let aircraftComponentRequest: AircraftComponentRequest.Component = {} as AircraftComponentRequest.Component;
        switch (this.crudMode) {
            case CrudEnum.ADD:
                aircraftComponentRequest.name = this.componentForm.controls['name'].value.trim();
                aircraftComponentRequest.description = this.componentForm.controls['description'].value;
                aircraftComponentRequest.workPerformed = this.componentForm.controls['workPerformed'].value;
                aircraftComponentRequest.datePerformed = this.componentForm.controls['datePerformed'].value;
                aircraftComponentRequest.hoursPerformed = this.componentForm.controls['hoursPerformed'].value;
                aircraftComponentRequest.dateDue = this.componentForm.controls['dateDue'].value;
                aircraftComponentRequest.hoursDue = this.componentForm.controls['hoursDue'].value;
                aircraftComponentRequest.partUri = this.componentForm.controls['part'].value._links.part.href;
                // aircraftComponentRequest.created = new Date();
                // aircraftComponentRequest.modified = new Date();
                console.log("aircraftComponentRequest: %o", aircraftComponentRequest);
                this.aircraftComponentService.addComponent(aircraftComponentRequest).subscribe({
                    next: savedRow => {
                        console.log('addComponent');
                    },
                    error: error => {
                        console.error('enericEntityService.deleteGenericEntity returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.UPDATE:
                // Handle Add, Update and Delete history records
                let component: AircraftComponent = {} as AircraftComponent;
                switch (this.componentHistoryCrudMode) {
                    case CrudEnum.ADD: // Add component history record to history array
                        let tempHrefValue = this.tempAircraftComponentHistorySelfHrefPrefix + "_" + ++this.tempAircraftComponentHistorySelfHrefSeq;
                        component._links = { self: { href: tempHrefValue } };
                        component.name = this.componentForm.controls['name'].value.trim();
                        component.description = this.componentForm.controls['description'].value;
                        component.workPerformed = this.componentForm.controls['workPerformed'].value;
                        component.datePerformed = this.componentForm.controls['datePerformed'].value;
                        component.hoursPerformed = this.componentForm.controls['hoursPerformed'].value;
                        component.dateDue = this.componentForm.controls['dateDue'].value;
                        component.hoursDue = this.componentForm.controls['hoursDue'].value;
                        component.part = this.componentForm.controls['part'].value;
                        // component.created = new Date();
                        // component.modified = new Date();
                        console.log("component: %o", component);
                        console.log('this.componentAndHistoryArray', this.componentAndHistoryArray);
                        this.componentAndHistoryArray.push(component);
                        this.sortComponentAndHistoryArray();
                        console.log('this.componentAndHistoryArray', this.componentAndHistoryArray);
                        // select added record
                        this.selectedComponentAndHistoryRow = component;
                        this.componentHistoryCrudMode = null;
                        break;
                    case CrudEnum.UPDATE: // Update component history record in history array
                        // Find the selected component in the componentAndHistoryArray and update it
                        let aircraftComponentToUpdate = this.componentAndHistoryArray.find(aircraftComponent =>
                            aircraftComponent._links.self.href === this.selectedComponentAndHistoryRow._links.self.href);
                        aircraftComponentToUpdate = aircraftComponentToUpdate || {} as AircraftComponent;
                        console.log('Found row in existing component and existing history', aircraftComponentToUpdate);
                        aircraftComponentToUpdate.name = this.componentForm.controls['name'].value.trim();
                        aircraftComponentToUpdate.description = this.componentForm.controls['description'].value;
                        aircraftComponentToUpdate.workPerformed = this.componentForm.controls['workPerformed'].value;
                        aircraftComponentToUpdate.datePerformed = this.componentForm.controls['datePerformed'].value;
                        aircraftComponentToUpdate.hoursPerformed = this.componentForm.controls['hoursPerformed'].value;
                        aircraftComponentToUpdate.dateDue = this.componentForm.controls['dateDue'].value;
                        aircraftComponentToUpdate.hoursDue = this.componentForm.controls['hoursDue'].value;
                        aircraftComponentToUpdate.part = this.componentForm.controls['part'].value;
                        // aircraftComponentToUpdate.modified = component.modified = new Date();
                        console.log('aircraftComponentToUpdate', aircraftComponentToUpdate);
                        this.sortComponentAndHistoryArray();
                        this.componentHistoryCrudMode = null;
                        break;
                    case CrudEnum.DELETE: // Delete component history record from history array
                        // Find the selected component in the componentAndHistoryArray and delete it
                        let indexOfAircraftComponentToDelete: number = this.componentAndHistoryArray
                            .indexOf(this.selectedComponentAndHistoryRow);
                        this.componentAndHistoryArray.splice(indexOfAircraftComponentToDelete, 1);
                        // Select the first row
                        if (this.componentAndHistoryArray.length != 0) {
                            this.selectedComponentAndHistoryRow = this.componentAndHistoryArray[0];
                            this.updateDialogComponent(this.selectedComponentAndHistoryRow);
                        } else {
                            this.clearDialogComponent();
                        }
                        this.componentHistoryCrudMode = null;
                        break;
                    case null: // Save the history array
                        console.log('About to save updated component and history');
                        console.log('this.componentAndHistoryArray', this.componentAndHistoryArray);
                        aircraftComponentRequest.componentUri = this.selectedComponentRowCopy._links.self.href;
                        if (this.componentAndHistoryArray.length > 0) {
                            aircraftComponentRequest.name = this.componentAndHistoryArray[0].name;
                            aircraftComponentRequest.description = this.componentAndHistoryArray[0].description;
                            aircraftComponentRequest.workPerformed = this.componentAndHistoryArray[0].workPerformed;
                            aircraftComponentRequest.datePerformed = this.componentAndHistoryArray[0].datePerformed;
                            aircraftComponentRequest.hoursPerformed = this.componentAndHistoryArray[0].hoursPerformed;
                            aircraftComponentRequest.dateDue = this.componentAndHistoryArray[0].dateDue;
                            aircraftComponentRequest.hoursDue = this.componentAndHistoryArray[0].hoursDue;

                            //aircraftComponentRequest.partUri = this.partRowArray.find(part => part['name'] === this.componentAndHistoryArray[0].part['name'])._links.self.href;
                            const part = this.partRowArray.find(part => part['name'] === this.componentAndHistoryArray[0].part['name']) || {} as IGenericEntity;
                            aircraftComponentRequest.partUri = part._links.self.href;

                            // aircraftComponentRequest.created = this.componentAndHistoryArray[0].created;
                            // aircraftComponentRequest.modified = this.componentAndHistoryArray[0].modified;
                        }
                        console.log('this.componentAndHistoryArray.length', this.componentAndHistoryArray.length);
                        this.componentAndHistoryArray.shift(); // remove element index 0
                        console.log('this.componentAndHistoryArray.length', this.componentAndHistoryArray.length);
                        console.log('this.componentAndHistoryArray', this.componentAndHistoryArray);
                        aircraftComponentRequest.historyRequestSet = new Array<AircraftComponentRequest.Historyrequest>();
                        this.componentAndHistoryArray.forEach(componentAndHistory => {
                            let aircraftComponentHistoryRequest: AircraftComponentRequest.Historyrequest = {} as AircraftComponentRequest.Historyrequest;
                            // If the history record has a link and is the same as the actaul component, set it to null
                            // aircraftComponentHistoryRequest.historyUri =
                            //     componentAndHistory._links && componentAndHistory._links.self.href === aircraftComponentRequest.componentUri ? null : componentAndHistory._links.self.href;
                            if (componentAndHistory._links) {
                                console.log('componentAndHistory._links.self.href', componentAndHistory._links.self.href)
                                console.log('aircraftComponentRequest.componentUri', aircraftComponentRequest.componentUri)
                                console.log('this.tempAircraftComponentHistorySelfHrefPrefix', this.tempAircraftComponentHistorySelfHrefPrefix)
                                if (componentAndHistory._links.self.href === aircraftComponentRequest.componentUri) {
                                    aircraftComponentHistoryRequest.historyUri = '';
                                } else if (componentAndHistory._links.self.href.startsWith(this.tempAircraftComponentHistorySelfHrefPrefix)) {
                                    aircraftComponentHistoryRequest.historyUri = '';
                                } else {
                                    aircraftComponentHistoryRequest.historyUri = componentAndHistory._links.self.href
                                }
                            }
                            aircraftComponentHistoryRequest.name = componentAndHistory.name;
                            aircraftComponentHistoryRequest.description = componentAndHistory.description;
                            aircraftComponentHistoryRequest.workPerformed = componentAndHistory.workPerformed;
                            aircraftComponentHistoryRequest.datePerformed = componentAndHistory.datePerformed;
                            aircraftComponentHistoryRequest.hoursPerformed = componentAndHistory.hoursPerformed;
                            aircraftComponentHistoryRequest.dateDue = componentAndHistory.dateDue;
                            aircraftComponentHistoryRequest.hoursDue = componentAndHistory.hoursDue;

                            //aircraftComponentHistoryRequest.partUri = this.partRowArray.find(part => part['name'] === componentAndHistory.part['name'])._links.self.href;
                            const part = this.partRowArray.find(part => part['name'] === componentAndHistory.part['name']) || {} as IGenericEntity;
                            aircraftComponentHistoryRequest.partUri = part._links.self.href;

                            //aircraftComponentHistoryRequest.created = componentAndHistory.created;
                            //aircraftComponentHistoryRequest.modified = componentAndHistory.modified;
                            console.log('aircraftComponentHistoryRequest', aircraftComponentHistoryRequest)
                            aircraftComponentRequest.historyRequestSet.push(aircraftComponentHistoryRequest);
                        });
                        console.log('aircraftComponentRequest', aircraftComponentRequest);
                        this.aircraftComponentService.modifyComponentAndHistory(aircraftComponentRequest).subscribe({
                            next: savedRow => {
                                console.log('saved component and history rows');
                            },
                            error: error => {
                                console.error('enericEntityService.deleteGenericEntity returned error: ', error);
                                //this.messageService.error(error);
                            },
                            complete: () => {
                                this.afterCrud();
                            }
                        });
                        break;
                    default:
                        console.error('this.componentHistoryCrudMode is invalid. this.componentHistoryCrudMode: ' + this.componentHistoryCrudMode);
                }
                this.enableFormControls(false);
                break;
            case CrudEnum.DELETE:
                this.aircraftComponentService.deleteComponent(this.selectedComponentRow._links.self.href, this.componentForm.controls['deleteHistoryRecords'].value).subscribe({
                    next: savedRow => {
                        console.log('deleted row', this.selectedComponentRow);
                    },
                    error: error => {
                        console.error('enericEntityService.deleteGenericEntity returned error: ', error);
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

    onCancelAndCloseDialog() {
        console.log('In onCancelAndCloseDialog');
        this.resetDialoForm();
        this.sessionService.setDisableParentMessages(false)
        this.modifyAndDeleteButtonsDisable = true;
    }
    onCancelComponentUpdateCrud() {
        console.log('In onCancelComponentUpdateCrud');
        // Restore original copy
        console.log('selectedComponentAndHistoryRowCopy', this.selectedComponentAndHistoryRowCopy);
        this.updateDialogComponent(this.selectedComponentAndHistoryRowCopy);
        this.componentHistoryCrudMode = null;
        this.enableFormControls(false);
    }

    filterParts(event: { query: string; }) {
        this.filteredParts = [];
        for (let i = 0; i < this.partRowArray.length; i++) {
            let name = this.partRowArray[i]['name'];
            // if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            if (name.toLowerCase().startsWith(event.query.toLowerCase())) {
                this.filteredParts.push(this.partRowArray[i]);
            }
        }
    }
    private afterCrud() {
        // this.fetchPage(this.savedLazyLoadEvent.first || 0, this.savedLazyLoadEvent.rows || 0,
        //     ComponentHelper.buildSearchString(this.savedLazyLoadEvent, ['name', 'description', 'part.name', 'workPerformed', 'datePerformed', 'hoursPerformed', 'dateDue', 'hoursDue']),
        //     this.SORT_COLUMNS);
        this.sessionService.setDisableParentMessages(false)
        // this.fetchPage(this.savedLazyLoadEvent.first || 0, this.savedLazyLoadEvent.rows || 0, '',
        //     this.SORT_COLUMNS);
        this.fetchPage(this.savedLazyLoadEvent);
    }

    private resetDialoForm() {
        this.componentForm.reset();
        this.displayDialog = false;
        this.selectedComponentRow = <AircraftComponent>{};
    }

    private enableFormControls(enable: boolean) {
        if (enable) {
            this.componentForm.controls['name'].enable();
            this.componentForm.controls['description'].enable();
            this.componentForm.controls['part'].enable();
            this.componentForm.controls['workPerformed'].enable();
            this.componentForm.controls['datePerformed'].enable();
            this.componentForm.controls['hoursPerformed'].enable();
            this.componentForm.controls['dateDue'].enable();
            this.componentForm.controls['hoursDue'].enable();
        } else {
            this.componentForm.controls['name'].disable();
            this.componentForm.controls['description'].disable();
            this.componentForm.controls['part'].disable();
            this.componentForm.controls['workPerformed'].disable();
            this.componentForm.controls['datePerformed'].disable();
            this.componentForm.controls['hoursPerformed'].disable();
            this.componentForm.controls['dateDue'].disable();
            this.componentForm.controls['hoursDue'].disable();
        }
    }

    private sortComponentAndHistoryArray() {
        // sort by datePerformed descending
        this.componentAndHistoryArray.sort((n1, n2): number => {
            if (n1.datePerformed < n2.datePerformed) return -1;
            if (n1.datePerformed > n2.datePerformed) return 1;
            return 0;
        });
        this.componentAndHistoryArray.reverse();
        this.componentAndHistoryArray.forEach(componentAndHistory => console.log('componentAndHistory array', componentAndHistory));
    }
}
