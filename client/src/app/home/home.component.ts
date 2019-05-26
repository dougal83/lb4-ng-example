import { Component, OnInit } from '@angular/core';

import { PingService } from '../services/ping.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  ping: string;

  constructor(private pingService: PingService) {}

  ngOnInit() {
    this.getPing();
  }

  getPing() {
    this.pingService.getPing().subscribe(data => (this.ping = data));
  }
}
