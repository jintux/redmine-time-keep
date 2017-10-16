import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  url = new FormControl('', Validators.required);
  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  passwordConfirm = new FormControl('', Validators.required);
  credentials = this.fb.group({
    url: this.url,
    username: this.username,
    password: this.password,
    passwordConfirm: this.passwordConfirm
  });

  getErrorMsg(field: FormControl) {
    if (field.hasError('required')) {
      return 'This field is required.';
    }
  }

  constructor(private fb: FormBuilder) {
    Observable.merge(
      this.credentials.valueChanges)
      .subscribe(v => console.log(v, this.credentials.errors, this.credentials.hasError('required')));
  }
}
