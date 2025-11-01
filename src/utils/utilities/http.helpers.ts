import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { requestWrappers } from './error.handling';
import { inject, Injectable } from '@angular/core';


export type ResponseType = 'json' | 'text' | 'blob' | 'arraybuffer';

export interface HttpOptions<R extends ResponseType> {
  httpheaders?: HttpHeaders | { [header: string]: string | string[] };
  httpParams?: HttpParams | { [param: string]: string | string[] };
  responseType: R;
  observe?: 'body' | 'response' | 'events';
  context?: HttpContext;
}

export type HttpMethods = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';


interface ResponseTypeMap<T>  {
  json: T;
  text: string;
  blob: Blob;
  arraybuffer: ArrayBuffer;
};

@Injectable({
  providedIn:'root'
})
export class HttpService {
 
 private http = inject(HttpClient);
 
  request<T, R extends ResponseType = 'json'>(
    method: HttpMethods,
    url: string,
    payload?: T,
    options?: HttpOptions<R>
  ): Observable<ResponseTypeMap<T>[R]>
   {
    const responseType : ResponseType = options?.responseType ?? 'json';  
   if (responseType === 'json') {
      return requestWrappers(
        this.http.request<T>(method, url, {
          body: payload,
          headers: options?.httpheaders,
          params: options?.httpParams,
          responseType: 'json',
          observe: 'body',
          context: options?.context,
       
        }) as Observable<ResponseTypeMap<T>[R]>
      );
    }

    if (responseType === 'text') {
      return requestWrappers(
        this.http.request(method, url, {
          body: payload,
          headers: options?.httpheaders,
          params: options?.httpParams,
          responseType: 'text',
          observe: options?.observe ?? 'body',
          context: options?.context,
        }) as Observable<ResponseTypeMap<T>[R]>
      );
    }

    if (responseType === 'blob') {
      return requestWrappers(
        this.http.request(method, url, {
          body: payload,
          headers: options?.httpheaders,
          params: options?.httpParams,
          responseType: 'blob',
          observe: options?.observe ?? 'body',
          context: options?.context,
        }) as Observable<ResponseTypeMap<T>[R]>
      );
    }

    // default to arraybuffer
    return requestWrappers(
      this.http.request(method, url, {
        body: payload,
        headers: options?.httpheaders,
        params: options?.httpParams,
        responseType: 'arraybuffer',
        observe: options?.observe ?? 'body',
        context: options?.context,
      }) as Observable<ResponseTypeMap<T>[R]>
    );
  }
}


