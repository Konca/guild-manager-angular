import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css'],
})
export class RedirectComponent implements OnInit {
  private code: string;
  private autolog: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.code = params['code'];
      this.autolog = params['autolog'];
    });
    if (this.code) {
      this.loginService
        .authoriseWithDisc(this.code.toString())
        .then((loginInfo) => {
          this.loginService.getAuthUserData(loginInfo).then((response) => {
            if (response) {
              window.alert(response);
              this.router.navigate([''],);
            } else this.router.navigate(['settings']);
          });
        });
    } else if (this.autolog) {
      this.loginService.autoLogin().then(() => this.router.navigate(['']));
    } else this.router.navigate(['']);
  }
}
