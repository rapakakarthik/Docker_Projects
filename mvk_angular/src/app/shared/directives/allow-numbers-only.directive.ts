import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowNumbersOnly]'
})
export class AllowNumbersOnlyDirective {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Allow navigation and control keys
    if (['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab'].includes(event.key)) {
      return;  // Allow default behavior for these keys
    }
    // Check if the key is a number
    if (!event.key.match(/[0-9]/)) {
      event.preventDefault();  // Prevent the keypress if it's not a number
    }
  }


  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const sanitizedValue = inputElement.value.replace(/[^0-9]/g, '');
    if (sanitizedValue !== inputElement.value) {
      inputElement.value = sanitizedValue; // Update value to allow only numbers
    }
  }
}
