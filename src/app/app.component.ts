import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  credentials = this.fb.group({
    url: ['', Validators.required ],
    username: ['', Validators.required ],
    password: ['', Validators.required ],
    passwordConfirm: ['', Validators.required ]
  });

  constructor(private fb: FormBuilder) {
    Observable.merge(
      this.credentials.valueChanges)
      .subscribe(console.log);
  }
}
