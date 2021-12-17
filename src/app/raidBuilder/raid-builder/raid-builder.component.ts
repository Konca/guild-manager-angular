import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { RaidListComponent } from '../raid-list/raid-list.component';

@Component({
  selector: 'app-raid-builder',
  templateUrl: './raid-builder.component.html',
  styleUrls: ['./raid-builder.component.css'],
})
export class RaidBuilderComponent implements OnInit {
  constructor(
    private crudService: CrudService,
    private route: ActivatedRoute
  ) {}
  @ViewChild (RaidListComponent) raidList: RaidListComponent;
  guildId: string;
  raidId: string;
  sortedRaids: {};
  raidFoundStatus: number;
  raidDsc: { Name: string; Description: string; DateTime: Date };
  ngOnInit(): void {
    this.raidFoundStatus = 0;

    this.guildId = this.route.snapshot.params['guildId'];
    this.raidId = this.route.snapshot.params['raidId'];
    this.getRaids(this.guildId, this.raidId).then((raidData) => {
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

  saveRaidHandler(
  ) {
    this.raidList.saveToFirestore()}
  editHandler() {}

  getRaids(guildId: string, raidId: string) {
    return this.crudService
      .readSelectedRaidData(guildId, raidId)
      .then((data) => {
        return data.data();
      });
  }
}
