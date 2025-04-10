import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categListPathFilter',
  standalone: true
})
export class CategListPathFilter implements PipeTransform {

  transform(values: any[], term:string): any[] {
    console.log(term,values);
    return values.filter(v => term && v.category && (v.category as string).toUpperCase() == term.toUpperCase());
  }

}