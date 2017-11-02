import { Component, OnInit, Input } from '@angular/core';
import { WorktimeService } from '../worktime.service';

@Component({
  selector: 'app-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent implements OnInit {

  @Input() name: string;
  @Input() home = false;

  constructor(public worktime: WorktimeService) { }

  ngOnInit() {
  }

  onDurationChange(newVal) {
    if (newVal instanceof Event) {
      return; // Somtimes it is of type Event??
    }
    this.worktime.setDuration(newVal);
  }
}
