import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { CrudEnum } from '../crud-enum';
import { CrudComponentConfig } from '../config/crud-component-config';
import { AssociationAttributes } from "../config/AssociationAttributes";
import { FormAttributes } from "../config/FormAttributes";
import { DataTypeEnum } from "../config/DataTypeEnum";
import { FieldAttributes } from "../config/FieldAttributes";
import { UiComponentEnum } from "../config/UiComponentEnum";
import { HalResponseLinks } from '../hal/hal-response-links';
import { HalResponsePage } from '../hal/hal-response-page';
import { ComponentHelper } from '../util/ComponentHelper';
import { GenericEntityService } from '../service/generic-entity.service';
import { MyMessageService } from '../message/mymessage.service';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { MenuComponent } from '../menu/menu.component';
import { Constant } from '../constant';
import { SessionService } from '../service/session.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedModule } from 'primeng/api';
import { PasswordMaskPipe } from '../util/password-mask-pipe';
import { TooltipModule } from 'primeng/tooltip';
import { PickListModule } from 'primeng/picklist';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NgStyle, TitleCasePipe, DatePipe, CommonModule } from '@angular/common';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { BackendStacktraceDisplayComponent } from '../backend-stacktrace-display/backend-stacktrace-display.component';
import { MessagesModule } from 'primeng/messages';

@Component({
    selector: 'app-generic-crud',
    templateUrl: './generic-crud.component.html',
    styleUrls: ['./generic-crud.component.css'],
    imports: [TableModule, SharedModule, NgStyle, ButtonModule, FormsModule, DialogModule, ReactiveFormsModule, CalendarModule, CheckboxModule, PickListModule, TooltipModule, TitleCasePipe, DatePipe, PasswordMaskPipe, MessagesModule, BackendStacktraceDisplayComponent, CommonModule]
})
export class GenericCrudComponent implements OnInit {

    rowArray: Array<IGenericEntity> = [];
    // Holds all rows of the associated table
    associationArray: Array<IGenericEntity> = [];
    // Holds rows of the associated table ['associationArray - selectedAssociationArray'
    availableAssociationArray: Array<IGenericEntity> = [];
    selectedRow!: IGenericEntity;
    // Holds rows associated with the selected rows
    selectedAssociationArray: Array<IGenericEntity> = [];
    crudRow!: IGenericEntity;
    //rowResponse: IGenericEntityResponse;
    row!: IGenericEntity;
    page: HalResponsePage = {} as HalResponsePage;
    links: HalResponseLinks = {} as HalResponseLinks;

    crudForm!: FormGroup;

    displayDialog!: boolean;

    crudMode!: CrudEnum;
    crudEnum = CrudEnum; // Used in html to refere to enum
    modifyAndDeleteButtonsDisable: boolean = true;

    formAttributes: FormAttributes = {} as FormAttributes;
    fieldAttributesArray: Array<FieldAttributes> = [];
    associationAttributesArray: Array<AssociationAttributes> = [];
    entityName!: string;
    tableName!: string;

    // used to pass as argument to getTableRowsLazy() when refreshing page after add/update/delete
    savedTableLazyLoadEvent!: TableLazyLoadEvent;

    readonly ROWS_PER_PAGE: number = 10; // default rows per page
    firstRowOfTable!: number; // triggers a page change, zero based. 0 -> first page, 1 -> second page, ...

    pageNumber!: number;

    counter: number = 0;

    loadingStatus!: boolean;

    uiComponentEnum = UiComponentEnum; // Used in html to refere to enum

    hasWritePermission: boolean = false;

    constructor(private formBuilder: FormBuilder, private genericEntityService: GenericEntityService, private route: ActivatedRoute, private messageService: MyMessageService, private sessionService: SessionService) {
    }

