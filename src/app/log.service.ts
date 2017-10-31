import { Injectable } from '@angular/core';

export const logObs = name => ({
  next: v => console.log('Obs ' + name, v),
  error: e => console.error('Obs ' + name, e),
  complete: () => console.log('Obs ' + name + ' complete')
});

@Injectable()
export class LogService {
  constructor() { }
}
