import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-open-raid',
  templateUrl: './open-raid.component.html',
  styleUrls: ['./open-raid.component.css'],
})
export class OpenRaidComponent implements OnInit {
  formValid: boolean;
  guildId: string;
  raidList: {
    Id: string;
    Name: string;
    CreatorName: string;
    Date: Date;
  }[] = [];
  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.formValid = false;
    this.guildId = '712626754883158036';
    this.getRaidData(this.guildId).then((data) => {
      data.forEach((raid) => {
        console.log(raid);
        this.raidList.push({
          Id: raid.Id,
          Name: raid.Name,
          CreatorName: raid.CreatorName,
          Date: raid.Date.toDate(),
        });
      });
    });
  }

  async getRaidData(guildId) {
    const raidz = await this.crudService.readRaidData(guildId).then((data) => {
      const raids = [];
      data.docs.forEach((doc) => {
        raids.push(doc.data());
      });
      return raids;
    });
    return raidz;
  }
}
