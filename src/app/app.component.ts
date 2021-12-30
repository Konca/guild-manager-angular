import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'guild-manager-angular';
  constructor(private location: Location, private router: Router) {}
  ngOnInit(): void {
    if (this.location.path().split('?')[0] !== '/api/auth/discord/redirect') {
      console.log('asf');
      this.router.navigateByUrl('api/auth/discord/redirect?autolog=true');
    }
  }
}
