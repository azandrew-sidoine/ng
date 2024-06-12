import { Injector, ɵisPromise } from '@angular/core';
import { Observable, from, isObservable, map, of } from 'rxjs';

/** @internal */
type ObservableOr<T> = T | Observable<T>;

/** @internal */
type TranslatorFactory = (
  o?: Injector | null
) => (p: string | string[]) => ObservableOr<Record<string, any>>;

/** @description Provides data component common strings */
export function provideCommonStrings(factory: TranslatorFactory) {
  const t = factory()([
    // Prompts
    'app.prompt.confirm',
    'app.prompt.logout',
    'app.prompt.delete',

    // Actions
    'app.actions.refresh',
    'app.actions.create',
    'app.actions.update',
    'app.actions.delete',
    'app.actions.back',
    'app.actions.submit',
    'app.actions.logout',
    'app.datagrid.loading',
    'app.datagrid.error',
    'app.datagrid.placeholder',
    'app.actions.detail',
    'app.actions.export',
    'app.actions.validate',
    'app.actions.reject',
    'app.actions.download',
    'app.actions.synchronize',

    // Strings
    'app.strings.request-error',
    'app.strings.request-ok',
    'app.strings.loading-data',
    'app.strings.pending',
    'app.strings.validated',
    'app.strings.rejected',

    // Constraints
    'app.constraints.gte',
    'app.constraints.lte',
    'app.constraints.gt',
    'app.constraints.lt',
    'app.constraints.eq',
    'app.constraints.max',
    'app.constraints.min',
    'app.constraints.maxLength',
    'app.constraints.minLength',
    'app.constraints.required',
  ]);

  const _t = isObservable(t) || ɵisPromise(t) ? from(t) : of(t);

  return _t.pipe(
    map((values) => ({
      refresh: values['app.actions.refresh'],
      create: values['app.actions.create'],
      update: values['app.actions.update'],
      delete: values['app.actions.delete'],
      submit: values['app.actions.submit'],
      export: values['app.actions.export'],
      back: values['app.actions.back'],
      datagrid: {
        loading: values['app.datagrid.loading'],
        error: values['app.datagrid.error'],
        placeholder: values['app.datagrid.placeholder'],
      },
      actions: {
        detail: values['app.actions.detail'],
        validate: values['app.actions.validate'],
        reject: values['app.actions.reject'],
        download: values['app.actions.download'],
        export: values['app.actions.export'],
        refresh: values['app.actions.refresh'],
        create: values['app.actions.create'],
        update: values['app.actions.update'],
        delete: values['app.actions.delete'],
        submit: values['app.actions.submit'],
        back: values['app.actions.back'],
        logout: values['app.actions.logout'],
        synchronize: values['app.actions.synchronize'],
        addUserToGroup: values['app.actions.addUserToGroup'],
        deactivate: values['app.actions.deactivate'],
        activate: values['app.actions.activate'],
      },
      prompt: {
        logout: values['app.prompt.logout'],
        delete: values['app.prompt.delete'],
        confirm: values['app.prompt.confirm'],
      },
      request: {
        error: values['app.strings.request-error'],
        success: values['app.strings.request-ok'],
        loading: values['app.strings.loading-data'],
      },

      // Strings
      strings: {
        pending: values['app.strings.pending'],
        validated: values['app.strings.validated'],
        rejected: values['app.strings.rejected'],
      },

      // Constraints strings
      constraints: {
        gte: values['app.constraints.gte'],
        lte: values['app.constraints.lte'],
        gt: values['app.constraints.gt'],
        lt: values['app.constraints.lt'],
        eq: values['app.constraints.eq'],
        maxLength: values['app.constraints.maxLength'],
        minLength: values['app.constraints.minLength'],
        max: values['app.constraints.max'],
        min: values['app.constraints.min'],
        required: values['app.constraints.required'],
      },
    }))
  );
}

/** @description Provides common strings for login component */
export function provideLoginStrings(factory: TranslatorFactory) {
  const t = factory()([
    'login.username.label',
    'login.username.placeholder',
    'login.password.label',
    'login.password.placeholder',
    'login.remember.placeholder',
    'login.loginBtnText',
    'login.authenticationFailed',
    'login.authenticating',
    'login.loginMaintext',
    'login.loginSubText',
    'login.successful',
    'login.registerBtnText',
    'login.authorizationError',
  ]);

  const _t = isObservable(t) || ɵisPromise(t) ? from(t) : of(t);
  return _t.pipe(
    map((values) => {
      return {
        username: {
          label: values['login.username.label'],
          placeholder: values['login.username.placeholder'],
        },
        password: {
          label: values['login.password.label'],
          placeholder: values['login.password.placeholder'],
        },
        remember: {
          label: values['login.remember.placeholder'],
        },
        loginBtnText: values['login.loginBtnText'],
        authenticationFailed: values['login.authenticationFailed'],
        authorizationError: values['login.authorizationError'], // ''
        authenticating: values['login.authenticating'],
        loginMaintext: values['login.loginMaintext'],
        loginSubText: values['login.loginSubText'],
        successful: values['login.successful'],
        registerBtnText: values['login.registerBtnText'],
      };
    })
  );
}
