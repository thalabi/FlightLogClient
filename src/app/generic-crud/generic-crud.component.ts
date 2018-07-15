import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightLogServiceService } from '../service/flight-log-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { CrudEnum } from '../crud-enum';
import { FormAttributes, FieldAttributes, CrudComponentConfig } from '../config/crud-component-config';
import { StringUtils } from '../string-utils';
import { LazyLoadEvent } from 'primeng/primeng';
import { HalResponseLinks } from '../hal/hal-response-links';
import { HalResponsePage } from '../hal/hal-response-page';
import { ComponentHelper } from '../util/ComponentHelper';

@Component({
    selector: 'app-generic-crud',
    templateUrl: './generic-crud.component.html',
    styleUrls: ['./generic-crud.component.css']
})
export class GenericCrudComponent implements OnInit {

    rowArray: Array<IGenericEntity>;
    selectedRow: IGenericEntity;
    crudRow: IGenericEntity;
    rowResponse: IGenericEntityResponse;
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
    firstRowOfTable: number; // zero based. 0 -> first page, 1 -> second page, ...
    
    pageNumber: number;

    constructor(private formBuilder: FormBuilder, private flightLogService: FlightLogServiceService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.tableName = params['tableName'];

            this.formAttributes = CrudComponentConfig.formConfig.get(this.tableName);
            this.fieldAttributesArray = this.formAttributes.fields;
            console.log('this.formAttributes', this.formAttributes);

            console.log('tableName', this.tableName/*, 'sortColumnName', this.sortColumnName*/);
            this.tableNameCapitalized = StringUtils.capitalize(this.tableName);
            // TODO un comment
            //this.createForm();
        });
        this.row = <IGenericEntity>{};
        this.fetchPage(0, this.ROWS_PER_PAGE, '', this.formAttributes.queryOrderByColumns);
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
        this.flightLogService.getGenericEntityPage(this.tableName, firstRowNumber, rowsPerPage, searchString, queryOrderByColumns)
        .subscribe({
            next: rowResponse => {
                console.log('data', rowResponse);
                this.rowResponse = rowResponse;
                console.log('this.rowResponse', this.rowResponse);
                this.page = this.rowResponse.page;
                this.rowArray = this.page.totalElements ? this.rowResponse._embedded[this.tableName+'s'] : [];
                console.log('this.rowArray', this.rowArray);
                this.links = this.rowResponse._links;
        }});
    }

    onGoToPage() {
        console.log('this.pageNumber', this.pageNumber);
        this.firstRowOfTable = (this.pageNumber - 1) * this.ROWS_PER_PAGE;
        this.savedLazyLoadEvent.first = this.firstRowOfTable;
        this.onLazyLoad(this.savedLazyLoadEvent);
        this.fetchPage(this.firstRowOfTable, this.ROWS_PER_PAGE, '', this.formAttributes.queryOrderByColumns);
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
