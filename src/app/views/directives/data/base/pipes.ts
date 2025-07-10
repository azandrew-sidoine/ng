import { Injector, Pipe, PipeTransform } from '@angular/core';
import { GridDetailColumnType } from '@azlabsjs/ngx-clr-smart-grid';

type InputType =
  | Record<string, unknown>
  | ((injector: Injector) => Record<string, unknown>)
  | undefined;

@Pipe({
  name: 'inputs',
  standalone: true,
  pure: true,
})
export class DetailInputPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(values: InputType, data: unknown, columns: GridDetailColumnType[]) {
    const inputs =
      typeof values === 'function'
        ? values(this.injector)
        : (values as Record<string, unknown>);

    return { ...inputs, data, columns } as Record<string, unknown> & {
      data: unknown;
      columns: GridDetailColumnType[];
    };
  }
}

@Pipe({
  name: 'islistview',
  standalone: true,
})
export class IsListViewPipe implements PipeTransform {
  transform(view: string): boolean {
    return view === 'listView' || view === 'list';
  }
}

@Pipe({
  name: 'iseditview',
  standalone: true,
})
export class IsEditViewPipe implements PipeTransform {
  transform(view: string): boolean {
    return (
      view === 'createView' ||
      view === 'editView' ||
      view === 'create' ||
      view === 'edit'
    );
  }
}

/** Exported standalone pipes */
export const PIPES = [DetailInputPipe, IsEditViewPipe, IsListViewPipe] as const;
