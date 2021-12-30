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

}
