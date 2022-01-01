import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-raid-info',
  templateUrl: './edit-raid-info.component.html',
  styleUrls: ['./edit-raid-info.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class EditRaidInfoComponent implements OnInit {
  @Input() isFormValid: boolean;
  @Input()raidName:string
  @Input() raidObj: { raidName:string };

  constructor(){}

  ngOnInit(): void {
    this.isFormValid = false;
    this.raidObj={raidName:this.raidName}
    
  }
  removeRaid() {}
   onSubmitFormHandler() {
      console.log( this.raidObj.raidName)
     
    
  }
}
