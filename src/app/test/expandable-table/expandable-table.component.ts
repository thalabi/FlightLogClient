import { Component, OnInit } from '@angular/core';
import { GenericEntityService } from '../../service/generic-entity.service';
import { IGenericEntity } from '../../domain/i-gerneric-entity';
import { HalResponsePage } from '../../hal/hal-response-page';
import { HalResponseLinks } from '../../hal/hal-response-links';
import { MyMessageService } from '../../message/mymessage.service';
import { CustomErrorHandler } from '../../custom-error-handler';
import { LazyLoadEvent } from 'primeng/primeng';
import { ComponentHelper } from '../../util/ComponentHelper';
import { FieldAttributes, DataTypeEnum, UiComponentEnum } from '../../config/crud-component-config';

@Component({
    selector: 'app-expandable-table',
    templateUrl: './expandable-table.component.html',
    styleUrls: ['./expandable-table.component.css']
})
export class ExpandableTableComponent implements OnInit {

    rowArray: Array<IGenericEntity>;
    selectedRow: IGenericEntity;
    loadingFlag: boolean;
    tableName: string;
    page: HalResponsePage;
    // used to pass as argument to getTableRowsLazy() when refreshing page after add/update/delete
    savedLazyLoadEvent: LazyLoadEvent;
    readonly ROWS_PER_PAGE: number = 10; // default rows per page
    firstRowOfTable: number; // triggers a page change, zero based. 0 -> first page, 1 -> second page, ...
    links: HalResponseLinks;
    cols: Array<any>;
    readonly SORT_COLUMNS: Array<string> = ['name'];
    fields: Array<FieldAttributes>;

    constructor(private genericEntityService: GenericEntityService, private messageService: MyMessageService) { }

    ngOnInit() {
        this.tableName = 'component';
        this.messageService.clear();

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'partName', header: 'Part' },
            { field: 'workPerformed', header: 'Work Performed' },
            { field: 'datePerformed', header: 'Date Performed' },
            { field: 'hoursPerformed', header: 'Hours Performed' },
            { field: 'dateDue', header: 'Date Due' },
            { field: 'hoursDue', header: 'Hours Due' }
        ];

        this.fields = [
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Name', uiComponentType: UiComponentEnum.TEXT},
            {columnName: 'description', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT},
            {columnName: 'partName', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 3, header: 'Part', uiComponentType: UiComponentEnum.TEXT, textAreaRows: 4, textAreaColumns: 30},
            {columnName: 'workPerformed', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 4, header: 'Work Performed', uiComponentType: UiComponentEnum.TEXT, textAreaRows: 4, textAreaColumns: 30},
            {columnName: 'datePerformed', dataType: DataTypeEnum.DATE, mandatory: true, orderNumber: 5, header: 'Date Performed', headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'}},
            {columnName: 'hoursPerformed', dataType: DataTypeEnum.NUMBER, mandatory: true, orderNumber: 6, header: 'Hours Performed', uiComponentType: UiComponentEnum.TEXT},
            {columnName: 'dateDue', dataType: DataTypeEnum.DATE, mandatory: true, orderNumber: 7, header: 'Date Due', headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'}},
            {columnName: 'hoursDue', dataType: DataTypeEnum.NUMBER, mandatory: true, orderNumber: 8, header: 'Hours Due', uiComponentType: UiComponentEnum.TEXT}
            ];


        this.fetchPage(0, this.ROWS_PER_PAGE, '', this.SORT_COLUMNS);
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
            ComponentHelper.buildSearchString(lazyLoadEvent, this.cols.map(field => field.columnName)), this.SORT_COLUMNS);
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
                    ComponentHelper.setRowArrayDateFields(this.rowArray, this.fields);
                    this.rowArray = this.transformAttributes(this.rowArray);
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

    onRowSelect(event) {
        console.log(event);

        // this.crudRow = Object.assign({}, this.selectedRow);
        // this.modifyAndDeleteButtonsDisable = false;
        // this.formAttributes.associations.forEach(associationAttributes => {
        //     this.fetchAssosciatedRows(this.crudRow, associationAttributes);
        // });
        
    }
    onRowUnselect(event) {
        console.log(event);
        // this.modifyAndDeleteButtonsDisable = true;
    }

    private transformAttributes(rowArray: Array<IGenericEntity>): Array<IGenericEntity> {
        rowArray.forEach(row => {
            row.partName = (row.part ? row.part.name : '');
        });
        return rowArray;
    }
}
