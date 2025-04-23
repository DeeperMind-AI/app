import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categListPathFilter',
  standalone: true
})
export class CategListPathFilter implements PipeTransform {

  transform(values: any[], term:string): any[] {
    for (var reliv=0;reliv<values.length;reliv++) {
      if (!values[reliv].category ||  (values[reliv].category==null)) {
        values[reliv].category='/';
      }
    }
    return values.filter(v => (term && v.category && (v.category as string).toUpperCase() == term.toUpperCase()));
  }

}