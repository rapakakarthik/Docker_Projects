import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRejectSpecialCharacters]',
})
export class RejectSpecialCharactersDirective {

  private regex: RegExp = new RegExp(/[^a-zA-Z \-_.&,]/g);
  
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
