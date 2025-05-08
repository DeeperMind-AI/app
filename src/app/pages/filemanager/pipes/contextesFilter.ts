import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contextFilter',
  standalone: true
})
export class ContextFilter implements PipeTransform {

  transform(values: any[], term:string): any[] {
    return values.filter(v => v.metadata.fname == term);
  }

}