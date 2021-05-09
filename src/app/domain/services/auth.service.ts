import {Injectable} from '@angular/core';
import {HttpClientService} from './http-client.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private extensionUrl = 'auth';

  constructor(private httpClientService: HttpClientService) {
  }

  login(username: string, password: string): Observable<string> {
    return this.httpClientService
      .post(this.extensionUrl + '/login', JSON.stringify({username, password}));
  }

  logout(): Observable<string> {
    return this.httpClientService.post(this.extensionUrl + '/logout', {});
  }

  changePassword(password: string): Observable<string> {
    return this.httpClientService.post(this.extensionUrl + '/change-password', password);
  }
}
