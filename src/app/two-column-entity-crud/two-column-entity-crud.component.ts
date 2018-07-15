import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { FlightLogServiceService } from '../service/flight-log-service.service';
import { IGenericEntity } from '../domain/i-gerneric-entity';
import { IGenericEntityResponse } from '../response/i-generic-entity-response';
import { CrudEnum } from '../crud-enum';
import { StringUtils } from '../string-utils';
import { CrudComponentConfig, FormAttributes, FieldAttributes } from '../config/crud-component-config';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-two-column-entity-crud',
    templateUrl: './two-column-entity-crud.component.html',
    styleUrls: ['./two-column-entity-crud.component.css']
})
export class TwoColumnEntityCrudComponent implements OnInit {

    rowArray: Array<IGenericEntity>;
    selectedRow: IGenericEntity;
    crudRow: IGenericEntity;
    rowResponse: IGenericEntityResponse;
    row: IGenericEntity;

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

    constructor(private formBuilder: FormBuilder, private flightLogService: FlightLogServiceService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.tableName = params['tableName'];

            //let se: CrudComponentConfig = new CrudComponentConfig();
            this.formAttributes = CrudComponentConfig.formConfig.get(this.tableName);
            this.fieldAttributesArray = this.formAttributes.fields;
            console.log('this.formAttributes', this.formAttributes);

            //this.column1 = 'eventDescription';//this.tableName;
            //this.columnName1 = this.fieldAttributesArray[0].columnName;
            console.log('tableName', this.tableName/*, 'sortColumnName', this.sortColumnName*/);
            this.getTwoColumnEntity(this.tableName, this.formAttributes.queryOrderByColumns);
            this.tableNameCapitalized = StringUtils.capitalize(this.tableName);
            this.createForm();
        });
        this.row = <IGenericEntity>{};
    }
    
    createForm() {
        this.crudForm = new FormGroup({});
        this.fieldAttributesArray.forEach(fieldAttributes => {
            this.crudForm.addControl(fieldAttributes.columnName, new FormControl());
        })
    }
    
    onRowSelect(event) {
        this.modifyAndDeleteButtonsDisable = false;
        this.crudRow = Object.assign({}, this.selectedRow);
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

                this.flightLogService.addTwoColumnEntity(this.tableName, this.crudRow).subscribe({
                    next: savedTwoColumnEntity => {
                        console.log('savedTwoColumnEntity', savedTwoColumnEntity);
                    },
                    error: error => {
                        console.error('flightLogService.addTwoColumnEntity() returned error: ', error);
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

                this.flightLogService.updateTwoColumnEntity(this.crudRow).subscribe({
                    next: savedRow => {
                        console.log('savedRow', savedRow);
                    },
                    error: error => {
                        console.error('flightLogService.updateTwoColumnEntity() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.Delete:
                this.flightLogService.deleteTwoColumnEntity(this.selectedRow).subscribe({
                    next: savedRow => {
                        console.log('deleted row', this.selectedRow);
                    },
                    error: error => {
                        console.error('flightLogService.deleteTwoColumnEntity() returned error: ', error);
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
        this.getTwoColumnEntity(this.tableName, this.formAttributes.queryOrderByColumns);
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
    
    private getTwoColumnEntity(tableName: string, queryOrderByColumns: Array<string>) {
        this.flightLogService.getGenericEntity(tableName, queryOrderByColumns[0]) 
            .subscribe({
                next: (twoEntityResponse: IGenericEntityResponse) => {
                    console.log('twoEntityResponse', twoEntityResponse);
                    this.rowArray = twoEntityResponse._embedded[this.tableName+'s'];
                    console.log('this.rowArray', this.rowArray);
                    this.setDateFields(this.rowArray, this.fieldAttributesArray);
            }});
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
