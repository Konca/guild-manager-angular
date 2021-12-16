import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-raid-description',
  templateUrl: './raid-description.component.html',
  styleUrls: ['./raid-description.component.css']
})
export class RaidDescriptionComponent implements OnInit {
@Input() raidFoundStatus:number
@Input() raidInfo:{Name:string, Description:string, DateTime:Date}
  constructor() { }

  ngOnInit(): void {
  }

}
