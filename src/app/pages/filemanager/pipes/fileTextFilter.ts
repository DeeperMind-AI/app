import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTextFilter',
  standalone: true
})
export class FileTextFilter implements PipeTransform {

  transform(values: any[], term:string): any[] {
    return values.filter(v => (v.original_fname as string).toUpperCase().indexOf(term.toUpperCase()) > -1);
  }

}