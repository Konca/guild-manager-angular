import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { CrudService } from 'src/app/service/crud.service';
import { LoginService } from 'src/app/service/login.service';
import { ProfileService } from 'src/app/service/profile.service';
import { RaidListComponent } from '../raid-list/raid-list.component';

@Component({
  selector: 'app-raid-builder',
  templateUrl: './raid-builder.component.html',
  styleUrls: ['./raid-builder.component.css'],
})
export class RaidBuilderComponent implements OnInit, OnDestroy {
  constructor(
    private loginService: LoginService,
    private profileService: ProfileService,
    private crudService: CrudService,
    private route: ActivatedRoute
  ) {}
  @ViewChild(RaidListComponent) raidList: RaidListComponent;
  isAdmin: boolean;
  private logInChangeSub: Subscription;
  private roleChange: Subscription;
  guildId: string;
  raidId: string;
  sortedRaids: {};
  raidFoundStatus: number;
  raidDsc: { Name: string; Description: string; DateTime: Date };
  editable: boolean;
  scrollable: boolean;

  ngOnInit(): void {
    this.scrollable = true;
    this.editable = false;
    this.isAdmin = false;
    this.raidFoundStatus = 0;

    this.route.params.subscribe((params: Params) => {
      this.raidFoundStatus = 0;
      this.guildId = params['guildId'];
      this.raidId = params['raidId'];
      this.loadRaid(this.guildId, this.raidId);

      this.logInChangeSub = this.loginService.loginStatusChanged.subscribe(
        () => {
          this.crudService.readGuildData(this.guildId);
          this.roleChange =
            this.profileService.selectedGuildRankGroup$.subscribe((rankGrp) => {
              this.isAdmin = rankGrp === 'Admin';
            });
        }
      );
    });
  }
  ngOnDestroy(): void {
    this.logInChangeSub.unsubscribe();
    this.roleChange.unsubscribe();
  }

  loadRaid(guildId, raidId) {
    this.getRaids(guildId, raidId).then((raidData) => {
      if (raidData !== undefined) {
        this.raidFoundStatus = 200;
        this.raidDsc = {
          Name: raidData['Name'],
          Description: raidData['Description'],
          DateTime: raidData['Date'].toDate(),
        };
        this.sortedRaids = raidData['SortedRaids'];
      } else {
        this.raidFoundStatus = 404;
      }
    });
  }
  saveRaidHandler() {
    this.raidList.saveToFirestore();
  }
  editHandler() {
    this.editable = true;
  }

  getRaids(guildId: string, raidId: string) {
    return this.crudService
      .readSelectedRaidData(guildId, raidId)
      .then((data) => {
        return data.data();
      });
  }
  toggleAutoScrollHandler() {
    this.scrollable = !this.scrollable;
  }
}
