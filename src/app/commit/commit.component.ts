import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css']
})
export class CommitComponent {

  public issue$ = this.route.paramMap.map(v => v.get('issue'));

  constructor(private route: ActivatedRoute) {
  }
}
