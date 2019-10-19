import { Component, OnInit } from '@angular/core';
import { GenericEntityService } from '../../service/generic-entity.service';
import { AircraftComponentService } from '../../service/aircraft-component.service';
import { MyMessageService } from '../../message/mymessage.service';
import { SessionDataService } from '../../service/session-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { Constant } from '../../constant';
import { IGenericEntity } from '../../domain/i-gerneric-entity';
import { ComponentHelper } from '../../util/ComponentHelper';
import { AircraftComponent } from '../../domain/aircraft-component';
import { HalResponsePage } from '../../hal/hal-response-page';
import { LazyLoadEvent } from 'primeng/primeng';
import { HalResponseLinks } from '../../hal/hal-response-links';
import { CustomErrorHandler } from '../../custom-error-handler';
import { CrudEnum } from '../../crud-enum';
import { ComponentRequestOld } from '../../domain/component-request-old';
import { AircraftComponentRequest } from '../../domain/aircraft-component-request';

@Component({
    selector: 'app-aircraft-component',
    templateUrl: './aircraft-component2.component.html',
    styleUrls: ['./aircraft-component2.component.css']
})
export class AircraftComponent2Component implements OnInit {

    componentForm: FormGroup;
    hasWritePermission: boolean = false;
    readonly COMPONENT_TABLE_NAME: string = 'component';
    readonly PART_TABLE_NAME: string = 'part';
    readonly SORT_COLUMNS: Array<string> = ['name'];

    partRowArray: Array<IGenericEntity>;
    selectedPartRow: IGenericEntity;

    componentRowArray: Array<AircraftComponent>;
    selectedComponentRow: AircraftComponent;
    selectedComponentRowCopy: AircraftComponent;
    selectedComponentAndHistoryRow: AircraftComponent;
    selectedComponentAndHistoryRowCopy: AircraftComponent;

    componentAndHistoryArray : Array<AircraftComponent>;


    loadingFlag: boolean;
    page: HalResponsePage;

    displayDialog: boolean;

    crudMode: CrudEnum;
    componentHistoryCrudMode: CrudEnum;
    historyCrudMode: CrudEnum;
    crudEnum = CrudEnum; // Used in html to refere to enum
    modifyAndDeleteButtonsDisable: boolean = true;

    // used to pass as argument to getTableRowsLazy() when refreshing page after add/update/delete
    savedLazyLoadEvent: LazyLoadEvent;
    readonly ROWS_PER_PAGE: number = 10; // default rows per page
    firstRowOfTable: number; // triggers a page change, zero based. 0 -> first page, 1 -> second page, ...
    pageNumber: number;
    links: HalResponseLinks;


    constructor(private genericEntityService: GenericEntityService, private aircraftComponentService: AircraftComponentService, private messageService: MyMessageService,
    private sessionDataService: SessionDataService) { }

