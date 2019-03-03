import { Component, OnInit } from '@angular/core';
import { GenericEntityService } from '../../service/generic-entity.service';
import { IGenericEntity } from '../../domain/i-gerneric-entity';
import { HalResponsePage } from '../../hal/hal-response-page';
import { HalResponseLinks } from '../../hal/hal-response-links';
import { MyMessageService } from '../../message/mymessage.service';
import { CustomErrorHandler } from '../../custom-error-handler';
import { LazyLoadEvent } from 'primeng/primeng';
import { ComponentHelper } from '../../util/ComponentHelper';
import { CrudComponentConfig } from '../../config/crud-component-config';
import { DataTypeEnum } from "../../config/DataTypeEnum";
import { FieldAttributes } from "../../config/FieldAttributes";
import { UiComponentEnum } from "../../config/UiComponentEnum";
import { CrudEnum } from '../../crud-enum';
import { MenuComponent } from '../../menu/menu.component';
import { SessionDataService } from '../../service/session-data.service';
import { Constant } from '../../constant';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { AssociationAttributes } from '../../config/AssociationAttributes';
import { AssociationTypeEnum } from '../../config/AssociationTypeEnum';
import { ComponentEnum } from '../../config/ComponentEnum';

@Component({
    selector: 'app-expandable-table',
    templateUrl: './expandable-table.component.html',
    styleUrls: ['./expandable-table.component.css']
})
export class ExpandableTableComponent implements OnInit {

    rowArray: Array<IGenericEntity>;
    partRowArray: Array<IGenericEntity>;
    selectedRow: IGenericEntity;
    componentRow: IGenericEntity;

    loadingFlag: boolean;
    page: HalResponsePage;

    componentForm: FormGroup;
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
    readonly COMPONENT_TABLE_NAME: string = 'component';
    readonly PART_TABLE_NAME: string = 'part';
    readonly SORT_COLUMNS: Array<string> = ['name'];
    componentFields: Array<FieldAttributes>;
    componentDataTableFields: Array<FieldAttributes>;
    componentFormFields: Array<FieldAttributes>; // is componentFields minus part field
    componentHistoryFields: Array<FieldAttributes>;

    uiComponentEnum = UiComponentEnum; // Used in html to refere to enum

    hasWritePermission: boolean = false;

    constructor(private genericEntityService: GenericEntityService, private messageService: MyMessageService,
        private sessionDataService: SessionDataService) { }

