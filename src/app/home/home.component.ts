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

interface TimerState {
  lastStartTime: number;
  duration: number;
  running: boolean;
}

type TimerActionFn = (current: TimerState) => TimerState;

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

  public durationForm = this.fb.group({
    hours: [0],
    minutes: [0],
    seconds: [0]
  });

  public timerStartCmd$ = new Subject();
  public timerStopCmd$ = new Subject();

  public timerAction$ = Observable.merge(
    this.timerStartCmd$.mapTo((timerState: TimerState) => ({ ...timerState,
      lastStartTime: (new Date()).getTime(),
      duration: this.getDuration() * 1000,
      running: true })),
    this.timerStopCmd$.mapTo((timerState: TimerState) => timerState.running
      ? { ...timerState,
          duration: timerState.duration + toDuration(timerState.lastStartTime),
          running: false }
      : { ...timerState}));

  public runTime$ = this.timerAction$
    .scan((timerState, timerAction) => timerAction(timerState),
      { lastStartTime: (new Date()).getTime(), duration: 0, running: false } as TimerState)
    .shareReplay(1);

  public isRunning$ = this.runTime$.map(s => s.running);

  public runningTime$ = this.runTime$
      .switchMap(({ lastStartTime, duration, running }) => running
        ? Observable.timer(0, 1000)
            .map(_ => duration + toDuration(lastStartTime))
        : Observable.of(duration))
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
        // When search doesn't work, try interpred the query as issue id and get the issue...
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

  refresh() {
    this.redmine$.next(this.redmineService.getApi());
  }

  getDuration() {
    return parseInt(this.durationForm.value.hours, 10) * 3600
      + parseInt(this.durationForm.value.minutes, 10) * 60
      + parseInt(this.durationForm.value.seconds, 10);
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnDestroy() {
    this.conns.unsubscribe();
  }
}
