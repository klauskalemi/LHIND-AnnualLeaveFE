import {Injectable} from '@angular/core';
import {HttpClientService} from './http-client.service';
import {Observable} from 'rxjs';
import {LeaveRequest} from '../models/leave-request';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  private extensionUrl = 'leave-requests';

  constructor(private httpClientService: HttpClientService) {
  }

  findAll(): Observable<LeaveRequest[]> {
    return this.httpClientService.get(this.extensionUrl);
  }

  save(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.httpClientService.post(this.extensionUrl, leave);
  }

  update(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.httpClientService.put(this.extensionUrl, leave);
  }

  delete(id: number): Observable<string> {
    return this.httpClientService.delete(this.extensionUrl, id);
  }
}
