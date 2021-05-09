import {Injectable} from '@angular/core';
import {HttpClientService} from './http-client.service';
import {Observable} from 'rxjs';
import {Role} from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private extensionUrl = 'roles';

  constructor(private httpClientService: HttpClientService) {
  }

  findAll(): Observable<Role[]> {
    return this.httpClientService.get(this.extensionUrl);
  }
}
