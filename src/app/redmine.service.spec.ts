import { TestBed, inject } from '@angular/core/testing';

import { RedmineService } from './redmine.service';

describe('RedmineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedmineService]
    });
  });

  it('should be created', inject([RedmineService], (service: RedmineService) => {
    expect(service).toBeTruthy();
  }));
});