    ngOnInit() {
        this.messageService.clear();
        this.sessionService.clearBackendStackTrace()

        this.rowArray = [];
        this.page = {} as HalResponsePage;
        this.counter++;
        console.log("this.counter: ", this.counter);
        this.route.params.subscribe(params => {
            this.entityName = params['entityName'];
            console.log('this.entityName', this.entityName)

            this.formAttributes = CrudComponentConfig.formConfig.get(this.entityName) || {} as FormAttributes;
            this.fieldAttributesArray = this.formAttributes.fields;
            this.tableName = this.formAttributes.tableName
            this.associationAttributesArray = this.formAttributes.associations;
            console.log('this.formAttributes', this.formAttributes, 'this.associationAttributesArray', this.associationAttributesArray);

            console.log('entityName', this.entityName);
            this.createForm();
            console.log("after createForm");

            this.row = <IGenericEntity>{};

            this.fetchAssociations();

            // this.hasWritePermission = MenuComponent.isHolderOfAnyAuthority(
            //     this.sessionDataService.user || {} as User, Constant.entityToWritePermissionMap.get(this.tableName) || '')
            this.sessionService.userInfo$.subscribe(userInfo => {
                console.log('userInfo', userInfo)
                this.hasWritePermission = MenuComponent.isHolderOfAnyRole(userInfo, Constant.entityToWritePermissionMap.get(this.entityName) || '');
            });

        });
        // this.row = <IGenericEntity>{};
        // console.log("before fetchPage");
        // this.fetchPage(0, this.ROWS_PER_PAGE, '', this.formAttributes.queryOrderByColumns);

        // TODO testing only, this should be configurable
    }

    createForm() {
        this.crudForm = new FormGroup({});
        this.fieldAttributesArray.forEach(fieldAttributes => {
            if (fieldAttributes.mandatory) {
                this.crudForm.addControl(fieldAttributes.columnName, new FormControl('', Validators.required));
            } else {
                this.crudForm.addControl(fieldAttributes.columnName, new FormControl(''));
            }
        })
    }