    ngOnInit() {
        this.messageService.clear();
        this.componentRowArray = [];
        this.page = new HalResponsePage();
        this.createForm();
        this.fetchPartTable();

        this.hasWritePermission = MenuComponent.isHolderOfAnyAuthority(
            this.sessionDataService.user, Constant.entityToWritePermissionMap.get(this.COMPONENT_TABLE_NAME));
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
            deleteHistoryRecords: new FormControl()
        });
    }

    private fetchPartTable() {
        // Get all rows of part table
        this.genericEntityService.getAssociationGenericEntity(this.PART_TABLE_NAME, null).subscribe({
            next: rowResponse => {
                console.log('part rowResponse: ', rowResponse);
                if (rowResponse._embedded) {
                    this.partRowArray = rowResponse._embedded[this.PART_TABLE_NAME+'s'];
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
        this.fetchPage(lazyLoadEvent.first, lazyLoadEvent.rows,
            ComponentHelper.buildSearchString(lazyLoadEvent, ['name', 'description', 'part.name', 'workPerformed', 'datePerformed', 'hoursPerformed', 'dateDue', 'hoursDue']), this.SORT_COLUMNS);
    }


    fetchPage(firstRowNumber: number, rowsPerPage: number, searchString: string, queryOrderByColumns: string[]) {
        console.log("in fetchPage");
        this.loadingFlag = true;
        this.modifyAndDeleteButtonsDisable = true;
        this.selectedComponentRow = null; // unselect row
        this.resetDialoForm();

        this.aircraftComponentService.findAll(this.COMPONENT_TABLE_NAME, firstRowNumber, rowsPerPage, searchString, queryOrderByColumns)
        .subscribe({
            next: rowResponse => {
                console.log('component rowResponse', rowResponse);
                this.page = rowResponse.page;
                if (rowResponse._embedded) {
                    this.firstRowOfTable = this.page.number * this.ROWS_PER_PAGE;
                    this.componentRowArray = rowResponse._embedded[this.COMPONENT_TABLE_NAME+'s'];
                    // convert date strings to date objects

                    this.componentRowArray.forEach(componentRow => {
                        componentRow.datePerformed = componentRow.datePerformed ? new Date(componentRow.datePerformed) : null;
                        componentRow.dateDue = componentRow.dateDue ? new Date(componentRow.dateDue) :  null;
                        componentRow.created = componentRow.created ? new Date(componentRow.created) :  null;
                        componentRow.modified = componentRow.modified ? new Date(componentRow.modified) :  null;
                        componentRow.componentHistorySet.forEach(componentHistory => {
                            componentHistory.datePerformed = componentHistory.datePerformed ? new Date(componentHistory.datePerformed) : null;
                            componentHistory.dateDue = componentHistory.dateDue ? new Date(componentHistory.dateDue) :  null;
                            componentHistory.created = componentHistory.created ? new Date(componentHistory.created) :  null;
                            componentHistory.modified = componentHistory.modified ? new Date(componentHistory.modified) :  null;
                            });
                    });
                    
                    // this.rowArray = this.transformAttributes(this.rowArray);
                } else {
                    this.firstRowOfTable = 0;
                    this.componentRowArray = [];
                }
                
                // this.firstRowOfTable = page.number * this.ROWS_PER_PAGE;
                // this.rowArray = page.totalElements ? rowResponse._embedded[this.tableName+'s'] : [];
                // console.log('this.rowArray', this.rowArray);
                this.links = rowResponse._links;
        },
        complete: () => {
            this.loadingFlag = false;
        },
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
        }});
    }

    onGoToPage() {
        console.log('this.pageNumber', this.pageNumber);
        // TODO this might be redundant since it is set in fetchPage
        this.firstRowOfTable = (this.pageNumber - 1) * this.ROWS_PER_PAGE;
        this.savedLazyLoadEvent.first = this.firstRowOfTable;
        this.onLazyLoad(this.savedLazyLoadEvent);
        this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '', this.SORT_COLUMNS);
        this.pageNumber = null;
    }

    onRowSelect(event) {
        console.log('onRowSelect, event', event);
        // Make a copy of selectedComponentRow
        this.selectedComponentRowCopy = Object.assign({}, this.selectedComponentRow);
        console.log('selectedComponentRow', this.selectedComponentRow);
        console.log('selectedComponentRowCopy', this.selectedComponentRowCopy);
        this.modifyAndDeleteButtonsDisable = false;

        // Create componentAndHistoryArray which contains the selected component and its history
        this.componentAndHistoryArray = [];
        let selectedComponent : AircraftComponent = new AircraftComponent();
        
        selectedComponent._links = this.selectedComponentRowCopy._links;
        selectedComponent.name = this.selectedComponentRowCopy.name;
        selectedComponent.description = this.selectedComponentRowCopy.description;
        selectedComponent.part = this.selectedComponentRowCopy.part;
        selectedComponent.datePerformed = this.selectedComponentRowCopy.datePerformed;
        selectedComponent.workPerformed = this.selectedComponentRowCopy.workPerformed;
        selectedComponent.hoursPerformed = this.selectedComponentRowCopy.hoursPerformed;
        selectedComponent.hoursDue = this.selectedComponentRowCopy.hoursDue;
        selectedComponent.dateDue = this.selectedComponentRowCopy.dateDue;
        selectedComponent.created = this.selectedComponentRowCopy.created;
        selectedComponent.modified = this.selectedComponentRowCopy.modified;
        console.log('pushing selectedComponent', selectedComponent);
        this.componentAndHistoryArray.push(selectedComponent);
        
        this.selectedComponentRowCopy.componentHistorySet.forEach(componentHistory => {
            let selectedComponentHistory : AircraftComponent = new AircraftComponent();
            selectedComponentHistory._links = componentHistory._links;
            selectedComponentHistory.name = componentHistory.name;
            selectedComponentHistory.description = componentHistory.description;
            selectedComponentHistory.part = componentHistory.part;
            selectedComponentHistory.datePerformed = componentHistory.datePerformed;
            selectedComponentHistory.workPerformed = componentHistory.workPerformed;
            selectedComponentHistory.hoursPerformed = componentHistory.hoursPerformed;
            selectedComponentHistory.hoursDue = componentHistory.hoursDue;
            selectedComponentHistory.dateDue = componentHistory.dateDue;
            selectedComponentHistory.created = componentHistory.created;
            selectedComponentHistory.modified = componentHistory.modified;
            console.log('pushing selectedComponentHistory', selectedComponentHistory);
            this.componentAndHistoryArray.push(selectedComponentHistory);
        });

        console.log('componentAndHistoryArray: %o', this.componentAndHistoryArray);
        // this will highlight the first row in table
        this.selectedComponentAndHistoryRow = selectedComponent;
        // make a copy of the selected row
        this.selectedComponentAndHistoryRowCopy = Object.assign({}, this.selectedComponentAndHistoryRow);
    }

    onRowUnselect(event) {
        console.log('onRowUnselect, event', event);
        this.modifyAndDeleteButtonsDisable = true;
        //this.selectedRow = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }

    onComponentAndHistoryRowSelect(event) {
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
    componentAndHistoryTableVisible : boolean = true;
    onComponentAndHistoryRowUnselect(event) {
        console.log('onComponentAndHistoryRowUnselect', event);
        // Set onComponentAndHistoryRowSelect back to its value to prevent Row Unselect
        this.selectedComponentAndHistoryRow = event.data;
        // Turn off and on componentAndHistoryTableVisible to make componentAndHistory refresh showing the selected row
        this.componentAndHistoryTableVisible = false;
        setTimeout(() => this.componentAndHistoryTableVisible = true, 0);
        
    }

    showDialog(crudMode: CrudEnum) {
        this.displayDialog = true;
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
            this.componentForm.controls.deleteHistoryRecords.patchValue(false);
            this.enableFormControls(false);
            break;
        default:
            console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
        console.log('this.crudForm', this.componentForm);
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

    private updateDialogComponent(selectedComponent : AircraftComponent) {
        console.log('begin updateDialogComponent');
        this.componentForm.controls.name.patchValue(selectedComponent.name);
        this.componentForm.controls.description.patchValue(selectedComponent.description);
        this.componentForm.controls.part.patchValue(this.partRowArray.find(part => part.name === selectedComponent.part.name));
        this.componentForm.controls.workPerformed.patchValue(selectedComponent.workPerformed);
        this.componentForm.controls.datePerformed.patchValue(selectedComponent.datePerformed);
        this.componentForm.controls.hoursPerformed.patchValue(selectedComponent.hoursPerformed);
        this.componentForm.controls.dateDue.patchValue(selectedComponent.dateDue);
        this.componentForm.controls.hoursDue.patchValue(selectedComponent.hoursDue);
        //this.componentForm.controls.deleteHistoryRecords.patchValue(false);
        console.log('end updateDialogComponent');
    }
    private clearDialogComponent() {
        this.componentForm.controls.name.reset();
        this.componentForm.controls.description.reset();
        this.componentForm.controls.part.reset();
        this.componentForm.controls.workPerformed.reset();
        this.componentForm.controls.datePerformed.reset();
        this.componentForm.controls.hoursPerformed.reset();
        this.componentForm.controls.dateDue.reset();
        this.componentForm.controls.hoursDue.reset();
    }

    onSubmit() {
        console.log('this.crudMode', this.crudMode);
        console.log('this.componentHistoryCrudMode', this.componentHistoryCrudMode);

        let componentRequest: ComponentRequestOld = new ComponentRequestOld(); // TODO remove and use below
        let aircraftComponentRequest : AircraftComponentRequest.Component = new AircraftComponentRequest.Component();
        switch (this.crudMode) {
            case CrudEnum.ADD:
                componentRequest.name = this.componentForm.controls.name.value;
                componentRequest.description = this.componentForm.controls.description.value;
                componentRequest.workPerformed = this.componentForm.controls.workPerformed.value;
                componentRequest.datePerformed = this.componentForm.controls.datePerformed.value;
                componentRequest.hoursPerformed = this.componentForm.controls.hoursPerformed.value;
                componentRequest.dateDue = this.componentForm.controls.dateDue.value;
                componentRequest.hoursDue = this.componentForm.controls.hoursDue.value;
                componentRequest.partUri = this.componentForm.controls.part.value._links.part.href;
                componentRequest.created = new Date();
                componentRequest.modified = new Date();
                console.log("engineComponent: %o", componentRequest);
                this.aircraftComponentService.addComponent(componentRequest).subscribe({
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
                let component: AircraftComponent = new AircraftComponent();
                switch (this.componentHistoryCrudMode) {
                    case CrudEnum.ADD: // Add component history record to history array
                        component.name = this.componentForm.controls.name.value;
                        component.description = this.componentForm.controls.description.value;
                        component.workPerformed = this.componentForm.controls.workPerformed.value;
                        component.datePerformed = this.componentForm.controls.datePerformed.value;
                        component.hoursPerformed = this.componentForm.controls.hoursPerformed.value;
                        component.dateDue = this.componentForm.controls.dateDue.value;
                        component.hoursDue = this.componentForm.controls.hoursDue.value;
                        //component.partUri = this.componentForm.controls.part.value._links.part.href;
                        component.part = this.componentForm.controls.part.value;
                        component.created = new Date();
                        component.modified = new Date();
                        console.log("component: %o", component);
                        console.log('this.componentAndHistoryArray', this.componentAndHistoryArray);
                        this.componentAndHistoryArray.push(component);
                        this.sortComponentAndHistoryArray();
                        console.log('this.componentAndHistoryArray', this.componentAndHistoryArray);
                        this.componentHistoryCrudMode = null;
                        break;
                    case CrudEnum.UPDATE: // Update component history record in history array
                        // Find the selected component in the componentAndHistoryArray and update it
                        let aircraftComponentToUpdate = this.componentAndHistoryArray.find(aircraftComponent =>
                            aircraftComponent._links.self.href === this.selectedComponentAndHistoryRow._links.self.href);
                        console.log(aircraftComponentToUpdate);
                        aircraftComponentToUpdate.name = this.componentForm.controls.name.value;
                        aircraftComponentToUpdate.description = this.componentForm.controls.description.value;
                        aircraftComponentToUpdate.workPerformed = this.componentForm.controls.workPerformed.value;
                        aircraftComponentToUpdate.datePerformed = this.componentForm.controls.datePerformed.value;
                        aircraftComponentToUpdate.hoursPerformed = this.componentForm.controls.hoursPerformed.value;
                        aircraftComponentToUpdate.dateDue = this.componentForm.controls.dateDue.value;
                        aircraftComponentToUpdate.hoursDue = this.componentForm.controls.hoursDue.value;
                        aircraftComponentToUpdate.part = this.componentForm.controls.part.value;
                        aircraftComponentToUpdate.modified = component.modified = new Date();
                        console.log('aircraftComponentToUpdate', aircraftComponentToUpdate);
                        this.sortComponentAndHistoryArray();
                        this.componentHistoryCrudMode = null;
                        break;
                    case CrudEnum.DELETE: // Delete component history record from history array
                        // Find the selected component in the componentAndHistoryArray and delete it
                        let indexOfAircraftComponentToDelete : number = this.componentAndHistoryArray
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
                            aircraftComponentRequest.partUri = this.partRowArray.find(part => part.name === this.componentAndHistoryArray[0].part.name)._links.self.href;
                            aircraftComponentRequest.created = this.componentAndHistoryArray[0].created;
                            aircraftComponentRequest.modified = this.componentAndHistoryArray[0].modified;
                        }
                        console.log('this.componentAndHistoryArray.length', this.componentAndHistoryArray.length);
                        this.componentAndHistoryArray.shift(); // remove element index 0
                        console.log('this.componentAndHistoryArray.length', this.componentAndHistoryArray.length);
                        console.log('this.componentAndHistoryArray', this.componentAndHistoryArray);
                        aircraftComponentRequest.historyRequestSet = new Array<AircraftComponentRequest.Historyrequest>();
                        this.componentAndHistoryArray.forEach(componentAndHistory => {
                            let aircraftComponentHistoryRequest : AircraftComponentRequest.Historyrequest = new AircraftComponentRequest.Historyrequest();
                            // If the history record has a link and that it is not the same as the actaul component,
                            // set the historyUri
                            aircraftComponentHistoryRequest.historyUri =
                                componentAndHistory._links && componentAndHistory._links.self.href !== aircraftComponentRequest.componentUri ? componentAndHistory._links.self.href : null;
                            aircraftComponentHistoryRequest.name = componentAndHistory.name;
                            aircraftComponentHistoryRequest.description = componentAndHistory.description;
                            aircraftComponentHistoryRequest.workPerformed = componentAndHistory.workPerformed;
                            aircraftComponentHistoryRequest.datePerformed = componentAndHistory.datePerformed;
                            aircraftComponentHistoryRequest.hoursPerformed = componentAndHistory.hoursPerformed;
                            aircraftComponentHistoryRequest.dateDue = componentAndHistory.dateDue;
                            aircraftComponentHistoryRequest.hoursDue = componentAndHistory.hoursDue;
                            aircraftComponentHistoryRequest.partUri =
                                this.partRowArray.find(part => part.name === componentAndHistory.part.name)._links.self.href;
                            aircraftComponentHistoryRequest.created = componentAndHistory.created;
                            aircraftComponentHistoryRequest.modified = componentAndHistory.modified;
                            
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
                this.aircraftComponentService.deleteComponent(this.selectedComponentRow._links.self.href, this.componentForm.controls.deleteHistoryRecords.value).subscribe({
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
            /* test

        //const crudFormModel = this.componentForm.value;
        console.log('this.componentForm.controls', this.componentForm.controls);
        console.log('this.componentForm.value', this.componentForm.value);
        //console.log('crudFormModel', crudFormModel);
        //console.log('column1', this.crudForm.get('column1').value);
        let componentRequest: ComponentRequest = new ComponentRequest();
        switch (this.crudMode) {
            case CrudEnum.ADD:
                componentRequest.name = this.componentForm.controls.name.value;
                componentRequest.description = this.componentForm.controls.description.value;
                componentRequest.workPerformed = this.componentForm.controls.workPerformed.value;
                componentRequest.datePerformed = this.componentForm.controls.datePerformed.value;
                componentRequest.hoursPerformed = this.componentForm.controls.hoursPerformed.value;
                componentRequest.dateDue = this.componentForm.controls.dateDue.value;
                componentRequest.hoursDue = this.componentForm.controls.hoursDue.value;
                componentRequest.partUri = this.componentForm.controls.part.value._links.part.href;
                componentRequest.created = new Date();
                componentRequest.modified = new Date();
                console.log("engineComponent: %o", componentRequest);
                this.aircraftComponentService.addComponent(componentRequest).subscribe({
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
                componentRequest.componentUri = this.selectedComponentRow._links.component.href;
                componentRequest.name = this.componentForm.controls.name.value;
                componentRequest.description = this.componentForm.controls.description.value;
                componentRequest.workPerformed = this.componentForm.controls.workPerformed.value;
                componentRequest.datePerformed = this.componentForm.controls.datePerformed.value;
                componentRequest.hoursPerformed = this.componentForm.controls.hoursPerformed.value;
                componentRequest.dateDue = this.componentForm.controls.dateDue.value;
                componentRequest.hoursDue = this.componentForm.controls.hoursDue.value;
                componentRequest.partUri = this.componentForm.controls.part.value._links.part.href;
                // console.log('this.componentForm.controls.createHistoryRecord.value', this.componentForm.controls.createHistoryRecord.value);
                componentRequest.createHistoryRecord = false;//this.componentForm.controls.createHistoryRecord.value;
                componentRequest.created = this.selectedComponentRow.created;
                componentRequest.modified = new Date();
                console.log("componentRequest: %o", componentRequest);
                this.aircraftComponentService.modifyComponent(componentRequest).subscribe({
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


            case CrudEnum.DELETE:
                this.aircraftComponentService.deleteComponent(this.selectedComponentRow._links.component.href, this.componentForm.controls.deleteHistoryRecords.value).subscribe({
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
        test */
        //this.afterCrud();
    }

    onCancelAndCloseDialog() {
        console.log('In onCancelAndCloseDialog');
        this.resetDialoForm();
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

    private afterCrud() {
        this.fetchPage(this.savedLazyLoadEvent.first, this.savedLazyLoadEvent.rows,
            ComponentHelper.buildSearchString(this.savedLazyLoadEvent, ['name', 'description', 'part.name', 'workPerformed', 'datePerformed', 'hoursPerformed', 'dateDue', 'hoursDue']),
            this.SORT_COLUMNS);
    }

    private resetDialoForm() {
        this.componentForm.reset();
        this.displayDialog = false;
        this.selectedComponentRow = <AircraftComponent>{};
    }

    private enableFormControls(enable: boolean) {
        if (enable) {
            this.componentForm.controls.name.enable();
            this.componentForm.controls.description.enable();
            this.componentForm.controls.part.enable();
            this.componentForm.controls.workPerformed.enable();
            this.componentForm.controls.datePerformed.enable();
            this.componentForm.controls.hoursPerformed.enable();
            this.componentForm.controls.dateDue.enable();
            this.componentForm.controls.hoursDue.enable();
        } else {
            this.componentForm.controls.name.disable();
            this.componentForm.controls.description.disable();
            this.componentForm.controls.part.disable();
            this.componentForm.controls.workPerformed.disable();
            this.componentForm.controls.datePerformed.disable();
            this.componentForm.controls.hoursPerformed.disable();
            this.componentForm.controls.dateDue.disable();
            this.componentForm.controls.hoursDue.disable();
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
