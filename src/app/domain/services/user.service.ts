import {Injectable} from '@angular/core';
import {HttpClientService} from './http-client.service';
import {User} from '../models/user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private extensionUrl = 'users';

  constructor(private httpClientService: HttpClientService) {
  }

  findAll(): Observable<User[]> {
    return this.httpClientService.get(this.extensionUrl);
  }

  save(user: User): Observable<User> {
    return this.httpClientService.post(this.extensionUrl, user);
  }

  update(user: User): Observable<User> {
    return this.httpClientService.put(this.extensionUrl, user);
  }

  delete(id: number): Observable<string> {
    return this.httpClientService.delete(this.extensionUrl, id);
  }
}