    showDialog(crudMode: CrudEnum) {
        this.displayDialog = true;
        this.crudMode = crudMode;
        console.log('this.crudMode', this.crudMode);
        switch (this.crudMode) {
            case CrudEnum.ADD:
                this.fieldAttributesArray.forEach(fieldAttributes => {
                    let control: AbstractControl = this.crudForm.controls[fieldAttributes.columnName];
                    console.log('fieldAttributes.dataType', fieldAttributes.dataType);
                    ComponentHelper.initControlValues(control, fieldAttributes.dataType);
                    control.enable();
                });
                this.selectedAssociationArray = [];
                this.populateAvailableAssociationArray();
                break;
            case CrudEnum.UPDATE:
                this.fieldAttributesArray.forEach(fieldAttributes => {
                    let control: AbstractControl = this.crudForm.controls[fieldAttributes.columnName];
                    control.patchValue(this.crudRow[fieldAttributes.columnName]);
                    control.enable();
                });
                break;
            case CrudEnum.DELETE:
                this.fieldAttributesArray.forEach(fieldAttributes => {
                    let control: AbstractControl = this.crudForm.controls[fieldAttributes.columnName];
                    control.patchValue(this.crudRow[fieldAttributes.columnName]);
                    control.disable();
                });
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
        console.log('this.crudForm', this.crudForm);
    }

    onSubmit() {
        const crudFormModel = this.crudForm.value;
        console.log('this.crudForm.value', this.crudForm.value);
        console.log('crudFormModel', crudFormModel);
        //console.log('column1', this.crudForm.get('column1').value);
        switch (this.crudMode) {
            case CrudEnum.ADD:
                this.crudRow = <IGenericEntity>{};
                this.fieldAttributesArray.forEach(fieldAttributes => {
                    this.crudRow[fieldAttributes.columnName] = this.crudForm.controls[fieldAttributes.columnName].value;
                });
                this.setRowDateFields(this.crudRow, this.fieldAttributesArray);
                let addGenericEntityAndAssociation$: Observable<IGenericEntityResponse> = this.genericEntityService.addGenericEntity(this.entityName, this.crudRow).pipe(
                    concatMap((savedSingleGenericEntityResponse: IGenericEntityResponse) => {
                        if (this.formAttributes.associations && this.formAttributes.associations.length != 0) {
                            return this.genericEntityService.updateAssociationGenericEntity(savedSingleGenericEntityResponse, this.formAttributes.associations[0].associationPropertyName, this.selectedAssociationArray);
                        } else {
                            return of<IGenericEntityResponse>(savedSingleGenericEntityResponse);
                        }
                    }));
                addGenericEntityAndAssociation$.subscribe({
                    next: savedTwoColumnEntity => {
                        console.log('savedTwoColumnEntity', savedTwoColumnEntity);
                    },
                    error: error => {
                        console.error('genericEntityService.updateAssociationGenericEntity returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.UPDATE:
                this.fieldAttributesArray.forEach(fieldAttributes => {
                    this.crudRow[fieldAttributes.columnName] = this.crudForm.controls[fieldAttributes.columnName].value;
                });
                this.setRowDateFields(this.crudRow, this.fieldAttributesArray);

                let updateGenericEntityAndAssociation$: Observable<IGenericEntityResponse> = this.genericEntityService.updateGenericEntity(this.crudRow).pipe(
                    concatMap((savedSingleGenericEntityResponse: IGenericEntityResponse) => {
                        if (this.formAttributes.associations && this.formAttributes.associations.length != 0) {
                            return this.genericEntityService.updateAssociationGenericEntity(savedSingleGenericEntityResponse, this.formAttributes.associations[0].associationPropertyName, this.selectedAssociationArray);
                        } else {
                            return of<IGenericEntityResponse>(savedSingleGenericEntityResponse);
                        }
                    }));
                updateGenericEntityAndAssociation$.subscribe({
                    next: savedRow => {
                        console.log('savedRow', savedRow);
                    },
                    error: error => {
                        console.error('enericEntityService.updateAssociationGenericEntity returned error: ', error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.DELETE:
                this.genericEntityService.deleteGenericEntity(this.selectedRow).subscribe({
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

    private afterCrud() {
        this.displayDialog = false;
        this.modifyAndDeleteButtonsDisable = true;
        // this.fetchPage(this.savedTableLazyLoadEvent.first || 0, this.savedTableLazyLoadEvent.rows || 0,
        //     ComponentHelper.buildSearchString(this.savedTableLazyLoadEvent, this.formAttributes.fields.map(field => field.columnName)),
        //     this.formAttributes.queryOrderByColumns);
        this.resetDialoForm();
        this.onLazyLoad(this.savedTableLazyLoadEvent);
    }

    private resetDialoForm() {
        this.crudForm.reset();
        this.displayDialog = false;
        this.selectedRow = <IGenericEntity>{};
    }

    onCancel() {
        this.resetDialoForm();
        this.modifyAndDeleteButtonsDisable = true;
    }

    onLazyLoad(tableTableLazyLoadEvent: TableLazyLoadEvent) {
        this.savedTableLazyLoadEvent = tableTableLazyLoadEvent;
        console.log('event', tableTableLazyLoadEvent);
        console.log('event.first', tableTableLazyLoadEvent.first);
        console.log('event.rows', tableTableLazyLoadEvent.rows);
        console.log('event.filters', tableTableLazyLoadEvent.filters);
        this.fetchPage(tableTableLazyLoadEvent)
    }

    fetchPage(tableTableLazyLoadEvent: TableLazyLoadEvent) {
        console.log(tableTableLazyLoadEvent)
        this.loadingStatus = true
        const pageSize = tableTableLazyLoadEvent.rows ?? 20
        const pageNumber = (tableTableLazyLoadEvent.first ?? 0) / pageSize;
        const filters: any = tableTableLazyLoadEvent.filters
        console.log('filters', filters)
        console.log('pageNumber', pageNumber, 'pageSize', pageSize, 'filters', filters)
        let searchCriteria: string = ''
        if (filters) {
            console.log('Object.keys(filters)', Object.keys(filters))
            Object.keys(filters).forEach(columnName => {
                console.log('columeName', columnName, 'matchMode', filters[columnName][0].matchMode, 'value', filters[columnName][0].value)
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
        let sort: string[] = []
        if (tableTableLazyLoadEvent.sortField) {
            sort[0] = tableTableLazyLoadEvent.sortField + (tableTableLazyLoadEvent.sortOrder === -1 ? ',DESC' : '')
            sort[1] = 'id' // always add id colmun so that page results are consistant
            //console.log('sort', sort)
        }
        const entityNameResource = GenericEntityService.toPlural(GenericEntityService.toCamelCase(this.entityName))
        console.log('entityNameResource 2', entityNameResource)
        this.genericEntityService.getTableData(this.tableName, searchCriteria, pageNumber, pageSize, sort)
            .subscribe(
                {
                    // next: (flightLogTotalsVResponse: IFlightLogTotalsVResponse) => {

                    //     this.loadingStatus = false

                    //     console.log('flightLogTotalsVResponse', flightLogTotalsVResponse);
                    //     this.flightLogTotalsVResponse = flightLogTotalsVResponse;
                    //     this.page = this.flightLogTotalsVResponse.page;
                    //     this.flightLogTotalsVs = this.page.totalElements ? this.flightLogTotalsVResponse._embedded.flightLogTotalsVs : [];
                    //     this.clearTimes(this.flightLogTotalsVs);
                    //     console.log('this.flightLogTotalsVs', this.flightLogTotalsVs);
                    //     //this.links = this.flightLogTotalsVResponse._links;

                    //     this.calculatePageTotals(this.flightLogTotalsVs)
                    //     this.pageRowKey = this.flightLogTotalsVs[this.flightLogTotalsVs.length - 1]._links.flightLogTotalsV.href
                    next: rowResponse => {
                        console.log('rowResponse', rowResponse);
                        this.page = rowResponse.page;
                        if (rowResponse._embedded) {
                            this.firstRowOfTable = this.page.number * this.ROWS_PER_PAGE;
                            //this.rowArray = rowResponse._embedded[GenericEntityService.toPlural(this.entityName)];
                            this.rowArray = rowResponse._embedded.simpleModels;
                            ComponentHelper.setRowArrayDateFields(this.rowArray, this.fieldAttributesArray);
                        } else {
                            this.firstRowOfTable = 0;
                            this.rowArray = [];
                        }
                        this.links = rowResponse._links;
                        this.loadingStatus = false
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

    fetchAssociations() {
        // Get all rows of association table
        this.formAttributes.associations.forEach(associationAttributes => {
            this.genericEntityService.getAssociationGenericEntity(associationAttributes.associationTableName, ['']).subscribe({
                next: rowResponse => {
                    //this.availableStudents = students;
                    console.log('rowResponse: ', rowResponse);
                    if (rowResponse._embedded) {
                        this.associationArray = rowResponse._embedded[associationAttributes.associationTableName + 's'];
                        ComponentHelper.setRowArrayDateFields(this.associationArray, this.fieldAttributesArray);
                        ComponentHelper.sortGenericEntity(this.associationArray, this.formAttributes.associations[0].orderByColumns);
                        console.log('this.associationArray: ', this.associationArray);
                    } else {
                        this.firstRowOfTable = 0;
                        this.rowArray = [];
                    }
                },
                error: error => {
                    console.error(error);
                    this.messageService.error(error);
                }
            });
        })
    }

    // Get associated rows of this entity
    private fetchAssosciatedRows(crudRow: IGenericEntity, associationAttributes: AssociationAttributes) {
        this.genericEntityService.getAssociatedRows(crudRow, associationAttributes, ['']).subscribe({
            next: rowResponse => {
                //this.availableStudents = students;
                console.log('fetchAssosciatedRows() rowResponse: ', rowResponse);
                if (rowResponse._embedded) {
                    this.selectedAssociationArray = rowResponse._embedded[associationAttributes.associationTableName + 's'];
                    ComponentHelper.setRowArrayDateFields(this.selectedAssociationArray, this.fieldAttributesArray);
                    ComponentHelper.sortGenericEntity(this.selectedAssociationArray, this.formAttributes.associations[0].orderByColumns);
                    console.log('fetchAssosciatedRows() this.selectedAssociationArray: ', this.selectedAssociationArray);
                    console.log('fetchAssosciatedRows() this.associationArray: ', this.associationArray);
                    this.populateAvailableAssociationArray();
                } else {
                    this.firstRowOfTable = 0;
                    this.rowArray = [];
                }
            },
            error: error => {
                console.error(error);
                this.messageService.error(error);
            }
        });
    }

    private populateAvailableAssociationArray() {
        // compute availableAssociationArray = associationArray - selectedAssociationArray
        this.availableAssociationArray = [];
        this.associationArray && this.associationArray.forEach(row => {
            let found: boolean = false;
            for (let selectedRow of this.selectedAssociationArray) {
                if (row._links.self.href === selectedRow._links.self.href) {
                    found = true;
                    break;
                }
            }
            if (! /* not */ found) {
                this.availableAssociationArray.push(row);
            }
        });
        console.log('this.availableAssociationArray: ', this.availableAssociationArray);
    }

    onGoToPage() {
        console.log('this.pageNumber', this.pageNumber);
        // TODO this might be redundant since it is set in fetchPage
        this.firstRowOfTable = (this.pageNumber - 1) * this.ROWS_PER_PAGE;
        this.savedTableLazyLoadEvent.first = this.firstRowOfTable;
        this.onLazyLoad(this.savedTableLazyLoadEvent);
        //this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '', this.formAttributes.queryOrderByColumns);
        this.fetchPage(this.savedTableLazyLoadEvent);
        this.pageNumber = 0;
    }

    onRowSelect(event: any) {
        console.log(event);

        this.crudRow = Object.assign({}, this.selectedRow);
        this.modifyAndDeleteButtonsDisable = false;
        this.formAttributes.associations.forEach(associationAttributes => {
            this.fetchAssosciatedRows(this.crudRow, associationAttributes);
        });

    }
    onRowUnselect(event: any) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = true;
        //this.selectedRow = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }

    onMoveAllToTarget() {
        this.onMoveToTarget();
    }
    onMoveToTarget() {
        console.log('this.selectedAssociationArray', this.selectedAssociationArray);
        ComponentHelper.sortGenericEntity(this.selectedAssociationArray, this.formAttributes.associations[0].orderByColumns);
    }
    onMoveAllToSource() {
        this.onMoveToSource();
    }
    onMoveToSource() {
        ComponentHelper.sortGenericEntity(this.availableAssociationArray, this.formAttributes.associations[0].orderByColumns);
    }

    private setRowDateFields(row: IGenericEntity, fieldAttributesArray: Array<FieldAttributes>) {
        fieldAttributesArray.forEach(fieldAttributes => {
            if (fieldAttributes.dataType === DataTypeEnum.DATE) {
                console.log('row[fieldAttributes.columnName]', row[fieldAttributes.columnName]);
                let dateOnly: Date = new Date(row[fieldAttributes.columnName]);
                dateOnly.setHours(0); dateOnly.setMinutes(0); dateOnly.setSeconds(0); dateOnly.setMilliseconds(0);
                row[fieldAttributes.columnName] = dateOnly;
                console.log('row[fieldAttributes.columnName]', row[fieldAttributes.columnName]);
            }
        });
    }

}
