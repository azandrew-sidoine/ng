import { Injector } from '@angular/core';
import { JSObject } from '@azlabsjs/js-object';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Subject,
  filter,
  finalize,
  map,
  mergeMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

/** @description Provides application texts from @ngx-tranlate/core library */
export function useTranslationsFactory<TReturn>(
  onLang?: (values: Record<string, any>) => TReturn
) {
  return (i: Injector) => {
    const subject$ = new BehaviorSubject<Record<string, any>>({});
    const destroy$ = new Subject<void>();
    const t = i.get(TranslateService);

    if (t) {
      // Because based on tranlator internal implementation, calling use() with the
      // currentLang, we not trigger any translation reload
      function effect(lang: string) {
        t.use(lang)
          .pipe(
            map((values) => Object.keys(JSObject.flatten(values))),
            filter((values) => values.length > 0),
            take(1),
            mergeMap((values) =>
              t.get(values).pipe(
                map((translations) => {
                  const output: Record<string, any> = {};
                  for (const [k, v] of Object.entries(translations)) {
                    JSObject.setProperty(output, k, v);
                  }
                  return output;
                })
              )
            )
          )
          .subscribe((values) => {
            subject$.next(values);
          });
      }

      // Start the effect first
      effect(t.currentLang ?? t.getDefaultLang());

      // Listen for language change to update common texts
      // until the common test observable finalizes
      t.onLangChange
        .pipe(
          takeUntil(destroy$),
          tap((lang) => subject$.next(lang.translations))
        )
        .subscribe();
    }

    onLang = onLang ?? ((v) => v as TReturn);
    return subject$.asObservable().pipe(
      finalize(() => destroy$.next()),
      map(onLang),
      tap((v) => console.log(v))
    );
  };
}
