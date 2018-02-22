import { Component, OnInit } from '@angular/core';
import { FlightLogServiceService } from '../flight-log-service.service';
import { RegistrationResponse } from '../response/registration-response';
import { Registration } from '../domain/registration';

@Component({
    selector: 'app-test-array-sort',
    templateUrl: './test-array-sort.component.html',
    styleUrls: ['./test-array-sort.component.css']
})
export class TestArraySortComponent implements OnInit {

    registrationArray: Array<Registration>;
    registrationResponse: RegistrationResponse;

    constructor(private flightLogService: FlightLogServiceService) { }

    ngOnInit() {
        this.getRegistrations();
    }

    private getRegistrations() {
        //this.flightLogService.getAllRegistration()
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
