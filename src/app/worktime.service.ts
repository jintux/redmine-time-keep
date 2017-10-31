import { Subject, Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';


interface TimerState {
  lastStartTime: number;
  duration: number;
  running: boolean;
}

type TimerActionFn = (current: TimerState) => TimerState;

const toDuration = (beginTime: number) => (new Date()).getTime() - beginTime;

@Injectable()
export class WorktimeService {

  private currDuration = 0;


  private startCmd$ = new Subject();
  private stopCmd$ = new Subject();
  private action$ = Observable.merge(
    this.startCmd$.mapTo((timerState: TimerState) => ({ ...timerState,
      lastStartTime: (new Date()).getTime(),
      duration: this.currDuration * 1000,
      running: true })),
    this.stopCmd$.mapTo((timerState: TimerState) => timerState.running
      ? { ...timerState,
          duration: timerState.duration + toDuration(timerState.lastStartTime),
          running: false }
      : { ...timerState }));

  public timerState$ = this.action$
    .scan((timerState, timerAction) => timerAction(timerState),
      { lastStartTime: (new Date()).getTime(), duration: this.currDuration, running: false } as TimerState)
    .shareReplay(1);

  public isRunning$ = this.timerState$.map(s => s.running);

  public runningTime$ = this.timerState$
      .switchMap(({ lastStartTime, duration, running }) => running
        ? Observable.timer(0, 1000)
            .map(_ => duration + toDuration(lastStartTime))
        : Observable.of(duration))
      .map(d => Math.floor(d / 1000));

  constructor() { }

  start() {
    this.startCmd$.next();
  }

  stop() {
    this.stopCmd$.next();
  }

  setDuration(newVal: number) {
    this.currDuration = newVal;
  }
}
