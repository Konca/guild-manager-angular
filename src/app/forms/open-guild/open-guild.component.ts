import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Guild, CrudService, Guilds } from 'src/app/service/crud.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-open-guild',
  templateUrl: './open-guild.component.html',
  styleUrls: ['./open-guild.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class OpenGuildComponent implements OnInit, OnDestroy {
  @Input() isFormValid: boolean;
  @Input() guildObj: { selectedGuild: { Id: string } };
  private usersGuilds$: Subscription;
  public usersGuilds: Guild[];
  private userGuildsObj: Guilds;

  constructor(
    private crudService: CrudService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.isFormValid = false;
    this.usersGuilds$ = this.profileService.guilds$.subscribe((guilds) => {
      this.userGuildsObj = guilds;
      this.usersGuilds = [...Object.values(this.userGuildsObj)];
    });
  }
  ngOnDestroy(): void {
    this.usersGuilds$.unsubscribe();
  }
  async onSubmitFormHandler() {
    const currentUser = await this.profileService.user$.getValue();
    this.crudService.uploadUser(currentUser.Id, {
      SelectedGuildId: this.guildObj.selectedGuild.Id,
      SelectedGuildName: this.userGuildsObj[this.guildObj.selectedGuild.Id].Name
    });
  }
}
