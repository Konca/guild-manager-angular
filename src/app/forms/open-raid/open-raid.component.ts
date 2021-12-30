import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { ControlContainer, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';
@Component({
  selector: 'app-open-raid',
  templateUrl: './open-raid.component.html',
  styleUrls: ['./open-raid.component.css'],

  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class OpenRaidComponent implements OnInit, OnDestroy {
  guildId: string;
  guildName: string;
  link: string;
  @Input() isFormValid: boolean;
  @Input() raidObj: { selectedRaid: { Id: string } };
  raidz: Subscription;
  userSub: Subscription;

  raidList: {
    Id: string;
    Name: string;
    CreatorName: string;
    Date: Date;
  }[] = [];
  constructor(
    private crudService: CrudService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.link =
      "To generate a links, select a raid and click the 'Get Link' button";
    this.isFormValid = false;
    this.userSub = this.profileService.user$.subscribe((data) => {
      this.guildId = data.SelectedGuildId;
      this.guildName = data.SelectedGuildName;
    });

    this.crudService.readRaidsListData(this.guildId);
    this.raidz = this.crudService.raids$.subscribe((data) => {
      this.raidList = [];
      data.forEach((raid) => {
        this.raidList.push({
          Id: raid.Id,
          Name: raid.Name,
          CreatorName: raid.CreatorName,
          Date: raid.Date.toDate(),
        });
      });
    });
  }
  ngOnDestroy(): void {
    this.raidz.unsubscribe();
    this.userSub.unsubscribe();
  }
  onSubmitFormHandler() {
    this.router.navigate([
      '/raidBuilder/' + this.guildId + '/' + this.raidObj.selectedRaid.Id,
    ]);
  }
  showLinkHandler() {
    this.link =
      window.location.origin +
      '/raidBuilder/' +
      this.guildId +
      '/' +
      this.raidObj.selectedRaid.Id;
  }
 
}
