import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { InlineObject as ILoginContext, User, UserControllerService } from '../api';

// WIP jwt handling currently has id, name
export interface UserProfile {
  id: number;
  firstName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserProfile>;
  public currentUser: Observable<UserProfile>;

  constructor(
    private userService: UserControllerService,
    public jwt: JwtHelperService,
  ) {
    const decoded = this.jwt.decodeToken();
    if (decoded) {
      this.currentUserSubject = new BehaviorSubject<UserProfile>({
        id: decoded.id,
        firstName: decoded.name,
      });
    } else {
      this.currentUserSubject = new BehaviorSubject<UserProfile>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserProfile {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !this.jwt.isTokenExpired();
  }

  login(loginContext: ILoginContext): Observable<string> {
    return this.userService.userControllerLogin(loginContext).pipe(
      map(res => {
        localStorage.setItem('access_token', res.token);

        const decoded = this.jwt.decodeToken(res.token);
        this.currentUserSubject = new BehaviorSubject<UserProfile>({
          id: decoded.id,
          firstName: decoded.name,
        });

        return res.token;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      }),
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }

  register(loginContext: ILoginContext): Observable<UserProfile> {
    return this.userService.userControllerCreate(loginContext).pipe(
      map(user => {
        return user;
      }),
      catchError(err => {
        console.log(err);
        return of(null);
      }),
    );
  }
}
