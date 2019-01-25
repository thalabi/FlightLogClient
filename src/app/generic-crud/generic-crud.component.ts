import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { CrudEnum } from '../crud-enum';
import { FormAttributes, FieldAttributes, CrudComponentConfig, DataTypeEnum, UiComponentEnum, AssociationAttributes } from '../config/crud-component-config';
import { StringUtils } from '../string-utils';
import { LazyLoadEvent, Message } from 'primeng/primeng';
import { HalResponseLinks } from '../hal/hal-response-links';
import { HalResponsePage } from '../hal/hal-response-page';
import { ComponentHelper } from '../util/ComponentHelper';
import { GenericEntityService } from '../service/generic-entity.service';
import { MyMessageService } from '../message/mymessage.service';
import { CustomErrorHandler } from '../custom-error-handler';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { SessionDataService } from '../service/session-data.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
    selector: 'app-generic-crud',
    templateUrl: './generic-crud.component.html',
    styleUrls: ['./generic-crud.component.css']
})
export class GenericCrudComponent implements OnInit {
    //[x: string]: any;

    rowArray: Array<IGenericEntity>;
    // Holds all rows of the associated table
    associationArray: Array<IGenericEntity>;
    // Holds rows of the associated table ['associationArray - selectedAssociationArray'
    availableAssociationArray: Array<IGenericEntity>;
    selectedRow: IGenericEntity;
    // Holds rows associated with the selected rows
    selectedAssociationArray: Array<IGenericEntity> = [];
    crudRow: IGenericEntity;
    //rowResponse: IGenericEntityResponse;
    row: IGenericEntity;
    page: HalResponsePage;
    links: HalResponseLinks;

    crudForm: FormGroup;
    
    displayDialog: boolean;

    crudMode: CrudEnum;
    crudEnum = CrudEnum; // Used in html to refere to enum
    modifyAndDeleteButtonsDisable: boolean = true;

    formAttributes: FormAttributes;
    fieldAttributesArray: Array<FieldAttributes>;
    associationAttributesArray: Array<AssociationAttributes>;
    tableName: string;
    // sortColumnName: string;
    tableNameCapitalized: string;
    //columnName1: string;

    // used to pass as argument to getTableRowsLazy() when refreshing page after add/update/delete
    savedLazyLoadEvent: LazyLoadEvent;

    readonly ROWS_PER_PAGE: number = 10; // default rows per page
    firstRowOfTable: number; // triggers a page change, zero based. 0 -> first page, 1 -> second page, ...
    
    pageNumber: number;

    counter: number = 0;

    loadingFlag: boolean;

    uiComponentEnum = UiComponentEnum; // Used in html to refere to enum

    hasWritePermission: boolean = false;

    constructor(private formBuilder: FormBuilder, private genericEntityService: GenericEntityService, private route: ActivatedRoute, private messageService: MyMessageService, private sessionDataService: SessionDataService) {
        console.log("constructor() ===============================");
    }

