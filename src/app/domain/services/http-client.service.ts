import {Observable, throwError as observableThrowError} from 'rxjs';

import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AnnualLeaveCache} from '../utils/annual-leave-cache';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private readonly PATH: string = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) {
  }

  static createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: AnnualLeaveCache.getItem('token') || ''
    });
  }

  static handleErrorAsObject(error: Response): Observable<never> {
    return observableThrowError(error);
  }

  get(extensionUrl: string, responseType: any = 'json'): Observable<any> {
    return this.httpClient
      .get<any>(this.PATH + extensionUrl, {
        headers: HttpClientService.createAuthorizationHeader(),
        responseType,
      }).pipe(catchError(HttpClientService.handleErrorAsObject));
  }

  post(extensionUrl: string, data: any, responseType: any = 'json'): Observable<any> {
    return this.httpClient
      .post<any>(this.PATH + extensionUrl, data, {
        headers: HttpClientService.createAuthorizationHeader(),
        responseType,
      }).pipe(catchError(HttpClientService.handleErrorAsObject));
  }

  put(extensionUrl: string, data: any, responseType: any = 'json'): Observable<any> {
    return this.httpClient
      .put<any>(this.PATH + extensionUrl, data, {
        headers: HttpClientService.createAuthorizationHeader(),
        responseType,
      }).pipe(catchError(HttpClientService.handleErrorAsObject));
  }

  delete(extensionUrl: string, id: number, responseType: any = 'json'): Observable<any> {
    return this.httpClient
      .delete<any>(this.PATH + extensionUrl + '/' + id, {
        headers: HttpClientService.createAuthorizationHeader(),
        responseType,
      }).pipe(catchError(HttpClientService.handleErrorAsObject));
  }
}
