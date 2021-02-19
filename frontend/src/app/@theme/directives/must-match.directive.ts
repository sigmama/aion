import { Directive, Input } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { mustMatch } from './must-match.validator';

@Directive({
  selector: '[ngxMustMatch]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true },
  ],
})
export class MustMatchDirective implements Validator {
  @Input('ngxMustMatch') mustMatch: string[] = [];

  validate(formGroup: FormGroup): ValidationErrors {
    return mustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }
}
