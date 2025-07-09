import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  pure: true,
  name: 'inputs',
})
export class InputsPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(
    values:
      | Record<string, unknown>
      | ((injector: Injector) => Record<string, unknown>)
      | undefined
  ) {
    return typeof values === 'function'
      ? values(this.injector)
      : (values as Record<string, unknown>);
  }
}
