import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/service/login.service';
import { ProfileService } from 'src/app/service/profile.service';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private logInChangeSub$: Subscription;
  private loggedUser$: Subscription;
  isLoggedIn: boolean;
  user: User;
  userName: string;
  selectedGuild: string;
  isOpenGuildsormVisible: boolean;
  constructor(
    private loginService: LoginService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.logInChangeSub$ = this.loginService.loginStatusChanged.subscribe(
      (isUserLoggedIn) => {
        this.isLoggedIn = isUserLoggedIn;
      }
    );
    if (this.isLoggedIn) {
      this.loggedUser$ = this.profileService.user$.subscribe((user) => {
        this.user = user;
        this.userName = user.UserName + '#' + user.Discriminator;
        this.selectedGuild = user.SelectedGuildName;
      });
    }
  }
  ngOnDestroy(): void {
    this.logInChangeSub$.unsubscribe();
    this.loggedUser$.unsubscribe();
  }
  guildSelectorHandler() {
    this.isOpenGuildsormVisible = true;
  }
  onHideOpenGuildsForm() {
    this.isOpenGuildsormVisible = false;
  }
}
