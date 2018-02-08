import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
    selector: '[regexValidator]',
    providers: [{provide: NG_VALIDATORS, useExisting: RegexValidatorDirective, multi: true}]
})
export class RegexValidatorDirective implements Validator {
    @Input('regexValidator') regexValidator: string;

    constructor() { console.log('RegexValidatorDirective') }

    validate(control: AbstractControl): {[key: string]: any} {
        console.log('validate');
        console.log('regex', this.regexValidator);
        return this.regexValidator ? this.regexValidatorF(new RegExp(this.regexValidator, 'i'))(control)
        : null;
    }

    regexValidatorF(nameRe: RegExp): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            console.log('control.value', control.value);
            // if input is null, then consider it valid
            if (control.value == null) {
                return null;
            }
            // test
            // let re: RegExp = new RegExp('^\\d*(\\.\\d{0,1}){0,1}$');
            // let r: boolean = re.test('12.12');
            // console.log('r', r);
            const expressionValid = nameRe.test(control.value);
            // test
            console.log('expressionValid', expressionValid);
            return expressionValid ? null : {'regexValidator': {value: control.value}};
        }
    }
}
