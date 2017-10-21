import { FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RedmineApi, RedmineService, SearchResult } from '../redmine.service';
import { ReplaySubject, Observable } from 'rxjs/Rx';
import { HttpErrorResponse } from '@angular/common/http';

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

  public issuesOrError$ = this.search.valueChanges
    .map(g => g.search as string)
    .debounceTime(500)
    .startWith('')
    .switchMap(s => this.redmine$
      .switchMap(r => r.search({ q: s })
        .map(l => l.filter(v => v.type.indexOf('issue') === 0 ))
        .catch(e => e instanceof HttpErrorResponse
          ? Observable.of(e.message)
          : Observable.of('' + e))))
    .shareReplay(1);
  public issues$ = this.issuesOrError$
    .filter(v => v instanceof Array)
    .map(v => v as SearchResult[]);
  public error$ = this.issuesOrError$
    .map(v => !(v instanceof Array) ? v : '');

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
