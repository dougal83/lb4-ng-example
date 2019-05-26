import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PingService {
  constructor(private http: HttpClient) {}

  getPing(): Observable<any> {
    return this.http.get<any>('/api/ping');
  }
}
