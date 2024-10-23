import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {

  private regex: RegExp = new RegExp(/[^a-zA-Z0-9 ]/g);
  
  constructor() { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initalValue = event.target.value;
    event.target.value = initalValue.replace(this.regex, '');
    if (initalValue !== event.target.value) {
      event.stopPropagation();
    }
  }

}
