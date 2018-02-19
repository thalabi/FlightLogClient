import { Component, OnInit } from '@angular/core';
import { Pilot } from '../domain/pilot';
import { PilotResponse } from '../response/pilot-response';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudEnum } from '../crud-enum';
import { FlightLogServiceService } from '../flight-log-service.service';

@Component({
    selector: 'app-pilot-crud',
    templateUrl: './pilot-crud.component.html',
    styleUrls: ['./pilot-crud.component.css']
})
export class PilotCrudComponent implements OnInit {

    pilotArray: Array<Pilot>;
    selectedPilot: Pilot;
    crudPilot: Pilot;
    pilotResponse: PilotResponse;
    pilot: Pilot;

    pilotForm: FormGroup;
    
    displayDialog: boolean;

    crudMode: CrudEnum;
    modifyAndDeleteButtonsDisable: boolean = true;

    constructor(private formBuilder: FormBuilder, private flightLogService: FlightLogServiceService) {
        this.createForm();
    }

    ngOnInit() {
        this.getPilots();
        this.pilot = new Pilot();
    }
    createForm() {
        this.pilotForm = this.formBuilder.group({
            name: [{value: ''}, Validators.required ]
        });
    }
    
    onRowSelect(event) {
        this.modifyAndDeleteButtonsDisable = false;
        this.crudPilot = Object.assign({}, this.selectedPilot);
    }

    showDialog(crudMode: string) {
        this.displayDialog = true;
        this.crudMode = CrudEnum[crudMode];
        console.log('this.crudMode', this.crudMode);
        switch (this.crudMode) {
            case CrudEnum.Add:
                this.pilotForm.setValue({name: ''});
                this.pilotForm.get('name').enable();
                break;
            case CrudEnum.Update:
                this.pilotForm.setValue({name: this.crudPilot.name});
                this.pilotForm.get('name').enable();
                break;
            case CrudEnum.Delete:
                this.pilotForm.setValue({name: this.crudPilot.name});
                this.pilotForm.get('name').disable();
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
    }

    onSubmit() {
        const pilotFormModel = this.pilotForm.value;
        console.log('this.pilotForm.value', this.pilotForm.value);
        console.log('pilotFormModel', pilotFormModel);
        console.log('name', this.pilotForm.get('name').value);
        switch (this.crudMode) {
            case CrudEnum.Add:
                this.crudPilot = new Pilot();
                this.crudPilot.name = this.pilotForm.get('name').value;
                this.flightLogService.addPilot(this.crudPilot).subscribe({
                    next: savedPilot => {
                        console.log('savedPilot', savedPilot);
                    },
                    error: error => {
                        console.error('flightLogService.savePilot() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });

                break;
            case CrudEnum.Update:
                this.crudPilot.name = this.pilotForm.get('name').value;
                this.flightLogService.updatePilot(this.crudPilot).subscribe({
                    next: savedPilot => {
                        console.log('updatedPilot', savedPilot);
                    },
                    error: error => {
                        console.error('flightLogService.updatePilot() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.Delete:
                this.flightLogService.deletePilot(this.selectedPilot).subscribe({
                    next: savedPilot => {
                        console.log('deleted pilot', this.selectedPilot);
                    },
                    error: error => {
                        console.error('pilotService.savePilot() returned error: ', error);
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
        this.getPilots();
        this.resetDialoForm();
    }
    private resetDialoForm() {
        this.pilotForm.reset();
        this.displayDialog = false;
        this.selectedPilot = new Pilot();
    }

    onCancel() {
        this.resetDialoForm();
        this.modifyAndDeleteButtonsDisable = true;
    }
    //
    private getPilots() {
        this.flightLogService.getAllPilot()
            .subscribe({
                next: pilotResponse => {
                    console.log('pilotResponse', pilotResponse);
                    this.pilotResponse = pilotResponse;
                    console.log('this.pilotResponse', this.pilotResponse);
                    this.pilotArray = this.pilotResponse._embedded.pilots;
                    console.log('this.pilotArray', this.pilotArray);
            }});
    }
    

}
