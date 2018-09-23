import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { CrudEnum } from '../crud-enum';
import { FormAttributes, FieldAttributes, CrudComponentConfig } from '../config/crud-component-config';
import { StringUtils } from '../string-utils';
import { LazyLoadEvent } from 'primeng/primeng';
import { HalResponseLinks } from '../hal/hal-response-links';
import { HalResponsePage } from '../hal/hal-response-page';
import { ComponentHelper } from '../util/ComponentHelper';
import { GenericEntityService } from '../service/generic-entity.service';

@Component({
    selector: 'app-generic-crud',
    templateUrl: './generic-crud.component.html',
    styleUrls: ['./generic-crud.component.css']
})
export class GenericCrudComponent implements OnInit {

    rowArray: Array<IGenericEntity>;
    selectedRow: IGenericEntity;
    crudRow: IGenericEntity;
    //rowResponse: IGenericEntityResponse;
    row: IGenericEntity;
    page: HalResponsePage;
    links: HalResponseLinks;

    crudForm: FormGroup;
    
    displayDialog: boolean;

    crudMode: CrudEnum;
    modifyAndDeleteButtonsDisable: boolean = true;

    formAttributes: FormAttributes;
    fieldAttributesArray: Array<FieldAttributes>;
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

    constructor(private formBuilder: FormBuilder, private genericEntityService: GenericEntityService, private route: ActivatedRoute) {
        console.log("constructor() ===============================");
    }

    ngOnInit() {
        this.counter++;
        console.log("this.counter: ", this.counter);
        this.route.params.subscribe(params => {
            this.tableName = params['tableName'];

            this.formAttributes = CrudComponentConfig.formConfig.get(this.tableName);
            this.fieldAttributesArray = this.formAttributes.fields;
            console.log('this.formAttributes', this.formAttributes);

            console.log('tableName', this.tableName/*, 'sortColumnName', this.sortColumnName*/);
            this.tableNameCapitalized = StringUtils.capitalize(this.tableName);
            this.createForm();
            console.log("after createForm");
        });
        this.row = <IGenericEntity>{};
        console.log("before fetchPage");
        this.fetchPage(0, this.ROWS_PER_PAGE, '', this.formAttributes.queryOrderByColumns);
    }

    createForm() {
        this.crudForm = new FormGroup({});
        this.fieldAttributesArray.forEach(fieldAttributes => {
            this.crudForm.addControl(fieldAttributes.columnName, new FormControl());
        })
    }

    showDialog(crudMode: string) {
        this.displayDialog = true;
        this.crudMode = CrudEnum[crudMode];
        console.log('this.crudMode', this.crudMode);
        switch (this.crudMode) {
        case CrudEnum.Add:
            this.fieldAttributesArray.forEach(fieldAttributes => {
                let control: AbstractControl = this.crudForm.controls[fieldAttributes.columnName];
                console.log('fieldAttributes.dataType', fieldAttributes.dataType);
                if (fieldAttributes.dataType === 'date') {
                    control.patchValue(new Date());
                } else {
                    control.patchValue(null);
                }
                control.enable();
            });
            break;
        case CrudEnum.Update:
            this.fieldAttributesArray.forEach(fieldAttributes => {
                let control: AbstractControl = this.crudForm.controls[fieldAttributes.columnName];
                control.patchValue(this.crudRow[fieldAttributes.columnName]);
                control.enable();
            });
            break;
        case CrudEnum.Delete:
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
            case CrudEnum.Add:
                this.crudRow = <IGenericEntity>{};

                this.fieldAttributesArray.forEach(fieldAttributes => {
                    this.crudRow[fieldAttributes.columnName] = this.crudForm.controls[fieldAttributes.columnName].value;
                });

                this.genericEntityService.addGenericEntity(this.tableName, this.crudRow).subscribe({
                    next: savedTwoColumnEntity => {
                        console.log('savedTwoColumnEntity', savedTwoColumnEntity);
                    },
                    error: error => {
                        console.error('genericEntityService.addGenericEntity returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });

                break;
            case CrudEnum.Update:

                this.fieldAttributesArray.forEach(fieldAttributes => {
                    this.crudRow[fieldAttributes.columnName] = this.crudForm.controls[fieldAttributes.columnName].value;
                });

                this.genericEntityService.updateGenericEntity(this.crudRow).subscribe({
                    next: savedRow => {
                        console.log('savedRow', savedRow);
                    },
                    error: error => {
                        console.error('enericEntityService.updateGenericEntity returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.Delete:
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
            console.error(error);
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
        this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '', this.formAttributes.queryOrderByColumns);
        this.pageNumber = null;
    }
 
    onRowSelect(event) {
        console.log(event);

        this.crudRow = Object.assign({}, this.selectedRow);
        this.modifyAndDeleteButtonsDisable = false;
    }
    onRowUnselect(event) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = true;
        //this.selectedRow = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }

    private setDateFields(rowArray: Array<IGenericEntity>, fieldAttributesArray: Array<FieldAttributes>) {
        rowArray.forEach(row => {
            fieldAttributesArray.forEach(fieldAttributes => {
                if (fieldAttributes.dataType === 'date') {
                    row[fieldAttributes.columnName] = new Date(row[fieldAttributes.columnName]);
                }
            })
        })
    }

}
