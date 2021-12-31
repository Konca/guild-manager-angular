import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrudService, GuildData } from 'src/app/service/crud.service';
import { LoginService } from 'src/app/service/login.service';
import { ProfileService } from 'src/app/service/profile.service';
import { User } from 'src/app/shared/user.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

export interface RolesInterface {
  GroupName: string;
  Roles: { Id: string; Name: string; Group: string }[];
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  private logInChangeSub$: Subscription;
  private loggedUser$: Subscription;
  private selectedGuild$: Subscription;
  private currRole$: Subscription;
  roleInCurrGuild: string;
  isLoggedIn: boolean;
  user: User;
  userName: string;
  roles: any[];
  guildDataRead: boolean;
  selectedGuild: string;
  selectedGId: string;
  isOpenGuildsormVisible: boolean;
  constructor(
    private loginService: LoginService,
    private profileService: ProfileService,
    private crudService: CrudService
  ) {}

  ngOnInit(): void {
    this.guildDataRead = false;
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
        this.crudService.readGuildData(user.SelectedGuildId);
     
      this.currRole$ = this.profileService.selectedGuildRankGroup$.subscribe(
        (rank) => (this.roleInCurrGuild = rank)
      );
      if (this.selectedGId) {
        this.selectedGuild$ = this.crudService.guildData$.subscribe((guild) => {
          this.roles = this.sortHierarchy(guild.Roles);
          this.guildDataRead = true;
        });
      } });
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      if (event.previousIndex !== event.currentIndex) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data[event.currentIndex]['Group'] = event.container.id;
    }
  }

  saveToFirestore() {
    const saveData = {
      Roles: {},
    };
    this.roles.forEach((item) => {
      item.Roles.forEach((element) => {
        saveData.Roles[element.Id] = element;
      });
    });
    this.crudService
      .uploadGuildRoles(this.selectedGId, saveData)
      .then(() => window.alert('Saved Successfully'))
      .catch(() => window.alert('Saved Failed'));
  }
  sortHierarchy(roles) {
    const sortedRoles: RolesInterface[] = [
      { GroupName: 'Admin', Roles: [] },
      { GroupName: 'Veteran', Roles: [] },
      { GroupName: 'Raider', Roles: [] },
      { GroupName: 'Rookie', Roles: [] },
      { GroupName: 'Misc', Roles: [] },
    ];
    Object.keys(roles).forEach((key) => {
      switch (roles[key].Group) {
        case 'Admin':
          sortedRoles[0].Roles.push(roles[key]);
          break;
        case 'Veteran':
          sortedRoles[1].Roles.push(roles[key]);
          break;
        case 'Raider':
          sortedRoles[2].Roles.push(roles[key]);
          break;
        case 'Rookie':
          sortedRoles[3].Roles.push(roles[key]);
          break;
        default:
          sortedRoles[4].Roles.push(roles[key]);
          break;
      }
    });
    return sortedRoles;
  }

  ngOnDestroy(): void {
    this.logInChangeSub$.unsubscribe();
    this.loggedUser$.unsubscribe();
    this.selectedGuild$.unsubscribe();
    this.currRole$.unsubscribe();
  }
  guildSelectorHandler() {
    this.isOpenGuildsormVisible = true;
  }
  onHideOpenGuildsForm() {
    this.isOpenGuildsormVisible = false;
  }
  logoutHandler() {
    this.loginService.logOutUser();
  }
}
