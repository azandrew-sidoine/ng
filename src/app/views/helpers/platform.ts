// Provides declared variables to bypass typescript errors
declare var global: any;
declare var window: Window;

// This module provide a typescript implementation file saver implementation for browsers
// All credit to https://github.com/eligrey/FileSaver.js which provides
// a javascript implementation

/** @internal */
type SaveAsType = (
  blob: string | Blob | File,
  name: string,
  options?: Record<string, unknown>,
  popup?: Window | null
) => void;

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
const _global: typeof globalThis | Window | undefined =
  typeof window === 'object' && window.window === window
    ? window
    : typeof self === 'object' && self.self === self
    ? self
    : typeof global === 'object' && global.global === global
    ? global
    : this;

// Detect WebView inside a native macOS app by ruling out all browsers
// We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
// https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
const isMacOSWebView: boolean = _global?.navigator
  ? /Macintosh/.test(_global?.navigator.userAgent) &&
    /AppleWebKit/.test(_global?.navigator.userAgent) &&
    !/Safari/.test(_global?.navigator.userAgent)
  : false;

/**  @internal Checks if cors is enabled in navigator */
function isCorsEnabled(url: string) {
  var xhr = new XMLHttpRequest();
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false);
  try {
    xhr.send();
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299;
}

/** @internal Encode blob content */
function bom(blob: Blob, options?: Record<string, unknown>) {
  if (typeof options === 'undefined') options = { autoBom: false };
  else if (typeof options !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object');
    options = { autoBom: !options };
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (
    options['autoBom'] &&
    /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
      blob.type
    )
  ) {
    return new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
  }

  // Return the blob instance
  return blob;
}

/** @internal Download HTTP blob instance using browser xhr instance  */
function httpDownload(
  url: string,
  name: string,
  options?: Record<string, unknown>
) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'blob';
  request.onload = () => {
    useSaveAs()(request.response, name, options);
  };
  request.onerror = () => {
    throw new Error(`Unable to download file: ${request.statusText}`);
  };

  // Send XML HTTP request
  request.send();
}

/** @internal Dispatch a click event on an HTML node */
function clickNode(node: Node) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      detail: 0,
      screenX: 0,
      screenY: 0,
      clientX: 80,
      clientY: 80,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: null,
    });
    node.dispatchEvent(event);
  }
}

/** @internal Provide a facade arround javascript setTimeout implementation which clear the timeout after the function executes */
function after(callback: () => unknown, ms?: number | undefined) {
  const timeout = setTimeout(() => {
    callback();
    if (timeout) {
      clearTimeout(timeout);
    }
  }, ms);
}

/** @internal */
function useSaveAs(): SaveAsType {
  if ((_global as any).saveAs) {
    return (_global as any).saveAs.bind(_global);
  }

  if (typeof window !== 'object' || window !== _global) {
    return () => {
      /* noop */
    };
  }

  if ('download' in HTMLAnchorElement.prototype && !isMacOSWebView) {
    return (
      blob: string | Blob | File,
      name: string,
      options?: Record<string, unknown>
    ) => {
      const URL = (_global as any).URL ?? (_global as any).webkitURL;
      // Namespace is used to prevent conflict w/ Chrome Poper Blocker extension (Issue #561)
      const anchor = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'a'
      ) as HTMLAnchorElement;
      name =
        name ?? (typeof blob !== 'string' ? (blob as File).name : 'download');
      anchor.download = name;
      anchor.rel = 'noopener'; // tabnabbing

      // TODO: detect chrome extensions & packaged apps
      // a.target = '_blank'

      if (typeof blob === 'string') {
        // Support regular links
        anchor.href = blob;
        if (anchor.origin !== location.origin) {
          isCorsEnabled(anchor.href)
            ? httpDownload(blob, name, options)
            : clickNode(anchor);
        } else {
          clickNode(anchor);
        }
      } else {
        // Support blobs
        anchor.href = URL.createObjectURL(blob);
        after(() => {
          URL.revokeObjectURL(anchor.href);
        }, 4e4); // 40s
        after(() => {
          clickNode(anchor);
        }, 0);
      }
    };
  }

  if ('msSaveOrOpenBlob' in navigator) {
    return (
      blob: string | Blob | File,
      name: string,
      options?: Record<string, unknown>
    ) => {
      name =
        name ?? (typeof blob !== 'string' ? (blob as File).name : 'download');

      if (typeof blob === 'string') {
        if (isCorsEnabled(blob)) {
          httpDownload(blob, name, options);
        } else {
          var anchor = document.createElement('a');
          anchor.href = blob;
          anchor.target = '_blank';
          after(() => {
            clickNode(anchor);
          });
        }
      } else {
        (navigator as Record<string, any>)['msSaveOrOpenBlob'](
          bom(blob, options),
          name
        );
      }
    };
  }

  return (
    blob: string | Blob | File,
    name: string,
    options?: Record<string, unknown>,
    popup?: Window | null
  ) => {
    // Open a popup immediately do go around popup blocker
    // Mostly only available on user interaction and the fileReader is async so...
    popup = popup ?? (_global as Window) ?? open('', '_blank');
    if (popup) {
      popup.document.title = popup.document.body.innerText = 'downloading...';
    }

    if (typeof blob === 'string') {
      return httpDownload(blob, name, options);
    }

    const force = blob.type === 'application/octet-stream';
    const isSafari =
      /constructor/i.test((_global as any).HTMLElement) ||
      (_global as any).safari;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

    if (
      (isChromeIOS || (force && isSafari) || isMacOSWebView) &&
      typeof FileReader !== 'undefined'
    ) {
      // Safari doesn't allow downloading of blob URLs
      const reader = new FileReader();
      reader.onloadend = () => {
        let url = reader.result as string;
        url = isChromeIOS
          ? url
          : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
        if (popup) {
          popup.location.href = url;
        }
        popup = null; // reverse-tabnabbing #460
      };
      reader.readAsDataURL(blob);
    } else {
      const URL = (_global as any).URL || (_global as any).webkitURL;
      const url = URL.createObjectURL(blob);
      if (popup) {
        popup.location = url;
      }
      popup = null; // reverse-tabnabbing #460
      after(() => {
        URL.revokeObjectURL(url);
      }, 4e4); // 40s
    }
  };
}

/** @description Export a default object that provides a `saveAs` method for downloading file resources */
export const SaveAsModule = {
  saveAs: (
    blob: string | Blob | File,
    name: string,
    options?: Record<string, unknown>,
    popup?: Window | null
  ) => {
    useSaveAs()(blob, name, options, popup);
  },
};
