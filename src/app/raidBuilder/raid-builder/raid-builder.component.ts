import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { CrudService } from 'src/app/service/crud.service';
import { LoginService } from 'src/app/service/login.service';
import { RaidListComponent } from '../raid-list/raid-list.component';

@Component({
  selector: 'app-raid-builder',
  templateUrl: './raid-builder.component.html',
  styleUrls: ['./raid-builder.component.css'],
})
export class RaidBuilderComponent implements OnInit, OnDestroy {
  constructor(
    private loginService: LoginService,
    private crudService: CrudService,
    private route: ActivatedRoute
  ) {}
  @ViewChild(RaidListComponent) raidList: RaidListComponent;
  isLoggedIn: boolean;
  private logInChangeSub: Subscription;
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
    this.logInChangeSub = this.loginService.loginStatusChanged.subscribe(
      (isUserLoggedIn) => {
        this.isLoggedIn = isUserLoggedIn;
      }
    );
    this.raidFoundStatus = 0;

    this.route.params.subscribe((params: Params) => {
      this.guildId = params['guildId'];
      this.raidId = params['raidId'];
      this.loadRaid(this.guildId, this.raidId);
    });
  }
  ngOnDestroy(): void {
    this.logInChangeSub.unsubscribe();
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
