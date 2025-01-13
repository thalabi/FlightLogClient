import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'password',
    standalone: true
})
export class PasswordMaskPipe implements PipeTransform {
    transform(phrase: string): string {    
        return '******';
    }
}