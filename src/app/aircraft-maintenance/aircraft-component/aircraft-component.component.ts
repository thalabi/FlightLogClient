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
import { ComponentRequest } from '../../domain/component-request';

@Component({
    selector: 'app-aircraft-component',
    templateUrl: './aircraft-component.component.html',
    styleUrls: ['./aircraft-component.component.css']
})
export class AircraftComponentComponent implements OnInit {

    componentForm: FormGroup;
    hasWritePermission: boolean = false;
    readonly COMPONENT_TABLE_NAME: string = 'component';
    readonly PART_TABLE_NAME: string = 'part';
    readonly SORT_COLUMNS: Array<string> = ['name'];

    partRowArray: Array<IGenericEntity>;
    selectedPartRow: IGenericEntity;

    componentRowArray: Array<AircraftComponent>;
    selectedRow: AircraftComponent;
    componentRow: AircraftComponent;


    loadingFlag: boolean;
    page: HalResponsePage;

    displayDialog: boolean;

    crudMode: CrudEnum;
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

        // test
        //this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '', this.SORT_COLUMNS);


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
            createHistoryRecord: new FormControl(),
            deleteHistoryRecords: new FormControl()
        });
    }

    private fetchPartTable() {
        // Get all rows of part table
        this.genericEntityService.getAssociationGenericEntity(this.PART_TABLE_NAME, null).subscribe({
            next: rowResponse => {
                //this.availableStudents = students;
                console.log('rowResponse: ', rowResponse);
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
        this.selectedRow = null; // unselect row
        this.resetDialoForm();

        this.aircraftComponentService.findAll(this.COMPONENT_TABLE_NAME, firstRowNumber, rowsPerPage, searchString, queryOrderByColumns)
        .subscribe({
            next: rowResponse => {
                console.log('rowResponse', rowResponse);
                this.page = rowResponse.page;
                if (rowResponse._embedded) {
                    this.firstRowOfTable = this.page.number * this.ROWS_PER_PAGE;
                    this.componentRowArray = rowResponse._embedded[this.COMPONENT_TABLE_NAME+'s'];
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
        console.log(event);
        this.componentRow = Object.assign({}, this.selectedRow);
        this.modifyAndDeleteButtonsDisable = false;
        this.componentRow.datePerformed = new Date(this.componentRow.datePerformed+'T00:00:00');
        if (this.componentRow.dateDue) {
            this.componentRow.dateDue = new Date(this.componentRow.dateDue+'T00:00:00');
        }
        console.log('this.componentRow: %o', this.componentRow);
        this.selectedPartRow = this.partRowArray.find(part => part.name === this.componentRow.part.name);
        console.log('this.selectedPartRow: %o', this.selectedPartRow);
    }

    onRowUnselect(event) {
        // console.log(event);
        // this.modifyAndDeleteButtonsDisable = true;
        //this.selectedRow = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }

    showDialog(crudMode: CrudEnum) {
        this.displayDialog = true;
        this.crudMode = crudMode;
        console.log('this.crudMode', this.crudMode);
        switch (this.crudMode) {
        case CrudEnum.ADD:
            this.enableFormControls(true);
            // this.componentFormFields.forEach(fieldAttributes => {
            //     let control: AbstractControl = this.componentForm.controls[fieldAttributes.columnName];
            //     ComponentHelper.initControlValues(control, fieldAttributes.dataType, true);
            //     control.enable();
            // });
            break;
        case CrudEnum.UPDATE:
            this.componentForm.controls.name.patchValue(this.componentRow.name);
            this.componentForm.controls.description.patchValue(this.componentRow.description);
            this.componentForm.controls.part.patchValue(this.selectedPartRow);
            this.componentForm.controls.workPerformed.patchValue(this.componentRow.workPerformed);
            this.componentForm.controls.datePerformed.patchValue(this.componentRow.datePerformed);
            this.componentForm.controls.hoursPerformed.patchValue(this.componentRow.hoursPerformed);
            this.componentForm.controls.dateDue.patchValue(this.componentRow.dateDue);
            this.componentForm.controls.hoursDue.patchValue(this.componentRow.hoursDue);
            this.componentForm.controls.createHistoryRecord.patchValue(true);
            this.enableFormControls(true);
            // this.componentFormFields.forEach(fieldAttributes => {
            //     let control: AbstractControl = this.componentForm.controls[fieldAttributes.columnName];
            //     if (fieldAttributes.columnName === 'part') {
            //         control.patchValue(this.selectedAssociatedPartRow);
            //     } else {
            //         console.log('his.componentRow[fieldAttributes.columnName]: ', this.componentRow[fieldAttributes.columnName]);
            //         control.patchValue(this.componentRow[fieldAttributes.columnName]);
            //     }
            //     control.enable();
            // });
            // console.log('this.componentFormFields: %o', this.componentFormFields);
            break;
        case CrudEnum.DELETE:
            this.componentForm.controls.name.patchValue(this.componentRow.name);
            this.componentForm.controls.description.patchValue(this.componentRow.description);
            this.componentForm.controls.part.patchValue(this.selectedPartRow);
            this.componentForm.controls.workPerformed.patchValue(this.componentRow.workPerformed);
            this.componentForm.controls.datePerformed.patchValue(this.componentRow.datePerformed);
            this.componentForm.controls.hoursPerformed.patchValue(this.componentRow.hoursPerformed);
            this.componentForm.controls.dateDue.patchValue(this.componentRow.dateDue);
            this.componentForm.controls.hoursDue.patchValue(this.componentRow.hoursDue);
            this.componentForm.controls.deleteHistoryRecords.patchValue(false);
            this.enableFormControls(false);
            // this.componentFormFields.forEach(fieldAttributes => {
            //     let control: AbstractControl = this.componentForm.controls[fieldAttributes.columnName];
            //     control.patchValue(this.componentRow[fieldAttributes.columnName]);
            //     control.disable();
            // });
            break;
        default:
            console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
        console.log('this.crudForm', this.componentForm);
    }

    onSubmit() {
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
                componentRequest.componentUri = this.selectedRow._links.component.href;
                componentRequest.name = this.componentForm.controls.name.value;
                componentRequest.description = this.componentForm.controls.description.value;
                componentRequest.workPerformed = this.componentForm.controls.workPerformed.value;
                componentRequest.datePerformed = this.componentForm.controls.datePerformed.value;
                componentRequest.hoursPerformed = this.componentForm.controls.hoursPerformed.value;
                componentRequest.dateDue = this.componentForm.controls.dateDue.value;
                componentRequest.hoursDue = this.componentForm.controls.hoursDue.value;
                componentRequest.partUri = this.componentForm.controls.part.value._links.part.href;
                console.log('this.componentForm.controls.createHistoryRecord.value', this.componentForm.controls.createHistoryRecord.value);
                componentRequest.createHistoryRecord = this.componentForm.controls.createHistoryRecord.value;
                componentRequest.created = this.selectedRow.created;
                componentRequest.modified = new Date();
                console.log("engineComponent: %o", componentRequest);
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
                this.aircraftComponentService.deleteComponent(this.selectedRow._links.component.href, this.componentForm.controls.deleteHistoryRecords.value).subscribe({
                    next: savedRow => {
                        console.log('deleted row', this.selectedRow);
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

    onCancel() {
        this.resetDialoForm();
        this.modifyAndDeleteButtonsDisable = true;
    }

    private afterCrud() {
        this.fetchPage(this.savedLazyLoadEvent.first, this.savedLazyLoadEvent.rows,
            ComponentHelper.buildSearchString(this.savedLazyLoadEvent, ['name', 'description', 'part.name', 'workPerformed', 'datePerformed', 'hoursPerformed', 'dateDue', 'hoursDue']),
            this.SORT_COLUMNS);
    }

    private resetDialoForm() {
        this.componentForm.reset();
        this.displayDialog = false;
        this.selectedRow = <AircraftComponent>{};
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

}
