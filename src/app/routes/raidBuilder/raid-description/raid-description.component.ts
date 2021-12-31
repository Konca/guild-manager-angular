import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-raid-description',
  templateUrl: './raid-description.component.html',
  styleUrls: ['./raid-description.component.css']
})
export class RaidDescriptionComponent {
@Input() raidFoundStatus:number
@Input() raidDetails:{Name:string, Description:string, DateTime:Date}
  constructor() { }

  

}
