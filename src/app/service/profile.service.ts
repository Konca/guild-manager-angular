import { Injectable, OnDestroy } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../shared/user.model';
import { CrudService, Guilds } from './crud.service';
@Injectable({
  providedIn: 'root',
})
export class ProfileService implements OnDestroy {
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
      Server: ''
    },
  });
  private guilds: Subscription;

  ngOnDestroy(): void {
    this.user.unsubscribe();
    this.guilds.unsubscribe();
  }
  constructor(private crudService: CrudService) {}

  getUserProfile() {
    this.user = this.crudService.user$.subscribe((data) => {
      this.user$.next(data);
    });
    this.guilds = this.crudService.usersGuilds$.subscribe((data) => {
      this.guilds$.next(data);
    });
  }
}
