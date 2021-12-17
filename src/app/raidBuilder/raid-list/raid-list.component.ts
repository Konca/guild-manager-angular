import { Component, Input, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.css'],
})
export class RaidListComponent implements OnInit {
  @Input() sortedRaids;

  raidInfo: string[] = [];
  raidMembers: {
    Class: string;
    Id: string;
    Name: string;
    Role: string;
    Spec: string;
    Status: string;
    AssignedTo: string;
  }[];

  raidGroups: any[] = [];
  classes: any[] = [];
  //miscFields: [[], [], [], []] = [[], [], [], []];
  constructor() {}

  ngOnInit(): void {
    Object.keys(this.sortedRaids.RaidInfo).forEach((key) =>
      this.raidInfo.push(this.sortedRaids.RaidInfo[key])
    );
    const raidGroups = [];
    for (let i = 0; i < this.raidInfo.length; i++) {
      const raid = [];
      raidGroups.push(raid);
    }
    const tanks = [];
    const healers = [];
    const ranged = [];
    const melee = [];
    Object.values(this.sortedRaids.RaidMembers).forEach((member) => {
      const readMember = {
        Class: member['Class'],
        Id: member['Id'],
        Name: member['Name'],
        Role: member['Role'],
        Spec: member['Spec'],
        Status: member['Status'],
        AssignedTo: member['AssignedTo'],
      };
      if (readMember.AssignedTo === 'Nothing') {
        switch (readMember.Role) {
          case 'Tank':
            tanks.push(readMember);
            break;
          case 'Healer':
            healers.push(readMember);
            break;
          case 'Melee-DPS':
            ranged.push(readMember);
            break;
          case 'Ranged-DPS':
            melee.push(readMember);
            break;
        }
      } else if (readMember.AssignedTo === 'NoShow') {
      } else if (readMember.AssignedTo === 'Absent') {
      } else {
        raidGroups[+readMember.AssignedTo.match(/\d/g).join('') - 1].push(
          readMember
        );
      }
    });
    this.classes.push(tanks);
    this.classes.push(healers);
    this.classes.push(ranged);
    this.classes.push(melee);
    this.raidGroups = raidGroups;
    console.log(this.classes);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  tankPredicate(item: CdkDrag<string>) {
   
    return item.data==="Tank"
  }
  healerPredicate(item: CdkDrag<string>) {
   
    return item.data==="Healer"
  }
  rangedPredicate(item: CdkDrag<string>) {
   
    return item.data==="Ranged-DPS"
  }
  meleePredicate(item: CdkDrag<string>) {
   
    return item.data==="Melee-DPS"
  }
}
