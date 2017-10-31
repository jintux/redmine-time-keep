import { TestBed, inject } from '@angular/core/testing';

import { WorktimeService } from './worktime.service';

describe('WorktimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorktimeService]
    });
  });

  it('should be created', inject([WorktimeService], (service: WorktimeService) => {
    expect(service).toBeTruthy();
  }));
});
