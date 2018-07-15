import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudEnum } from '../crud-enum';
import { FlightLogServiceService } from '../service/flight-log-service.service';
import { ActivatedRoute } from '@angular/router';
import { ISingleColumnEntity } from '../domain/i-single-column-entity';
import { ISingleColumnEntityResponse } from '../response/i-single-column-entity-response';
import { StringUtils } from '../string-utils';

@Component({
    selector: 'app-test-array-sort',
    templateUrl: './single-column-entity-crud.component.html',
    styleUrls: ['./single-column-entity-crud.component.css']
})
export class SingleColumnEntityCrudComponent implements OnInit {

    rowArray: Array<ISingleColumnEntity>;
    selectedRow: ISingleColumnEntity;
    crudRow: ISingleColumnEntity;
    rowResponse: ISingleColumnEntityResponse;
    row: ISingleColumnEntity;

    crudForm: FormGroup;
    
    displayDialog: boolean;

    crudMode: CrudEnum;
    modifyAndDeleteButtonsDisable: boolean = true;

    tableName: string;
    tableNameCapitalized: string;
    column1: string;

    constructor(private formBuilder: FormBuilder, private flightLogService: FlightLogServiceService, private route: ActivatedRoute) {
        this.createForm();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.tableName = params['tableName'];
            this.column1 = this.tableName;
            console.log('tableName', this.tableName);
            this.getSingleColumnEntity();
            this.tableNameCapitalized = StringUtils.capitalize(this.tableName);
        });
        this.row = <ISingleColumnEntity>{};
    }
    createForm() {
        this.crudForm = this.formBuilder.group({
            column1: [{value: ''}, Validators.required ]
        });
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
                this.crudForm.setValue({column1: ''});
                this.crudForm.get('column1').enable();
                break;
            case CrudEnum.Update:
                this.crudForm.setValue({column1: this.crudRow[this.column1]});
                this.crudForm.get('column1').enable();
                break;
            case CrudEnum.Delete:
                this.crudForm.setValue({column1: this.crudRow[this.column1]});
                this.crudForm.get('column1').disable();
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
    }

    onSubmit() {
        const crudFormModel = this.crudForm.value;
        console.log('this.crudForm.value', this.crudForm.value);
        console.log('crudFormModel', crudFormModel);
        console.log('column1', this.crudForm.get('column1').value);
        switch (this.crudMode) {
            case CrudEnum.Add:
                this.crudRow = <ISingleColumnEntity>{};
                this.crudRow[this.column1] = this.crudForm.get('column1').value;
                this.flightLogService.addSingleColumnEntity(this.tableName, this.crudRow).subscribe({
                    next: savedRegistration => {
                        console.log('savedRegistration', savedRegistration);
                    },
                    error: error => {
                        console.error('flightLogService.saveRegistration() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });

                break;
            case CrudEnum.Update:
                this.crudRow[this.column1] = this.crudForm.get('column1').value;
                this.flightLogService.updateSingleColumnEntity(this.crudRow).subscribe({
                    next: savedRow => {
                        console.log('savedRow', savedRow);
                    },
                    error: error => {
                        console.error('flightLogService.updateSingleColumnEntity() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.Delete:
                this.flightLogService.deleteSingleColumnEntity(this.selectedRow).subscribe({
                    next: savedRegistration => {
                        console.log('deleted row', this.selectedRow);
                    },
                    error: error => {
                        console.error('flightLogService.deleteSingleColumnEntity() returned error: ', error);
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
        this.getSingleColumnEntity();
        this.resetDialoForm();
    }
    private resetDialoForm() {
        this.crudForm.reset();
        this.displayDialog = false;
        this.selectedRow = <ISingleColumnEntity>{};
    }

    onCancel() {
        this.resetDialoForm();
        this.modifyAndDeleteButtonsDisable = true;
    }
    //
    private getSingleColumnEntity() {
        this.flightLogService.getAllSingleColumnEntity(this.tableName) //getAllRegistration()
            .subscribe({
                next: (singleEntityResponse: ISingleColumnEntityResponse) => {
                    console.log('singleEntityResponse', singleEntityResponse);
                    this.rowArray = singleEntityResponse._embedded[this.tableName+'s'];
                    console.log('this.rowArray', this.rowArray);
            }});
    }
}
