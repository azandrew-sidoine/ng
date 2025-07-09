import { Exporter, SheetHeaderType, Writer } from './types';


/** Provides an exporter that prepares value an xlx export service */
export class SheetExporter implements Exporter {
  // Class constructor
  public constructor(private writer: Writer) {}

  // Export data to the csv format
  export(
    records: Record<string, unknown>[],
    headers: SheetHeaderType[],
    name: string = 'document.xlsx'
  ) {
    // Case records are empty, simply generate the csv document from an empty string
    if (!Array.isArray(records) || records.length === 0) {
      this.writer.write(name, []);
      return;
    }

    if (!Array.isArray(headers) || headers.length === 0) {
      headers = Object.keys(records[0]).reduce((carry, current) => {
        carry.push({ name: current, property: current });
        return carry;
      }, [] as SheetHeaderType[]);
    }
    const data = records.reduce((carry, current) => {
      const line = headers.reduce((c, h) => {
        c[h.name] = current[h.property];
        return c;
      }, {} as Record<string, unknown>);

      // Push the line to the stack
      carry.push(line);

      // Return the carried result of the previous operation
      return carry;
    }, [] as Record<string, unknown>[]);

    return this.writer.write(name, data);
  }
}
