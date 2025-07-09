import { Pipe, PipeTransform } from '@angular/core';

/** @internal */
@Pipe({
  name: 'asArray',
  standalone: true,
  pure: true,
})
export class AsArrayPipe implements PipeTransform {
  transform(value: any) {
    return value as any[];
  }
}