    ngOnInit() {
        this.messageService.clear();
        this.counter++;
        console.log("this.counter: ", this.counter);
        this.route.params.subscribe(params => {
            this.tableName = params['tableName'];

            this.formAttributes = CrudComponentConfig.formConfig.get(this.tableName);
            this.fieldAttributesArray = this.formAttributes.fields;
            this.associationAttributesArray = this.formAttributes.associations;
            console.log('this.formAttributes', this.formAttributes, 'this.associationAttributesArray', this.associationAttributesArray);

            console.log('tableName', this.tableName/*, 'sortColumnName', this.sortColumnName*/);
            this.tableNameCapitalized = StringUtils.capitalize(this.tableName);
            this.createForm();
            console.log("after createForm");

            this.row = <IGenericEntity>{};
            console.log("before fetchPage");
            this.fetchPage(0, this.ROWS_PER_PAGE, '', this.formAttributes.queryOrderByColumns);
            
            this.fetchAssociations();

            this.hasWritePermission = MenuComponent.isHolderOfAnyAuthority(
                this.sessionDataService.user, CrudComponentConfig.entityToWritePermissionMap.get(this.tableName));

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
                let addGenericEntityAndAssociation$: Observable<IGenericEntityResponse> = this.genericEntityService.addGenericEntity(this.tableName, this.crudRow)
                    .concatMap(savedSingleGenericEntityResponse => {
                        if (this.formAttributes.associations && this.formAttributes.associations.length != 0) {
                            return this.genericEntityService.updateAssociationGenericEntity(savedSingleGenericEntityResponse, this.formAttributes.associations[0], this.selectedAssociationArray);
                        } else {
                            return Observable.of<IGenericEntityResponse>(savedSingleGenericEntityResponse);
                        }
                    });
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

                let updateGenericEntityAndAssociation$: Observable<IGenericEntityResponse> = this.genericEntityService.updateGenericEntity(this.crudRow)
                    .concatMap(savedSingleGenericEntityResponse => {
                        if (this.formAttributes.associations && this.formAttributes.associations.length != 0) {
                            return this.genericEntityService.updateAssociationGenericEntity(savedSingleGenericEntityResponse, this.formAttributes.associations[0], this.selectedAssociationArray);
                        } else {
                            return Observable.of<IGenericEntityResponse>(savedSingleGenericEntityResponse);
                        }
                    });
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
        this.fetchPage(this.savedLazyLoadEvent.first, this.savedLazyLoadEvent.rows,
            ComponentHelper.buildSearchString(this.savedLazyLoadEvent, this.formAttributes.fields.map(field => field.columnName)),
            this.formAttributes.queryOrderByColumns);

        this.resetDialoForm();
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

    onLazyLoad(lazyLoadEvent: LazyLoadEvent) {
        this.savedLazyLoadEvent = lazyLoadEvent;
        console.log('event', lazyLoadEvent);
        console.log('event.first', lazyLoadEvent.first);
        // console.log('this.firstRowOfTable', this.firstRowOfTable);
        // lazyLoadEvent.first = lazyLoadEvent.first || this.firstRowOfTable;
        // console.log('event.first', lazyLoadEvent.first);
        console.log('event.rows', lazyLoadEvent.rows);
        console.log('event.filters', lazyLoadEvent.filters);
        this.fetchPage(lazyLoadEvent.first, lazyLoadEvent.rows,
            ComponentHelper.buildSearchString(lazyLoadEvent, this.formAttributes.fields.map(field => field.columnName)),
            this.formAttributes.queryOrderByColumns);
    }

    fetchPage(firstRowNumber: number, rowsPerPage: number, searchString: string, queryOrderByColumns: string[]) {
        console.log("in fetchPage");
        this.loadingFlag = true;
        this.genericEntityService.getGenericEntityPage(this.tableName, firstRowNumber, rowsPerPage, searchString, queryOrderByColumns)
        .subscribe({
            next: rowResponse => {
                console.log('rowResponse', rowResponse);
                this.page = rowResponse.page;
                if (rowResponse._embedded) {
                    this.firstRowOfTable = this.page.number * this.ROWS_PER_PAGE;
                    this.rowArray = rowResponse._embedded[this.tableName+'s'];
                    this.setRowArrayDateFields(this.rowArray, this.fieldAttributesArray);
                } else {
                    this.firstRowOfTable = 0;
                    this.rowArray = [];
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

    fetchAssociations() {
        // Get all rows of association table
        this.formAttributes.associations.forEach(associationAttributes => {
            this.genericEntityService.getAssociationGenericEntity(associationAttributes.associationTableName, null).subscribe({
                next: rowResponse => {
                    //this.availableStudents = students;
                    console.log('rowResponse: ', rowResponse);
                    if (rowResponse._embedded) {
                        this.associationArray = rowResponse._embedded[associationAttributes.associationTableName+'s'];
                        this.setRowArrayDateFields(this.associationArray, this.fieldAttributesArray);
                        this.sortAssociation(this.associationArray, this.formAttributes.associations[0].orderByColumns);
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
        this.genericEntityService.getAssociatedRows(crudRow, associationAttributes, null).subscribe({
            next: rowResponse => {
                //this.availableStudents = students;
                console.log('rowResponse: ', rowResponse);
                if (rowResponse._embedded) {
                    this.selectedAssociationArray = rowResponse._embedded[associationAttributes.associationTableName+'s'];
                    this.setRowArrayDateFields(this.selectedAssociationArray, this.fieldAttributesArray);
                    this.sortAssociation(this.selectedAssociationArray, this.formAttributes.associations[0].orderByColumns);
                    console.log('this.selectedAssociationArray: ', this.selectedAssociationArray);
                    console.log('this.associationArray: ', this.associationArray);
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
        this.associationArray.forEach(row=> {
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
        this.savedLazyLoadEvent.first = this.firstRowOfTable;
        this.onLazyLoad(this.savedLazyLoadEvent);
        this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '', this.formAttributes.queryOrderByColumns);
        this.pageNumber = null;
    }
 
    onRowSelect(event) {
        console.log(event);

        this.crudRow = Object.assign({}, this.selectedRow);
        this.modifyAndDeleteButtonsDisable = false;
        this.formAttributes.associations.forEach(associationAttributes => {
            this.fetchAssosciatedRows(this.crudRow, associationAttributes);
        });
        
    }
    onRowUnselect(event) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = true;
        //this.selectedRow = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }

    onMoveAllToTarget() {
        this.onMoveToTarget();
    }
    onMoveToTarget() {
        this.sortAssociation(this.selectedAssociationArray, this.formAttributes.associations[0].orderByColumns);
    }
    onMoveAllToSource() {
        this.onMoveToSource();
    }
    onMoveToSource() {
        this.sortAssociation(this.availableAssociationArray, this.formAttributes.associations[0].orderByColumns);
    }

    private sortAssociation(students: IGenericEntity[], orderByColumns: Array<string>): void {
        // TODO allow more than one order column
        students.sort((n1, n2): number => {
            if (n1[orderByColumns[0]] < n2[orderByColumns[0]]) return -1;
            if (n1[orderByColumns[0]] > n2[orderByColumns[0]]) return 1;
            return 0;
        });
    }

    /*
    Change fields withDataTypeEnum.Date type to date and set time to zero
    */
    private setRowArrayDateFields(rowArray: Array<IGenericEntity>, fieldAttributesArray: Array<FieldAttributes>) {
        rowArray.forEach(row => {
            fieldAttributesArray.forEach(fieldAttributes => {
                if (fieldAttributes.dataType === DataTypeEnum.DATE) {
                    row[fieldAttributes.columnName] = new Date(row[fieldAttributes.columnName]+'T00:00:00');
                }
            });
        });
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
