import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-list-item',
  templateUrl: './player-list-item.component.html',
  styleUrls: ['./player-list-item.component.css'],
})
export class PlayerListItemComponent implements OnInit {
  @Input() raidMember: {
    Class: string;
    Id: string;
    Name: string;
    Role: string;
    Spec: string;
    Status: string;
  };
  class: string;
  id: string;
  name: string;
  role: string;
  spec: string;
  status: string;
  constructor() {}

  ngOnInit(): void {
   
  }
}
