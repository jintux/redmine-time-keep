import { Component, OnInit } from '@angular/core';
import { RedmineApi, RedmineService } from '../redmine.service';
import { ReplaySubject } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private redmine$ = new ReplaySubject<RedmineApi>(1);

  public issues$ = this.redmine$
    .switchMap(r => r.getIssues({ limit: 20 }));

  constructor(private redmineService: RedmineService) {
    this.refresh();
  }

  refresh() {
    this.redmine$.next(this.redmineService.getApi());
  }

  ngOnInit() {
    this.refresh();
  }

}
