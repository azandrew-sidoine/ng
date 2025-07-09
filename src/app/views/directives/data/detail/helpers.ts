import { GridDetailColumnType } from '@azlabsjs/ngx-clr-smart-grid';

/** @internal Create list of columns from the provides list of columns */
export function columns(values: GridDetailColumnType[]) {
  return values.map((column) => ({
    title: column.title,
    titleTransform: column.titleTransform,
    property: column.property || '',
    style: column.style
      ? {
          cssClass: Array.isArray(column.style.cssClass)
            ? column.style.cssClass.join(' ')
            : column.style.cssClass ?? '',
          styles: Array.isArray(column.style.styles)
            ? column.style.styles.reduce((carry, curr) => {
                carry[curr] = true;
                return carry;
              }, {} as Record<string, boolean>)
            : column.style.styles ?? {},
        }
      : { cssClass: '', styles: '' },
    transform: column.transform ?? 'default',
  }));
}
