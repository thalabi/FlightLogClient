import { Component, OnInit } from '@angular/core';
import { MakeModel } from '../domain/make-model';
import { FlightLogServiceService } from '../flight-log-service.service';
import { MakeModelResponse } from '../response/make-model-response';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudEnum } from '../crud-enum';

@Component({
    selector: 'app-make-model-crud',
    templateUrl: './make-model-crud.component.html',
    styleUrls: ['./make-model-crud.component.css']
})
export class MakeModelCrudComponent implements OnInit {

    makeModelArray: Array<MakeModel>;
    selectedMakeModel: MakeModel;
    crudMakeModel: MakeModel;
    makeModelResponse: MakeModelResponse;
    makeModel: MakeModel;

    makeModelForm: FormGroup;
    
    displayDialog: boolean;

    crudMode: CrudEnum;
    modifyAndDeleteButtonsDisable: boolean = true;

    constructor(private formBuilder: FormBuilder, private flightLogService: FlightLogServiceService) {
        this.createForm();
    }

    ngOnInit() {
        this.getMakeModels();
        this.makeModel = new MakeModel();
    }

    createForm() {
        this.makeModelForm = this.formBuilder.group({
            name: [{value: ''}, Validators.required ]
        });
    
    }
    onRowSelect(event) {
        this.modifyAndDeleteButtonsDisable = false;
        this.crudMakeModel = Object.assign({}, this.selectedMakeModel);
    }

    showDialog(crudMode: string) {
        this.displayDialog = true;
        this.crudMode = CrudEnum[crudMode];
        console.log('this.crudMode', this.crudMode);
        if (this.crudMode == 'Add') {
            this.makeModelForm.setValue({name: ''});
        } else {
            this.makeModelForm.setValue({name: this.crudMakeModel.name});
        }
        switch (this.crudMode) {
            case CrudEnum.Add:
                this.makeModelForm.setValue({name: ''});
                this.makeModelForm.get('name').enable();
                break;
            case CrudEnum.Update:
                this.makeModelForm.setValue({name: this.crudMakeModel.name});
                this.makeModelForm.get('name').enable();
                break;
            case CrudEnum.Delete:
                this.makeModelForm.setValue({name: this.crudMakeModel.name});
                this.makeModelForm.get('name').disable();
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
    }

    onSubmit() {
        const makeModelFormModel = this.makeModelForm.value;
        console.log('this.makeModelForm.value', this.makeModelForm.value);
        console.log('makeModelFormModel', makeModelFormModel);
        console.log('name', this.makeModelForm.get('name').value);
        switch (this.crudMode) {
            case CrudEnum.Add:
                this.crudMakeModel = new MakeModel();
                this.crudMakeModel.name = this.makeModelForm.get('name').value;
                this.flightLogService.addMakeModel(this.crudMakeModel).subscribe({
                    next: savedMakeModel => {
                        console.log('savedMakeModel', savedMakeModel);
                    },
                    error: error => {
                        console.error('flightLogService.saveMakeModel() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });

                break;
            case CrudEnum.Update:
                this.crudMakeModel.name = this.makeModelForm.get('name').value;
                this.flightLogService.updateMakeModel(this.crudMakeModel).subscribe({
                    next: savedMakeModel => {
                        console.log('updatedMakeModel', savedMakeModel);
                    },
                    error: error => {
                        console.error('flightLogService.updateMakeModel() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.Delete:
                this.flightLogService.deleteMakeModel(this.selectedMakeModel).subscribe({
                    next: savedMakeModel => {
                        console.log('deleted makeModel', this.selectedMakeModel);
                    },
                    error: error => {
                        console.error('makeModelService.saveMakeModel() returned error: ', error);
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
        this.getMakeModels();
        this.resetDialoForm();
    }
    private resetDialoForm() {
        this.makeModelForm.reset();
        this.displayDialog = false;
        this.selectedMakeModel = new MakeModel();
    }

    onCancel() {
        this.resetDialoForm();
        this.modifyAndDeleteButtonsDisable = true;
    }
    //
    private getMakeModels() {
        this.flightLogService.getAllMakeModel2()
            .subscribe({
                next: makeModelResponse => {
                    console.log('makeModelResponse', makeModelResponse);
                    this.makeModelResponse = makeModelResponse;
                    console.log('this.makeModelResponse', this.makeModelResponse);
                    this.makeModelArray = this.makeModelResponse._embedded.makeModels;
                    // this.flightLogArray.forEach(flightLog => {
                    //     flightLog.airportFrom = new Airport();
                    //     flightLog.airportFrom.identifier = flightLog.routeFrom;
                    // })
                    console.log('this.makeModelArray', this.makeModelArray);
            }});
}
    
}
