import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../shared/user.model';
import { CrudService, Guilds } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService implements OnDestroy {
  public selectedGuildRankGroup$ = new BehaviorSubject<string>('');
  private selectedGuild: Subscription;
  public user$ = new BehaviorSubject<User>({
    Email: '',
    Discriminator: '',
    Id: '',
    UserName: '',
    SelectedGuildId: '',
    SelectedGuildName: '',
    AccessToken: '',
    ExpiresOn: '',
    RefreshToken: '',
  });
  private user: Subscription;
  public guilds$ = new BehaviorSubject<Guilds>({
    '': {
      Id: '',
      Name: '',
      Rank: '',
      Server: '',
    },
  });
  private guilds: Subscription;

  ngOnDestroy(): void {
    this.user.unsubscribe();
    this.guilds.unsubscribe();
    this.selectedGuild.unsubscribe();
  }
  constructor(private crudService: CrudService) {}

  async getUserProfile() {
    this.user =  this.crudService.user$.subscribe((data) => {
      this.user$.next(data);
   
    this.guilds = this.crudService.usersGuilds$.subscribe((data) => {
      this.guilds$.next(data);
    });
    
    this.selectedGuild = this.crudService.guildData$.subscribe((guild) => {
      this.selectedGuildRankGroup$.next(guild.Roles[this.guilds$.value[guild.Id].Rank].Group);
    }); });
  }
}
