import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-guild-roster',
  templateUrl: './guild-roster.component.html',
  styleUrls: ['./guild-roster.component.css'],
})
export class GuildRosterComponent implements OnInit {
  constructor(private crudService: CrudService) {}

  ngOnInit(): void {}

  createGuild() {
    const guild = { 131313: { Name: 'dicks', Id: '131313' } };

    this.crudService.uploadGuildData(guild).then((res) => {
      console.log(res);
    });
  }
  getGuilds() {
    this.crudService.readGuildData().then((data) => {
      data.docs.forEach((doc) => {
        console.log(doc.data());
      });
    });
  }
  getRaids(){
    this.crudService.readRaidData("712626754883158036").then((data) => {
      data.docs.forEach((doc) => {
        console.log(doc.data());
      });
    });
  }
  onGuildListLoad() {}
}
