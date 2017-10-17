import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  credentials = this.fb.group({
    url: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirm: ['', [Validators.required, _ => this.passEqual()]]
  });

  passEqual() {
    if (!this || !this.credentials) {
      return null;
    }
    if (this.credentials.controls.password.value === this.credentials.controls.passwordConfirm.value) {
      return null;
    }
    return { passEqual: true };
  }

  constructor(private fb: FormBuilder) {
    Observable.merge(
      this.credentials.valueChanges)
      .subscribe(v => console.log(v, this.credentials.status, this.credentials.hasError('passEqual')));
  }
}
