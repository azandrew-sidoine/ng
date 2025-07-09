import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { of, startWith, tap } from 'rxjs';

/** @internal */
const placeholder = `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2ODAuNzY0IiBoZWlnaHQ9IjUyOC4zNTQiIHZpZXdCb3g9IjAgMCAxODAuMTE5IDEzOS43OTQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMy41OSAtNjYuNjM5KSIgcGFpbnQtb3JkZXI9ImZpbGwgbWFya2VycyBzdHJva2UiPjxwYXRoIGZpbGw9IiNkMGQwZDAiIGQ9Ik0xMy41OTEgNjYuNjM5SDE5My43MXYxMzkuNzk0SDEzLjU5MXoiLz48cGF0aCBkPSJtMTE4LjUwNyAxMzMuNTE0LTM0LjI0OSAzNC4yNDktMTUuOTY4LTE1Ljk2OC00MS45MzggNDEuOTM3SDE3OC43MjZ6IiBvcGFjaXR5PSIuNjc1IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iNTguMjE3IiBjeT0iMTA4LjU1NSIgcj0iMTEuNzczIiBvcGFjaXR5PSIuNjc1IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTI2LjExMSA3Ny42MzRoMTUyLjYxNHYxMTYuMDk5SDI2LjExMXoiLz48L2c+PC9zdmc+`;

/** @internal */
function b64ToBlob(b64Data: string, contentType = '', size = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += size) {
    const slice = byteCharacters.slice(offset, offset + size);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

@Pipe({
  standalone: true,
  pure: true,
  name: 'isImg',
})
export class IsImagePipe implements PipeTransform {
  transform(t: string) {
    const regex = new RegExp(
      /[^\s]+(.*?).(jpg|jpeg|png|gif|bmp|svg|webp|JPG|JPEG|PNG|GIF|BMP|SVG|WEBP)$/
    );
    return regex.test(t);
  }
}

@Pipe({
  standalone: true,
  pure: true,
  name: 'blob',
})
export class HTTPBlobPipe implements PipeTransform {
  /** Data URL pipe class constructor */
  constructor(private client: HttpClient) {}

  transform(url: string | null | undefined, params?: { [prop: string]: any }) {
    if (typeof url === 'undefined' || url === null) {
      return of(b64ToBlob(placeholder));
    }
    const headers = new HttpHeaders();
    headers.append('Accept', 'text/plain');
    headers.append('Content-type', 'application/octet-stream');
    return this.client
      .get(url, { headers, responseType: 'blob', params })
      .pipe(startWith(b64ToBlob(placeholder, "image/png")), tap(console.log));
  }
}

@Pipe({
  standalone: true,
  pure: true,
  name: 'safeRessource',
})
export class SafeRessourcePipe implements PipeTransform {
  /** Safe resource pipe class constructor */
  constructor(private sanitized: DomSanitizer) {}

  transform(value: string | null) {
    return this.sanitized.bypassSecurityTrustResourceUrl(value ?? '');
  }
}

@Pipe({
  standalone: true,
  pure: true,
  name: 'readDataURL',
})
export class DataURLPipe implements PipeTransform {
  transform(file: Blob | File) {
    return new Promise<string>((resolve, reject) => {
      if (typeof file !== 'undefined' && file !== null) {
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent) => {
          const target = e.target as FileReader;
          if (target.result) {
            resolve(target.result.toString());
          }
        };
        reader.readAsDataURL(file);
      } else {
        reject(
          new Error(
            `Expected instance of javascript File or Blob got ${typeof file}`
          )
        );
      }
    });
  }
}

/** Exported standalone pipes */
export const PIPES = [
  IsImagePipe,
  HTTPBlobPipe,
  SafeRessourcePipe,
  DataURLPipe,
] as const;
