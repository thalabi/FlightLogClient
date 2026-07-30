import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem, SharedModule } from 'primeng/api';
import { GenericEntityService } from '../../service/generic-entity.service';
import { IGenericEntityResponse } from '../../response/i-generic-entity-response';
import { MakeModel } from '../../domain/make-model';
import { Pilot } from '../../domain/pilot';
import { Registration } from '../../domain/registration';
import { FlightLogServiceService } from '../../service/flight-log-service.service';
import { Airport } from '../../domain/airport';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlightLogHelper } from '../flight-log-table-helper';
import { CrudEnum } from '../../crud-enum';
import { FlightLog } from '../../domain/flight-log';

@Component({
    selector: 'app-flight-log-form',
    imports: [CommonModule, ReactiveFormsModule, CalendarModule, DropdownModule, AutoCompleteModule],
    templateUrl: './flight-log-form.component.html',
    styleUrls: ['./flight-log-form.component.css']
})
export class FlightLogFormComponent implements OnInit, OnChanges {

    @Input() crudMode!: CrudEnum | null;
    @Input() flightLog!: FlightLog;

    @Output() formSubmitted = new EventEmitter<FlightLog>();
    @Output() formCancelled = new EventEmitter();

    flightLogForm: FormGroup;
    modifyAndDeleteButtonsDisable: boolean = true;

    makeModelSelectItemArray: Array<SelectItem> = [];
    registrationSelectItemArray: Array<SelectItem> = [];
    pilotSelectItemArray: Array<SelectItem> = [];

    filteredAirportArray: Array<Airport> = [];

    constructor(formBuilder: FormBuilder, private genericEntityService: GenericEntityService, private flightLogService: FlightLogServiceService) {
        this.flightLogForm = FlightLogHelper.createForm(formBuilder);
    }

    ngOnInit() {
        console.log('FlightLogFormComponent ngOnInit()')
        this.getMakeModels()
        this.getRegistrations()
        this.getPilots()
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('values changed, changes', changes)
        if (this.crudMode) {
            this.updateForm()
        }
    }

    private updateForm() {
        switch (this.crudMode) {
            case CrudEnum.ADD:
                console.log('this.flightLog', this.flightLog)
                if (Object.keys(this.flightLog).length === 0) {
                    this.flightLogForm.reset();
                    this.flightLogForm.get('flightDate')?.setValue(new Date());
                    this.flightLogForm.get('makeModel')?.setValue('PA-28-181');
                    this.flightLogForm.get('registration')?.setValue('C-GQGD');
                    this.flightLogForm.get('pic')?.setValue('Self');
                    let cyooAirport: Airport = {} as Airport
                    cyooAirport.identifier = 'CYOO';
                    this.flightLogForm.get('fromAirport')?.setValue(cyooAirport);
                    this.flightLogForm.get('toAirport')?.setValue(cyooAirport);
                    this.flightLogForm.get('remarks')?.setValue('VFR - ');
                } else {
                    FlightLogHelper.copyToForm(this.flightLog, this.flightLogForm);
                }
                this.flightLogForm.enable()
                break;
            case CrudEnum.UPDATE:
                FlightLogHelper.copyToForm(this.flightLog, this.flightLogForm);
                this.flightLogForm.enable()
                break;
            case CrudEnum.DELETE:
                FlightLogHelper.copyToForm(this.flightLog, this.flightLogForm);
                this.flightLogForm.disable()
                break;
            default:
                console.error('this.crudMode is invalid. this.crudMode: ' + this.crudMode);
        }

    }
    private getMakeModels() {
        this.genericEntityService.getAllGenericEntity('makeModel').subscribe({
            next: data => {
                let makeModelResponse: IGenericEntityResponse = data;
                this.makeModelSelectItemArray = new Array<SelectItem>();
                makeModelResponse['_embedded']['makeModels'].forEach((makeModel: MakeModel) => {
                    this.makeModelSelectItemArray.push({ label: makeModel.makeModel, value: makeModel.makeModel });
                });
            }
        });
    }

    private getRegistrations() {
        this.genericEntityService.getAllGenericEntity('registration').subscribe(data => {
            console.log('data', data);
            let registrationResponse: IGenericEntityResponse = data;
            console.log('registrationResponse', registrationResponse);
            this.registrationSelectItemArray = new Array<SelectItem>();
            registrationResponse['_embedded']['registrations'].forEach((registration: Registration) => {
                this.registrationSelectItemArray.push({ label: registration.registration, value: registration.registration });
            });
        });
    }

    private getPilots() {
        this.genericEntityService.getAllGenericEntity('pilot').subscribe(data => {
            console.log('data', data);
            let pilotResponse: IGenericEntityResponse = data;
            console.log('pilotResponse', pilotResponse);
            this.pilotSelectItemArray = new Array<SelectItem>();
            pilotResponse['_embedded']['pilots'].forEach((pilot: Pilot) => {
                this.pilotSelectItemArray.push({ label: pilot.pilot, value: pilot.pilot });
            });
        });
    }

    searchAirport(event: { query: string; }) {
        this.flightLogService.getAirportByIdentifierOrName(event.query, event.query).subscribe({
            next: airportArray => {
                this.filteredAirportArray = airportArray;
            }
        });
    }

    onSubmit() {
        console.log('this.flightLogForm', this.flightLogForm)
        FlightLogHelper.copyFromForm(this.flightLogForm, this.flightLog);
        console.log('this.flightLog', this.flightLog)
        console.log('this.flightLog.remarks', this.flightLog.remarks)
        console.log('isFrozen:', Object.isFrozen(this.flightLog));
        this.formSubmitted.emit(this.flightLog)
    }
    onCancel() {
        // this.resetDialoForm();
        // this.displayDialog = false;
        this.formCancelled.emit()
    }
    private resetDialoForm() {
        this.flightLogForm.reset();
        // this.selectedFlightLogTotalsV = {} as IFlightLogTotalsV;
        // this.fromAirport = {} as Airport;
        // this.toAirport = {} as Airport;
    }

}
