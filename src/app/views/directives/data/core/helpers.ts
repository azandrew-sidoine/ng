import { Injector } from '@angular/core';
import { Observable, map } from 'rxjs';

/** @description Translate columns for view presentation */
export function columsTranslatorFactory(
  translations: (
    i: Injector
  ) => (p: string | string[]) => Observable<{ [prop: string]: any }>
) {
  return <T extends { title: string }>(columns: T[]) => {
    return (injector?: Injector | null) => {
      if (injector) {
        return translations
          ? translations(injector)(columns.map((column) => column.title)).pipe(
              map((values) => {
                return columns.map((column) => ({
                  ...column,
                  title: values[column.title] ?? column.title,
                }));
              })
            )
          : columns;
      }
      return columns;
    };
  };
}