import { FlightLog } from "../domain/flight-log";
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { Airport } from "../domain/airport";

const controlNames: Array<string> = ['flightDate', 'makeModel', 'registration', 'pic', 'coPilot', 'fromAirport', 'toAirport', 'remarks', 'dayDual', 'daySolo', 'nightDual', 'nightSolo', 'instrumentSimulated', 'instrumentFlightSim', 'xcountryDay', 'xcountryNight', 'instrumentImc', 'instrumentNoIfrAppr', 'tosLdgsDay', 'tosLdgsNight'];

function fieldNullOrZero(control: AbstractControl, controlName: string): boolean {
    return ! /* not */ control.get(controlName).value || control.get(controlName).value == 0;
}
function validateForm(control: AbstractControl): {invalid: boolean} {
    console.log('validateForm running');
    if (fieldNullOrZero(control, 'dayDual') && fieldNullOrZero(control, 'daySolo') &&
        fieldNullOrZero(control, 'nightDual') && fieldNullOrZero(control, 'nightSolo')) {
        console.log('validateForm invalid');
        return {invalid: true};
    }
    return null;
}

export const FlightLogHelper = {
    createForm(formBuilder: FormBuilder): FormGroup {
        return formBuilder.group({
            flightDate: ['', Validators.required ],
            makeModel: ['', Validators.required ],
            registration: [''],
            pic: ['', Validators.required ],
            coPilot: [''],

            fromAirport: [{value: new Airport()}, Validators.required ],
            toAirport: [{value: new Airport()}, Validators.required ],

            remarks: [''],
            dayDual: [''],
            daySolo: [''],
            nightDual: [''],
            nightSolo: [''],
            instrumentSimulated: [''],
            instrumentFlightSim: [''],
            xcountryDay: [''],
            xcountryNight: [''],
            instrumentImc: [''],
            instrumentNoIfrAppr: [''],
            tosLdgsDay: [''],
            tosLdgsNight: ['']
        }, {validator: validateForm});
    },
    copyToForm(flightLog: FlightLog, flightLogForm: FormGroup) {
        flightLogForm.patchValue({flightDate: flightLog.flightDate});
        flightLogForm.patchValue({makeModel: flightLog.makeModel});
        flightLogForm.patchValue({registration: flightLog.registration});
        flightLogForm.patchValue({pic: flightLog.pic});
        flightLogForm.patchValue({coPilot: flightLog.coPilot});
        let fromAirport: Airport = new Airport();
        fromAirport.identifier = flightLog.routeFrom;
        flightLogForm.patchValue({fromAirport: fromAirport});
        let toAirport: Airport = new Airport();
        toAirport.identifier = flightLog.routeTo;
        flightLogForm.patchValue({toAirport: toAirport});
        flightLogForm.patchValue({remarks: flightLog.remarks});
        flightLogForm.patchValue({dayDual: flightLog.dayDual});
        flightLogForm.patchValue({daySolo: flightLog.daySolo});
        flightLogForm.patchValue({nightDual: flightLog.nightDual});
        flightLogForm.patchValue({nightSolo: flightLog.nightSolo});
        flightLogForm.patchValue({instrumentSimulated: flightLog.instrumentSimulated});
        flightLogForm.patchValue({instrumentFlightSim: flightLog.instrumentFlightSim});
        flightLogForm.patchValue({xcountryDay: flightLog.xcountryDay});
        flightLogForm.patchValue({xcountryNight: flightLog.xcountryNight});
        flightLogForm.patchValue({instrumentImc: flightLog.instrumentImc});
        flightLogForm.patchValue({instrumentNoIfrAppr: flightLog.instrumentNoIfrAppr});
        flightLogForm.patchValue({tosLdgsDay: flightLog.tosLdgsDay});
        flightLogForm.patchValue({tosLdgsNight: flightLog.tosLdgsNight});
        
        console.log(flightLogForm);
    },
    copyFromForm(flightLogForm: FormGroup, flightLog: FlightLog) {
        flightLog.flightDate = flightLogForm.get('flightDate').value;
        flightLog.makeModel = flightLogForm.get('makeModel').value;
        flightLog.registration = flightLogForm.get('registration').value;
        flightLog.pic = flightLogForm.get('pic').value;
        flightLog.coPilot = flightLogForm.get('coPilot').value;
        let fromAirport: Airport = flightLogForm.get('fromAirport').value;
        flightLog.routeFrom = fromAirport.identifier;
        let toAirport: Airport = flightLogForm.get('toAirport').value;
        flightLog.routeTo = toAirport.identifier;
        flightLog.remarks = flightLogForm.get('remarks').value;
        flightLog.dayDual = flightLogForm.get('dayDual').value;
        flightLog.daySolo = flightLogForm.get('daySolo').value;
        flightLog.nightDual = flightLogForm.get('nightDual').value;
        flightLog.nightSolo = flightLogForm.get('nightSolo').value;
        flightLog.instrumentSimulated = flightLogForm.get('instrumentSimulated').value;
        flightLog.instrumentFlightSim = flightLogForm.get('instrumentFlightSim').value;
        flightLog.xcountryDay = flightLogForm.get('xcountryDay').value;
        flightLog.xcountryNight = flightLogForm.get('xcountryNight').value;
        flightLog.instrumentImc = flightLogForm.get('instrumentImc').value;
        flightLog.instrumentNoIfrAppr = flightLogForm.get('instrumentNoIfrAppr').value;
        flightLog.tosLdgsDay = flightLogForm.get('tosLdgsDay').value;
        flightLog.tosLdgsNight = flightLogForm.get('tosLdgsNight').value;
        console.log('flightLog: ', flightLog);
    },
    enableForm(flightLogForm: FormGroup) {
        for (let controlName of controlNames) {
            flightLogForm.get(controlName).enable();
        }
    },
    disableForm(flightLogForm: FormGroup) {
        for (let controlName of controlNames) {
            flightLogForm.get(controlName).disable();
        }
    }
    
}
