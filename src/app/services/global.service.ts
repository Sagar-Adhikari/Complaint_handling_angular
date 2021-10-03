import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  getShortDateWithTime(x: Date) {
    const d = new Date(x).toLocaleDateString();
    const t = new Date(x).toLocaleTimeString();
    return `${d} ${t}`;
  }

  getShortDateWithoutTime(x: Date) {
    const d = new Date(x).toLocaleDateString();
    return `${d}`;
  }
}
