import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'text'
})
export class TextPipe implements PipeTransform {

  transform(text: string, length?: number): any {
    if (!text)
      return null;
    let actualLength = (length) ? length : 50;
    return text.substring(0,actualLength) + '...'
    

  }

}
