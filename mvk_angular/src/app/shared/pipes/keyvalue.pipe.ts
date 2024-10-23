import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyvalue'
})
export class KeyvaluePipe implements PipeTransform {

  transform(value: any): any {
    if (!value)
      return [];
    return Object.entries(value)
  }

}
