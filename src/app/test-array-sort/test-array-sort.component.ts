import { Component, OnInit } from '@angular/core';
import { Registration } from '../domain/registration';
import { RegistrationResponse } from '../response/registration-response';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudEnum } from '../crud-enum';
import { FlightLogServiceService } from '../flight-log-service.service';

@Component({
    selector: 'app-test-array-sort',
    templateUrl: './test-array-sort.component.html',
    styleUrls: ['./test-array-sort.component.css']
})
export class TestArraySortComponent implements OnInit {

    registrationArray: Array<Registration>;
    selectedRegistration: Registration;
    crudRegistration: Registration;
    registrationResponse: RegistrationResponse;
    registration: Registration;

    registrationForm: FormGroup;
    
    displayDialog: boolean;

    crudMode: CrudEnum;
    modifyAndDeleteButtonsDisable: boolean = true;

    constructor(private formBuilder: FormBuilder, private flightLogService: FlightLogServiceService) {
        this.createForm();
    }

    ngOnInit() {
        this.getRegistrations();
        this.registration = new Registration();
    }
    createForm() {
        this.registrationForm = this.formBuilder.group({
            name: [{value: ''}, Validators.required ]
        });
    }
    
    onRowSelect(event) {
        this.modifyAndDeleteButtonsDisable = false;
        this.crudRegistration = Object.assign({}, this.selectedRegistration);
    }

    showDialog(crudMode: string) {
        this.displayDialog = true;
        this.crudMode = CrudEnum[crudMode];
        console.log('this.crudMode', this.crudMode);
        switch (this.crudMode) {
            case CrudEnum.Add:
                this.registrationForm.setValue({name: ''});
                this.registrationForm.get('name').enable();
                break;
            case CrudEnum.Update:
                this.registrationForm.setValue({name: this.crudRegistration.name});
                this.registrationForm.get('name').enable();
                break;
            case CrudEnum.Delete:
                this.registrationForm.setValue({name: this.crudRegistration.name});
                this.registrationForm.get('name').disable();
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }
    }

    onSubmit() {
        const registrationFormModel = this.registrationForm.value;
        console.log('this.registrationForm.value', this.registrationForm.value);
        console.log('registrationFormModel', registrationFormModel);
        console.log('name', this.registrationForm.get('name').value);
        switch (this.crudMode) {
            case CrudEnum.Add:
                this.crudRegistration = new Registration();
                this.crudRegistration.name = this.registrationForm.get('name').value;
                this.flightLogService.addRegistration(this.crudRegistration).subscribe({
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
                this.crudRegistration.name = this.registrationForm.get('name').value;
                this.flightLogService.updateRegistration(this.crudRegistration).subscribe({
                    next: savedRegistration => {
                        console.log('updatedRegistration', savedRegistration);
                    },
                    error: error => {
                        console.error('flightLogService.updateRegistration() returned error: ', error);
                        //this.messageService.error(error);
                    },
                    complete: () => {
                        this.afterCrud();
                    }
                });
                break;
            case CrudEnum.Delete:
                this.flightLogService.deleteRegistration(this.selectedRegistration).subscribe({
                    next: savedRegistration => {
                        console.log('deleted registration', this.selectedRegistration);
                    },
                    error: error => {
                        console.error('registrationService.saveRegistration() returned error: ', error);
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
        this.getRegistrations();
        this.resetDialoForm();
    }
    private resetDialoForm() {
        this.registrationForm.reset();
        this.displayDialog = false;
        this.selectedRegistration = new Registration();
    }

    onCancel() {
        this.resetDialoForm();
        this.modifyAndDeleteButtonsDisable = true;
    }
    //
    private getRegistrations() {
        this.flightLogService.getAllRegistration()
            .subscribe({
                next: (registrationResponse: RegistrationResponse) => {
                    this.registrationResponse = registrationResponse;
                    console.log('this.registrationResponse', this.registrationResponse);
                    this.registrationArray = this.registrationResponse._embedded.registrations;
                    console.log('this.registrationArray', this.registrationArray);
            }});
    }
    

}
