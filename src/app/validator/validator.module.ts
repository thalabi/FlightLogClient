import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegexValidatorDirective } from './regex-validator.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RegexValidatorDirective],
  exports: [RegexValidatorDirective]
})
export class ValidatorModule { }