    ngOnInit() {
        this.messageService.clear();
        this.rowArray = [];
        this.page = new HalResponsePage();
        let includeInBothComponents: Array<ComponentEnum> = [ComponentEnum.DATA_TABLE, ComponentEnum.TEMPLATE_FORM];

        let partFieldAssocitaion: AssociationAttributes =
            {associationTableName: 'part', associationPropertyName: 'part', orderByColumns: ['name'],
                associationTypeEnum: AssociationTypeEnum.MANY_TO_ONE, propertyAsName: 'name', mandatory: true, optionsArray: null};
        let partField: FieldAttributes = {columnName: 'part', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 9,
            header: 'Part', uiComponentType: UiComponentEnum.DROPDOWN, includeInComponent: [ComponentEnum.TEMPLATE_FORM], associationAttributes: partFieldAssocitaion};

        this.componentFields = [
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Name',
                uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '6rem'}, includeInComponent: includeInBothComponents},
            {columnName: 'description', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 2, header: 'Description',
                uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '6rem'}, includeInComponent: includeInBothComponents},
            {columnName: 'partName', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 3, header: 'Part',
                uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '6rem'}, includeInComponent: [ComponentEnum.DATA_TABLE]},
            {columnName: 'workPerformed', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 4, header: 'Work Prfrmd',
                uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '6rem'}, includeInComponent: includeInBothComponents},
            {columnName: 'datePerformed', dataType: DataTypeEnum.DATE, mandatory: true, orderNumber: 5, header: 'Dt Prfrmd',
                headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '4rem'}, includeInComponent: includeInBothComponents},
            {columnName: 'hoursPerformed', dataType: DataTypeEnum.NUMBER, mandatory: false, orderNumber: 6, header: 'Hrs Prfrmd',
                uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '4.5rem'}, filterStyle: {width: '3rem'}, includeInComponent: includeInBothComponents},
            {columnName: 'dateDue', dataType: DataTypeEnum.DATE, mandatory: false, orderNumber: 7, header: 'Dt Due',
                headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '4rem'}, includeInComponent: includeInBothComponents},
            {columnName: 'hoursDue', dataType: DataTypeEnum.NUMBER, mandatory: false, orderNumber: 8, header: 'Hrs Due',
                uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '4.5rem'}, filterStyle: {width: '3rem'}, includeInComponent: includeInBothComponents},
            partField
            ];

        this.componentDataTableFields = this.componentFields.filter(fieldAttributes => fieldAttributes.includeInComponent.includes(ComponentEnum.DATA_TABLE));
    
        this.componentFormFields = this.componentFields.filter(fieldAttributes => fieldAttributes.includeInComponent.includes(ComponentEnum.TEMPLATE_FORM));
        //this.componentFormFields.push({columnName: 'part', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 9, header: 'Part', uiComponentType: UiComponentEnum.DROPDOWN});

        this.componentHistoryFields = [
            {columnName: 'workPerformed', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 4, header: 'Work Performed', uiComponentType: UiComponentEnum.TEXT, textAreaRows: 4, textAreaColumns: 30, includeInComponent: [ComponentEnum.DATA_TABLE]},
            {columnName: 'datePerformed', dataType: DataTypeEnum.DATE, mandatory: true, orderNumber: 5, header: 'Date Performed', headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'}, includeInComponent: [ComponentEnum.DATA_TABLE]},
            {columnName: 'hoursPerformed', dataType: DataTypeEnum.NUMBER, mandatory: true, orderNumber: 6, header: 'Hours Performed', uiComponentType: UiComponentEnum.TEXT, includeInComponent: [ComponentEnum.DATA_TABLE]}
            ];
    
        this.createForm();
        this.fetchPartTable();

        this.hasWritePermission = MenuComponent.isHolderOfAnyAuthority(
            this.sessionDataService.user, Constant.entityToWritePermissionMap.get(this.COMPONENT_TABLE_NAME));
    }

    createForm() {
        this.componentForm = new FormGroup({});
        this.componentFormFields.forEach(fieldAttributes => {
            if (fieldAttributes.mandatory) {
                this.componentForm.addControl(fieldAttributes.columnName, new FormControl('', Validators.required));
            } else {
                this.componentForm.addControl(fieldAttributes.columnName, new FormControl(''));
            }
        })
    }

    showDialog(crudMode: CrudEnum) {
        this.displayDialog = true;
        this.crudMode = crudMode;
        console.log('this.crudMode', this.crudMode);
        switch (this.crudMode) {
        case CrudEnum.ADD:
            this.componentFormFields.forEach(fieldAttributes => {
                let control: AbstractControl = this.componentForm.controls[fieldAttributes.columnName];
                ComponentHelper.initControlValues(control, fieldAttributes.dataType, true);
                control.enable();
            });
            break;
        case CrudEnum.UPDATE:
            this.componentFormFields.forEach(fieldAttributes => {
                let control: AbstractControl = this.componentForm.controls[fieldAttributes.columnName];
                control.patchValue(this.componentRow[fieldAttributes.columnName]);
                control.enable();
            });
            console.log('this.componentFormFields: %o', this.componentFormFields);
            break;
        case CrudEnum.DELETE:
            this.componentFormFields.forEach(fieldAttributes => {
                let control: AbstractControl = this.componentForm.controls[fieldAttributes.columnName];
                control.patchValue(this.componentRow[fieldAttributes.columnName]);
                control.disable();
            });
            break;
        default:
            console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
        console.log('this.crudForm', this.componentForm);
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
            ComponentHelper.buildSearchString(lazyLoadEvent, this.componentFields.map(field => field.columnName)), this.SORT_COLUMNS);
    }

    fetchPage(firstRowNumber: number, rowsPerPage: number, searchString: string, queryOrderByColumns: string[]) {
        console.log("in fetchPage");
        this.loadingFlag = true;
        this.genericEntityService.getGenericEntityPage(this.COMPONENT_TABLE_NAME, firstRowNumber, rowsPerPage, searchString, queryOrderByColumns)
        .subscribe({
            next: rowResponse => {
                console.log('rowResponse', rowResponse);
                this.page = rowResponse.page;
                if (rowResponse._embedded) {
                    this.firstRowOfTable = this.page.number * this.ROWS_PER_PAGE;
                    this.rowArray = rowResponse._embedded[this.COMPONENT_TABLE_NAME+'s'];
                    this.setRowArrayDateFields(this.rowArray, this.componentFields, this.componentHistoryFields);
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
                    this.componentFormFields.forEach(componentFormField => {
                        if (componentFormField.columnName === 'part') {
                            componentFormField.associationAttributes.optionsArray = this.partRowArray;
                        }
                    });
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

    // Get associated rows of this entity
    private fetchAssosciatedRows(crudRow: IGenericEntity, associationAttributes: AssociationAttributes) {
        // switch (associationAttributes.associationTypeEnum) {
        //     case AssociationTypeEnum.MANY_TO_MANY:
        //         this.genericEntityService.getAssociatedRows(crudRow, associationAttributes, null).subscribe({
        //             next: rowResponse => {
        //                 console.log('rowResponse of associated rows of %o: %o', crudRow._links.self, rowResponse);
        //                 this.selectedAssociationArray = rowResponse._embedded[associationAttributes.tableName+'s'];
        //                 this.setRowArrayDateFields(this.selectedAssociationArray, this.fieldAttributesArray);
        //                 this.sortAssociation(this.selectedAssociationArray, this.formAttributes.associations[0].orderByColumns);
        //                 console.log('this.selectedAssociationArray: ', this.selectedAssociationArray);
        //                 // console.log('this.associationArray: ', this.associationArray);
        //                 this.populateAvailableAssociationArray();
        //             },
        //             error: error => {
        //                 console.error(error);
        //                 this.messageService.error(error);
        //             }
        //         });
        //         break;
        //     case AssociationTypeEnum.MANY_TO_ONE:
                this.genericEntityService.getAssociatedRow(crudRow, associationAttributes, null).subscribe({
                    next: rowResponse => {
                        console.log('rowResponse of associated rows of %o: %o', crudRow._links.self, rowResponse);
                        this.selectedAssociationArray[0] = rowResponse;
                        console.log('this.selectedAssociationArray: ', this.selectedAssociationArray);
                    },
                    error: error => {
                        console.error(error);
                        this.messageService.error(error);
                    }
                });
        //         break;
        //     default:
        //         console.error('AssociationTypeEnum %s is not hadled', associationAttributes.associationTypeEnum);
        // }
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
        // if (this.formAttributes.associations && this.formAttributes.associations.length > 0) {
        //     this.formAttributes.associations.forEach(associationAttributes => {
        //         this.fetchAssosciatedRows(this.crudRow, associationAttributes);
        //     });
        // }
    }

    onRowUnselect(event) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = true;
        //this.selectedRow = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }

    private transformAttributes(rowArray: Array<IGenericEntity>): Array<IGenericEntity> {
        rowArray.forEach(row => {
            row.partName = (row.part ? row.part.name : '');
        });
        return rowArray;
    }

    /*
    Change component and componentHistory fields withDataTypeEnum.Date type to date and set time to zero
    */
    private setRowArrayDateFields(rowArray: Array<IGenericEntity>, componentFieldAttributesArray: Array<FieldAttributes>,
        componentHistoryFieldAttributesArray: Array<FieldAttributes>) {
        ComponentHelper.setRowArrayDateFields(rowArray, componentFieldAttributesArray);
        rowArray.forEach(row => {
            ComponentHelper.setRowArrayDateFields(row.componentHistorySet, componentHistoryFieldAttributesArray);
        });
    }
}
