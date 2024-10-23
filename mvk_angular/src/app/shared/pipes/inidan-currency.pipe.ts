import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inidanCurrency'
})
export class InidanCurrencyPipe implements PipeTransform {

  transform(value: string): string {
    let parsedInt = parseInt(value);
    if(isNaN(parsedInt)) return value;
    let inr: string = parsedInt.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR'
    })
    return inr;
  }

}
