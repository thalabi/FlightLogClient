import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'password' })
export class PasswordMaskPipe implements PipeTransform {
    transform(phrase: string) {    
        return '******';
    }
}