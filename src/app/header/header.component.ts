import { Component, OnDestroy, OnInit } from '@angular/core';
import { faHome, faCaretDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { Subscription } from 'rxjs';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  faHome = faHome;
  faCaretDown = faCaretDown;
  faBars = faBars;
  faDiscord = faDiscord;
  isDDVisible = false;
  isMobileMenuVisible = false;
  isOpenRaidFormVisible = false;
  isLoggedIn: boolean;
  private logInChangeSub: Subscription;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.logInChangeSub = this.loginService.loginStatusChanged.subscribe(
      (isUserLoggedIn) => {
        this.isLoggedIn = isUserLoggedIn;
      }
    );
  }
  ngOnDestroy(): void {
    this.logInChangeSub.unsubscribe();
  }
  onShowDD() {
    this.isDDVisible = !this.isDDVisible;
  }
  onShowMobileMenu() {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }
  onShowOpenRaidForm() {
    this.isMobileMenuVisible = false;
    this.isDDVisible = false;
    this.isOpenRaidFormVisible = true;
  }
  onHideOpenRaidForm() {
    this.isOpenRaidFormVisible = false;
  }
  loginHandler() {
    if (this.isLoggedIn) this.loginService.loginStatusChanged.next(false);
    else {
      this.loginService.loginStatusChanged.next(true);
      // window.open(
      //   'https://discord.com/api/oauth2/authorize?client_id=915190870083506197&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F&response_type=code&scope=identify%20guilds%20guilds.members.read',
      //   '_blank'
      // );
    }
  }
}
