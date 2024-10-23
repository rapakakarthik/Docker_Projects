import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

  transform(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
    // if (/\<.*?\>/.test(html)) {
    //   return 'No Description Available';
    // } else {
    //   return html;
    // }
  }

}
