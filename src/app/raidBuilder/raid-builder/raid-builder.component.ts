import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { lastValueFrom } from 'rxjs';

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
  guildId: string;
  raidId: string;
  raidInfo: any
  raidFoundStatus: number;
  raidDsc:{Name:string, Description:string, DateTime:Date}
  ngOnInit(): void {
    this.raidFoundStatus=0

    this.guildId = this.route.snapshot.params['guildId'];
    this.raidId = this.route.snapshot.params['raidId'];
    this.getRaids(this.guildId, this.raidId).then((raidInfo) => {
      this.raidDsc={Name:raidInfo["Name"], Description:raidInfo["Description"], DateTime:raidInfo["Date"].toDate()}
      console.log(raidInfo);
      if (raidInfo !== undefined) this.raidFoundStatus = 200;
      else {
        this.raidFoundStatus = 404;
      }
    });
  }

  saveRaidHandler() {}
  editHandler() {}

  getRaids(guildId: string, raidId: string) {
    return this.crudService
      .readSelectedRaidData(guildId, raidId)
      .then((data) => {
        return data.data();
      });
  }
}
