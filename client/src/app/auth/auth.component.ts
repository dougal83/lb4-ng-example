import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InlineObject as ILoginContext, User } from '../api';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  currentUser: BehaviorSubject<Observable<Pick<User, 'id' | 'firstName'>>>;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
  ) {
    this.buildForms();
  }

  ngOnInit() {}

  register() {
    const user: User = this.registerForm.value;

    this.authService
      .register(user)
      .subscribe(
        success => alert('Registration success - Please log in.'),
        err => alert(err.message),
      );
    this.registerForm.reset();
  }

  login() {
    const credentials: ILoginContext = this.loginForm.value;

    this.authService
      .login(credentials)
      .subscribe(
        success => alert('Login success - Go edit todos'),
        err => alert(err.message),
      );
    this.loginForm.reset();
  }

  onLogout() {
    this.authService.logout();
    alert('Logged out');
  }

  getCurrentUser(): string {
    const user = this.authService.currentUserValue;
    return user.firstName || user.id.toString();
  }

  private buildForms(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
