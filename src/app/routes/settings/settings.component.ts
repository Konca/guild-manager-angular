import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/service/login.service';
import { ProfileService } from 'src/app/service/profile.service';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  private logInChangeSub$: Subscription;
  private loggedUser$: Subscription;
  private selectedGuild$: Subscription;
  isLoggedIn: boolean;
  user: User;
  userName: string;
  selectedGuild: string;
  selectedGId: string;
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
        this.selectedGId = user.SelectedGuildId;
      });
      console.log(this.selectedGId);
    }
  }
  ngOnDestroy(): void {
    this.logInChangeSub$.unsubscribe();
    this.loggedUser$.unsubscribe();
    this.selectedGuild$.unsubscribe();
  }
  guildSelectorHandler() {
    this.isOpenGuildsormVisible = true;
  }
  onHideOpenGuildsForm() {
    this.isOpenGuildsormVisible = false;
  }
}
