import { logObs } from './../log.service';
import { RedmineService, RedmineApi, makeQuery, IdAndName, Issue, TimeEntry } from './../redmine.service';
import { WorktimeService } from './../worktime.service';
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css']
})
export class CommitComponent {

  private redmine: RedmineApi;
  public issue: Issue;
  public get title() { return this.issue ? `${this.issue.tracker.name} #${this.issue.id}` : ''; }
  public get subject() { return this.issue ? this.issue.subject : ''; }
  public get description() { return this.issue ? this.issue.description : ''; }

  public workPerc$ = new Subject<number>();
  public commitDuration$ = this.worktime.runningTime$.withLatestFrom(this.workPerc$.startWith(1))
    .map(([dur, perc]) => Math.floor(dur * perc));
  public activities: IdAndName[];

  public finalDuration = 0;
  
  commit = this.fb.group({
    comment: [''],
    activity: ['']
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, public worktime: WorktimeService, redmineService: RedmineService) {
    this.redmine = redmineService.getApi();
    this.redmine.getEnumeration('time_entry_activities')
      .take(1).subscribe(v => {
        this.activities = v;
        v.forEach(a => a.is_default ? this.commit.patchValue({ activity: '' + a.id }) : 0);
      });
    this.route.paramMap
      .map(v => parseInt(v.get('issue'), 10))
      .switchMap(id => this.redmine.getIssues({ issue_id: id }))
      .map(v => v[0])
      .take(1)
      .subscribe(i => this.issue = i);
  }

  onDurationChange(newVal) {
    if (newVal instanceof Event) {
      return; // Somtimes it is of type Event??
    }
    this.finalDuration = newVal;
  }

  onWorkPercChange(v) {
    this.workPerc$.next(v.value);
  }

  onCommit() {
    if (this.finalDuration <= 0) {
      console.log('No time to register...');
      return;
    }
    const commitForm = this.commit.value;
    const activity: TimeEntry = {
      issue_id: this.issue.id,
      hours: this.finalDuration / 3600,
      activity_id: parseInt(commitForm.activity, 10),
      comments: commitForm.comment as string
    };
    console.log('Create time-entry here. Subtract duration. Go back.', activity);
    this.redmine.createTimeEntry(activity)
      .take(1)
      .subscribe(logObs('PostActivity'));
  }
}
