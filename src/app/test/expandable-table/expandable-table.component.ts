import { Component, OnInit } from '@angular/core';
import { GenericEntityService } from '../../service/generic-entity.service';
import { IGenericEntity } from '../../domain/i-gerneric-entity';
import { HalResponsePage } from '../../hal/hal-response-page';
import { HalResponseLinks } from '../../hal/hal-response-links';
import { MyMessageService } from '../../message/mymessage.service';
import { CustomErrorHandler } from '../../custom-error-handler';
import { LazyLoadEvent } from 'primeng/primeng';
import { ComponentHelper } from '../../util/ComponentHelper';
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
import { FieldAffinityEnum } from '../../config/FieldAffinityEnum';
import { Observable } from 'rxjs';
import { IGenericEntityResponse } from '../../response/i-generic-entity-response';
import { HttpErrorResponse } from '@angular/common/http';
import { AircraftComponentService } from '../../service/aircraft-component.service';
import { ComponentRequest } from '../../domain/component-request';

@Component({
    selector: 'app-expandable-table',
    templateUrl: './expandable-table.component.html',
    styleUrls: ['./expandable-table.component.css']
})
export class ExpandableTableComponent implements OnInit {

    rowArray: Array<IGenericEntity>;
    partRowArray: Array<IGenericEntity>;
    selectedRow: IGenericEntity;
    selectedAssociatedPartRow: IGenericEntity;
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
    componentEntityFields: Array<FieldAttributes>; // is componentFields minus part and partName fields
    componentHistoryFields: Array<FieldAttributes>;

    partFieldAssocitaion: AssociationAttributes;
    partField: FieldAttributes;

    uiComponentEnum = UiComponentEnum; // Used in html to refere to enum

    hasWritePermission: boolean = false;

    constructor(private genericEntityService: GenericEntityService, private aircraftComponentService: AircraftComponentService, private messageService: MyMessageService,
        private sessionDataService: SessionDataService) { }

