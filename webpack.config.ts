import { Configuration } from 'webpack';
import * as webpack from 'webpack';
import 'dotenv/config';

/** @description Sanitizes environment variables for production */
function sanitizeForAngular(o: Record<string, any>) {
  const e = (Object.keys(o) as (keyof typeof o)[]).reduce(
    (carry, c) => {
      if (c.startsWith('NG_')) {
        let v = o[c];
        const lv = String(v).toLowerCase();
        // We try to convert 'false' and 'true' strings to their
        // true and false boolean value to prevent application from resolving
        // 'false' as truthy value
        if (lv === 'false') {
          v = false;
        } else if (lv === 'true') {
          v = true;
        } else {
          v = v;
        }
        carry[`${c.substring('NG_'.length)}`] = v;
      }
      return carry;
    },
    {} as Record<string, any>
  );
  // Provides an environment variables that is accessible
  // in browser environment
  return { 'process.env': JSON.stringify(e) };
}

export default {
  plugins: [new webpack.DefinePlugin(sanitizeForAngular(process.env))],
} as Configuration;
