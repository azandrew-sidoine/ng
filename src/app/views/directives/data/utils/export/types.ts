import { Observable } from 'rxjs';

/** @internal Progress handler type declaration */
export type ProgressHandler<T> = {
  state$: Observable<T>;
  update: (fn: (value: T) => T) => void;
};

/** @internal Progress state type declaration */
export type ProgressStateType = {
  total: number;
  value: number;
};

/** @internal Exported document header type declaration */
export type SheetHeaderType = { name: string; property: string };

/** Export services type declaration */
export type Exporter = {
  /** Export records into a spreadsheet */
  export(
    records: Record<string, unknown>[],
    headers: SheetHeaderType[],
    name?: string
  ): void | Promise<void>;
};

/** Writer type declaration */
export type Writer = {
  /**
   * Write the list of records to disk
   */
  write(path: string, records: unknown): void | Promise<void>;
};