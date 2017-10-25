import { obsLog } from './../log.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RedmineApi, RedmineService, SearchResult } from '../redmine.service';
import { ReplaySubject, Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/Rx';
import { HttpErrorResponse } from '@angular/common/http';

interface IssueHead {
  id: number;
  title: string;
}

const toDuration = (beginTime: number) => (new Date()).getTime() - beginTime;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private redmine$ = new ReplaySubject<RedmineApi>(1);
  private conns = new Subscription();

  public search = this.fb.group({
      search: ['']
    });

  public isRunning$ = new BehaviorSubject<boolean>(false);
  public startTime$ = new BehaviorSubject<Date>(new Date());
  public pauseRuntime$ = new BehaviorSubject<number>(0);

  public durationForm = this.fb.group({
      hours: [0],
      minutes: [0],
      seconds: [0]
    });

  private beginTime$ = Observable.combineLatest(this.startTime$, this.pauseRuntime$, (s, d) => s.getTime() - d);

  public runningTime$ = this.isRunning$
    .switchMap(r => r
      ? this.beginTime$
        .switchMap(b => Observable.timer(0, 1000)
          .map(_ => toDuration(b)))
      : this.pauseRuntime$)
    .map(d => Math.floor(d / 1000));

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
        .map(i => i as IssueHead[])
        // When search doesn't work, try intepred the query as issue id and get the issue...
        .catch(e => r.getIssues({ issue_id: parseInt(s, 10) })
          .map(i => i.map(j => ({ id: j.id, title: j.subject}) as IssueHead)))
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
    this.conns.add(this.runningTime$
      .subscribe(dur => {
        // console.log('Duration', dur);
        this.durationForm.setValue({
          hours: Math.floor(dur / 3600),
          minutes: Math.floor((dur % 3600) / 60),
          seconds: dur % 60
        });
      }));
  }

  timerStart() {
    this.startTime$.next(new Date());
    this.isRunning$.next(true);
  }

  timerStop() {
    this.beginTime$.take(1).map(toDuration).subscribe(v => this.pauseRuntime$.next(v));
    this.isRunning$.next(false);
  }

  refresh() {
    this.redmine$.next(this.redmineService.getApi());
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnDestroy() {
    this.conns.unsubscribe();
  }
}