    ngOnInit() {
        this.messageService.clear();
        this.rowArray = [];
        this.page = new HalResponsePage();
        let includeInBothComponents: Array<FieldAffinityEnum> = [FieldAffinityEnum.DATA_TABLE, FieldAffinityEnum.TEMPLATE_FORM];
        let allFieldAffinities: Array<FieldAffinityEnum> = [FieldAffinityEnum.DATA_TABLE, FieldAffinityEnum.TEMPLATE_FORM, FieldAffinityEnum.ENTITY];

        this.partFieldAssocitaion =
            {associationTableName: 'part', associationPropertyName: 'part', orderByColumns: ['name'],
                associationTypeEnum: AssociationTypeEnum.MANY_TO_ONE, propertyAsName: 'name', mandatory: true, optionsArray: null};
        this.partField = {columnName: 'part', dataType: DataTypeEnum.STRING, mandatory: false,
            header: 'Part', uiComponentType: UiComponentEnum.DROPDOWN, fieldAffinity: [FieldAffinityEnum.TEMPLATE_FORM], associationAttributes: this.partFieldAssocitaion};

        // this contains all fields whether in datatable, input form or db entity
        this.componentFields = [
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: true, header: 'Name',
                uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '6rem'}, fieldAffinity: allFieldAffinities},
            {columnName: 'description', dataType: DataTypeEnum.STRING, mandatory: false, header: 'Description',
                uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '6rem'}, fieldAffinity: allFieldAffinities},
            {columnName: 'partName', dataType: DataTypeEnum.STRING, mandatory: false, header: 'Part',
                uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '6rem'}, fieldAffinity: [FieldAffinityEnum.DATA_TABLE]},
            this.partField,
            {columnName: 'workPerformed', dataType: DataTypeEnum.STRING, mandatory: true, header: 'Work Prfrmd',
                uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '6rem'}, fieldAffinity: allFieldAffinities},
            {columnName: 'datePerformed', dataType: DataTypeEnum.DATE, mandatory: true, header: 'Dt Prfrmd',
                headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '4rem'}, fieldAffinity: allFieldAffinities},
            {columnName: 'hoursPerformed', dataType: DataTypeEnum.NUMBER, mandatory: false, header: 'Hrs Prfrmd',
                uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '4.5rem'}, filterStyle: {width: '3rem'}, fieldAffinity: allFieldAffinities},
            {columnName: 'dateDue', dataType: DataTypeEnum.DATE, mandatory: false, header: 'Dt Due',
                headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '4rem'}, fieldAffinity: allFieldAffinities},
            {columnName: 'hoursDue', dataType: DataTypeEnum.NUMBER, mandatory: false, header: 'Hrs Due',
                uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '4.5rem'}, filterStyle: {width: '3rem'}, fieldAffinity: allFieldAffinities}
            ];

        this.componentDataTableFields = this.componentFields.filter(fieldAttributes => fieldAttributes.fieldAffinity.includes(FieldAffinityEnum.DATA_TABLE));
    
        this.componentFormFields = this.componentFields.filter(fieldAttributes => fieldAttributes.fieldAffinity.includes(FieldAffinityEnum.TEMPLATE_FORM));
        this.componentEntityFields = this.componentFields.filter(fieldAttributes => fieldAttributes.fieldAffinity.includes(FieldAffinityEnum.ENTITY));
        this.componentEntityFields.forEach(fieldAttribute => console.log('entity column name: %s', fieldAttribute.columnName));
        //this.componentFormFields.push({columnName: 'part', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 9, header: 'Part', uiComponentType: UiComponentEnum.DROPDOWN});

        this.componentHistoryFields = [
            {columnName: 'workPerformed', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 4, header: 'Work Performed', uiComponentType: UiComponentEnum.TEXT, textAreaRows: 4, textAreaColumns: 30, fieldAffinity: [FieldAffinityEnum.DATA_TABLE]},
            {columnName: 'datePerformed', dataType: DataTypeEnum.DATE, mandatory: true, orderNumber: 5, header: 'Date Performed', headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'}, fieldAffinity: [FieldAffinityEnum.DATA_TABLE]},
            {columnName: 'hoursPerformed', dataType: DataTypeEnum.NUMBER, mandatory: true, orderNumber: 6, header: 'Hours Performed', uiComponentType: UiComponentEnum.TEXT, fieldAffinity: [FieldAffinityEnum.DATA_TABLE]}
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
                if (fieldAttributes.columnName === 'part') {
                    control.patchValue(this.selectedAssociatedPartRow);
                } else {
                    console.log('his.componentRow[fieldAttributes.columnName]: ', this.componentRow[fieldAttributes.columnName]);
                    control.patchValue(this.componentRow[fieldAttributes.columnName]);
                }
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
                    //this.setRowArrayDateFields(this.rowArray, this.componentFields, this.componentHistoryFields);
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
                        console.log('fetchAssosciatedRows() rowResponse of associated rows of %o: %o', crudRow._links.self, rowResponse);
                        this.selectedAssociatedPartRow = rowResponse;
                        console.log('fetchAssosciatedRows() this.selectedAssociatedPartRow: ', this.selectedAssociatedPartRow);
                    },
                    error: error => {
                        let httpErrorResponse: HttpErrorResponse = error;
                        console.error(httpErrorResponse);
                        if (httpErrorResponse.status == 404) {
                            this.selectedAssociatedPartRow = null;
                        } else {
                            this.messageService.error(httpErrorResponse.error);
                        }
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
        console.log('this.componentRow: %o', this.componentRow);
        this.fetchAssosciatedRows(this.componentRow, this.partFieldAssocitaion);
    }

    onRowUnselect(event) {
        console.log(event);
        this.modifyAndDeleteButtonsDisable = true;
        //this.selectedRow = new FlightLog(); // This a hack. If don't init selectedFlightLog, dialog will produce exception
    }

    onCancel() {
        this.resetDialoForm();
        this.modifyAndDeleteButtonsDisable = true;
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
                componentRequest.name =this.componentForm.controls['name'].value;
                componentRequest.partUri = this.componentForm.controls['part'].value._links.part.href;
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
                // this.componentRow = <IGenericEntity>{};
                // this.componentEntityFields.forEach(fieldAttributes => {
                //     this.componentRow[fieldAttributes.columnName] = this.componentForm.controls[fieldAttributes.columnName].value;
                // });
                // this.componentRow.deleted = false;
                // console.log("this.componentRow: %o", this.componentRow);
                // let addGenericEntityAndAssociation$: Observable<IGenericEntityResponse> = this.genericEntityService.addGenericEntity(this.COMPONENT_TABLE_NAME, this.componentRow)
                //     .concatMap(savedSingleGenericEntityResponse => {
                //         if (this.componentForm.controls['part'].value) {
                //             return this.genericEntityService.updateAssociationGenericEntity(savedSingleGenericEntityResponse, 'part', [this.componentForm.controls['part'].value]);
                //         } else {
                //             return Observable.of<IGenericEntityResponse>(savedSingleGenericEntityResponse);
                //         }
                //     });
                // addGenericEntityAndAssociation$.subscribe({
                //     next: savedTwoColumnEntity => {
                //         console.log('savedTwoColumnEntity', savedTwoColumnEntity);
                //     },
                //     error: error => {
                //         console.error('genericEntityService.updateAssociationGenericEntity returned error: ', error);
                //         this.messageService.error(error);
                //     },
                //     complete: () => {
                //         this.afterCrud();
                //     }
                // });

                
                // break;
            case CrudEnum.UPDATE:
                // delete properties
                delete this.componentRow.part;
                delete this.componentRow.partName;
                delete this.componentRow.componentHistorySet;
                // this.componentEntityFields.forEach(fieldAttributes => {
                //     this.componentRow[fieldAttributes.columnName] = this.componentForm.controls[fieldAttributes.columnName].value;
                // });
                // // this.setRowDateFields(this.componentRow, this.fieldAttributesArray);
                // console.log("this.componentRow: %o", this.componentRow);

                // let updateGenericEntityAndAssociation$: Observable<IGenericEntityResponse> = this.genericEntityService.updateGenericEntity(this.componentRow)
                //     .concatMap(savedSingleGenericEntityResponse => {
                //         if (this.componentForm.controls['part'].value) {
                //             return this.genericEntityService.updateAssociationGenericEntity(savedSingleGenericEntityResponse, 'part', [this.componentForm.controls['part'].value]);
                //         } else {
                //             return Observable.of<IGenericEntityResponse>(savedSingleGenericEntityResponse);
                //         }
                //     });
                // updateGenericEntityAndAssociation$.subscribe({
                //     next: savedRow => {
                //         console.log('savedRow', savedRow);
                //     },
                //     error: error => {
                //         console.error('enericEntityService.updateAssociationGenericEntity returned error: ', error);
                //     },
                //     complete: () => {
                //         this.afterCrud();
                //     }
                // });
                componentRequest.componentUri = this.selectedRow._links.self.href;
                componentRequest.name =this.componentForm.controls['name'].value;
                componentRequest.partUri = this.componentForm.controls['part'].value._links.part.href;
                componentRequest.createHistoryRecord = false;
                console.log("engineComponent: %o", componentRequest);
                this.aircraftComponentService.modifyComponent(componentRequest).subscribe({
                    next: savedRow => {
                        console.log('modifyComponent');
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
            ComponentHelper.buildSearchString(this.savedLazyLoadEvent, this.componentFields.map(field => field.columnName)),
            this.SORT_COLUMNS);

        this.resetDialoForm();
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
   /*  should rename to something like set component and component history date fields */
    private setRowArrayDateFields(rowArray: Array<IGenericEntity>, componentFieldAttributesArray: Array<FieldAttributes>,
        componentHistoryFieldAttributesArray: Array<FieldAttributes>) {
        ComponentHelper.setRowArrayDateFields(rowArray, componentFieldAttributesArray);
        rowArray.forEach(row => {
            ComponentHelper.setRowArrayDateFields(row.componentHistorySet, componentHistoryFieldAttributesArray);
        });
    }

    private resetDialoForm() {
        this.componentForm.reset();
        this.displayDialog = false;
        this.selectedRow = <IGenericEntity>{};
    }
    

}
