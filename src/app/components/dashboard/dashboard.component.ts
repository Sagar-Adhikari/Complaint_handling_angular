import { Component } from '@angular/core';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // listOf = { type: 'category', id: 1 }
  // listOf = { type: 'service-provider', id: 1 }
  //listOf = { type: 'status', id: 1 }
  listOf = { type: 'user', id: 1 }
}
