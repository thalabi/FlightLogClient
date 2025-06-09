import { FlightLog } from "../domain/flight-log";
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import { Airport } from "../domain/airport";
import { IFlightLogTotalsV } from "../response/IFlightLogTotalsV";
import { FlightLogPending } from "../domain/FlightLogPending";

const controlNames: Array<string> = ['flightDate', 'makeModel', 'registration', 'pic', 'coPilot', 'fromAirport', 'toAirport', 'remarks', 'dayDual', 'daySolo', 'nightDual', 'nightSolo', 'instrumentSimulated', 'instrumentFlightSim', 'xCountryDay', 'xCountryNight', 'instrumentImc', 'instrumentNoIfrAppr', 'tosLdgsDay', 'tosLdgsNight'];

function fieldNullOrZero(control: AbstractControl, controlName: string): boolean {
    return ! /* not */ control.get(controlName)?.value || control.get(controlName)?.value == 0;
}

function createDayOrNightValueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (fieldNullOrZero(control, 'dayDual') && fieldNullOrZero(control, 'daySolo') &&
            fieldNullOrZero(control, 'nightDual') && fieldNullOrZero(control, 'nightSolo')) {
            return { noDayOrNightValue: true };
        }
        return null;
    }
}

export const FlightLogHelper = {
    createForm(formBuilder: FormBuilder): FormGroup {
        return formBuilder.nonNullable.group({
            flightDate: ['', Validators.required],
            makeModel: ['', Validators.required],
            registration: [''],
            pic: ['', Validators.required],
            coPilot: [''],

            fromAirport: [{ value: {} as Airport }, Validators.required],
            toAirport: [{ value: {} as Airport }, Validators.required],

            remarks: [''],
            dayDual: [''],
            daySolo: [''],
            nightDual: [''],
            nightSolo: [''],
            instrumentSimulated: [''],
            instrumentFlightSim: [''],
            xCountryDay: [''],
            xCountryNight: [''],
            instrumentImc: [''],
            instrumentNoIfrAppr: [''],
            tosLdgsDay: [''],
            tosLdgsNight: ['']
        }, { validators: [createDayOrNightValueValidator()] });
    },
    copyFromFlightLogTotalsV(flightLogTotalsV: IFlightLogTotalsV): FlightLog {
        let flightLog: FlightLog = {} as FlightLog
        const href = flightLogTotalsV._links.flightLogTotalsV.href;
        flightLog.id = + href.substring(href.lastIndexOf('/') + 1)
        flightLog.flightDate = flightLogTotalsV.flightDate
        flightLog.makeModel = flightLogTotalsV.makeModel
        flightLog.registration = flightLogTotalsV.registration
        flightLog.pic = flightLogTotalsV.pic
        flightLog.coPilot = flightLogTotalsV.coPilot
        flightLog.routeFrom = flightLogTotalsV.routeFrom
        flightLog.routeTo = flightLogTotalsV.routeTo
        flightLog.remarks = flightLogTotalsV.remarks
        flightLog.dayDual = flightLogTotalsV.dayDual
        flightLog.daySolo = flightLogTotalsV.daySolo
        flightLog.nightDual = flightLogTotalsV.nightDual
        flightLog.nightSolo = flightLogTotalsV.nightSolo
        flightLog.instrumentSimulated = flightLogTotalsV.instrumentSimulated
        flightLog.instrumentFlightSim = flightLogTotalsV.instrumentFlightSim

        flightLog.xCountryDay = flightLogTotalsV.xCountryDay
        flightLog.xCountryNight = flightLogTotalsV.xCountryNight

        flightLog.instrumentImc = flightLogTotalsV.instrumentImc
        flightLog.instrumentNoIfrAppr = flightLogTotalsV.instrumentNoIfrAppr
        flightLog.tosLdgsDay = flightLogTotalsV.tosLdgsDay
        flightLog.tosLdgsNight = flightLogTotalsV.tosLdgsNight

        return flightLog
    },
    copyFromFlightLogPending(flightLogPending: FlightLogPending): FlightLog {
        let flightLog: FlightLog = {} as FlightLog
        flightLog.flightDate = flightLogPending.flightDate
        flightLog.makeModel = flightLogPending.makeModel
        flightLog.registration = flightLogPending.registration
        flightLog.pic = 'Self'
        flightLog.routeFrom = flightLogPending.routeFrom
        flightLog.routeTo = flightLogPending.routeTo
        flightLog.remarks = 'VFR - '
        flightLog.daySolo = flightLogPending.flightTime
        return flightLog
    },

    copyToForm(flightLog: FlightLog, flightLogForm: FormGroup) {
        console.log('flightLog', flightLog)
        flightLogForm.patchValue({ flightDate: flightLog.flightDate });
        flightLogForm.patchValue({ makeModel: flightLog.makeModel });
        flightLogForm.patchValue({ registration: flightLog.registration });
        flightLogForm.patchValue({ pic: flightLog.pic });
        flightLogForm.patchValue({ coPilot: flightLog.coPilot });
        let fromAirport: Airport = {} as Airport;
        fromAirport.identifier = flightLog.routeFrom;
        flightLogForm.patchValue({ fromAirport: fromAirport });
        let toAirport: Airport = {} as Airport;
        toAirport.identifier = flightLog.routeTo;
        flightLogForm.patchValue({ toAirport: toAirport });
        flightLogForm.patchValue({ remarks: flightLog.remarks });
        flightLogForm.patchValue({ dayDual: flightLog.dayDual });
        flightLogForm.patchValue({ daySolo: flightLog.daySolo });
        flightLogForm.patchValue({ nightDual: flightLog.nightDual });
        flightLogForm.patchValue({ nightSolo: flightLog.nightSolo });
        flightLogForm.patchValue({ instrumentSimulated: flightLog.instrumentSimulated });
        flightLogForm.patchValue({ instrumentFlightSim: flightLog.instrumentFlightSim });
        flightLogForm.patchValue({ xCountryDay: flightLog.xCountryDay });
        flightLogForm.patchValue({ xCountryNight: flightLog.xCountryNight });
        flightLogForm.patchValue({ instrumentImc: flightLog.instrumentImc });
        flightLogForm.patchValue({ instrumentNoIfrAppr: flightLog.instrumentNoIfrAppr });
        flightLogForm.patchValue({ tosLdgsDay: flightLog.tosLdgsDay });
        flightLogForm.patchValue({ tosLdgsNight: flightLog.tosLdgsNight });
        console.log('flightLogForm', flightLogForm);
    },

    copyFromForm(flightLogForm: FormGroup, flightLog: FlightLog) {
        flightLog.flightDate = flightLogForm.get('flightDate')?.value;
        flightLog.makeModel = flightLogForm.get('makeModel')?.value;
        flightLog.registration = flightLogForm.get('registration')?.value;
        flightLog.pic = flightLogForm.get('pic')?.value;
        flightLog.coPilot = flightLogForm.get('coPilot')?.value;
        let fromAirport: Airport = flightLogForm.get('fromAirport')?.value;
        flightLog.routeFrom = fromAirport.identifier;
        let toAirport: Airport = flightLogForm.get('toAirport')?.value;
        flightLog.routeTo = toAirport.identifier;
        flightLog.remarks = flightLogForm.get('remarks')?.value;
        flightLog.dayDual = flightLogForm.get('dayDual')?.value;
        flightLog.daySolo = flightLogForm.get('daySolo')?.value;
        flightLog.nightDual = flightLogForm.get('nightDual')?.value;
        flightLog.nightSolo = flightLogForm.get('nightSolo')?.value;
        flightLog.instrumentSimulated = flightLogForm.get('instrumentSimulated')?.value;
        flightLog.instrumentFlightSim = flightLogForm.get('instrumentFlightSim')?.value;
        flightLog.xCountryDay = flightLogForm.get('xCountryDay')?.value;
        flightLog.xCountryNight = flightLogForm.get('xCountryNight')?.value;
        flightLog.instrumentImc = flightLogForm.get('instrumentImc')?.value;
        flightLog.instrumentNoIfrAppr = flightLogForm.get('instrumentNoIfrAppr')?.value;
        flightLog.tosLdgsDay = flightLogForm.get('tosLdgsDay')?.value;
        flightLog.tosLdgsNight = flightLogForm.get('tosLdgsNight')?.value;
        console.log('flightLog: ', flightLog);
    },
    // enableForm(flightLogForm: FormGroup) {
    //     for (let controlName of controlNames) {
    //         flightLogForm.get(controlName)?.enable();
    //     }
    // },
    // disableForm(flightLogForm: FormGroup) {
    //     for (let controlName of controlNames) {
    //         flightLogForm.get(controlName)?.disable();
    //     }
    // }

}
