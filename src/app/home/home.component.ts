import { FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RedmineApi, RedmineService } from '../redmine.service';
import { ReplaySubject, Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private redmine$ = new ReplaySubject<RedmineApi>(1);

  public search = this.fb.group({
      search: ['']
    });

/*
  public test$ =
    this.search.valueChanges
      .debounceTime(500)
      .map(g => g.search as string)
      .switchMap(s => this.redmine$
        .switchMap(r => r.test(s)));
*/

  public issues$ = this.search.valueChanges
    .map(g => g.search as string)
    .debounceTime(500)
    .startWith('')
    .switchMap(s => this.redmine$
      .switchMap(r => r.search({ q: s })
        .map(l => l.filter(v => v.type.indexOf('issue') === 0 ))
        .catch(e => Observable.of([]))));

  constructor(private redmineService: RedmineService, private fb: FormBuilder) {
    this.refresh();
  }

  refresh() {
    this.redmine$.next(this.redmineService.getApi());
  }

  ngOnInit() {
    this.refresh();
  }

}
