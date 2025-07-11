import type { Plugin, PluginBuild } from 'esbuild';
import 'dotenv/config';

/** @description Sanitizes environment variables for production */
function compileEnv(o: Record<string, any>) {
  const e = (Object.keys(o) as (keyof typeof o)[]).reduce((carry, c) => {
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
  }, {} as Record<string, any>);
  // provides an environment variables that is accessible in browser environment
  return { 'process.env': JSON.stringify(e) };
}

const envPlugin: Plugin = {
  name: 'env-plugin',
  setup(build: PluginBuild) {
    const define = Object.assign(
      (build.initialOptions.define ??= {}),
      compileEnv(process.env)
    );
    build.initialOptions.define = define;
  },
};

export default envPlugin;
