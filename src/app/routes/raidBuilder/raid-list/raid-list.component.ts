import { Component, Input, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.css'],
})
export class RaidListComponent implements OnInit {
  @Input() sortedRaids;
  @Input() raidId: string;
  @Input() guildId: string;
  @Input() editable: boolean;
  @Input() scrollable: boolean;
  classInfo: { Name: string; func: any }[];
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
  miscFields: [any[], any[]] = [[], []];
  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.classInfo = [
      {
        Name: 'Tanks',
        func: this.tankPredicate,
      },
      {
        Name: 'Healers',
        func: this.healerPredicate,
      },

      {
        Name: 'Melee-DPS',
        func: this.meleePredicate,
      },
      {
        Name: 'Ranged-DPS',
        func: this.rangedPredicate,
      },
    ];

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
            melee.push(readMember);
            break;
          case 'Ranged-DPS':
            ranged.push(readMember);
            break;
        }
      } else if (readMember.AssignedTo === 'NoShow') {
        this.miscFields[1].push(readMember);
      } else if (readMember.AssignedTo === 'Absent') {
        this.miscFields[0].push(readMember);
      } else {
        raidGroups[+readMember.AssignedTo.match(/\d/g).join('') - 1].push(
          readMember
        );
      }
    });
    this.classes.push(tanks);
    this.classes.push(healers);
    this.classes.push(melee);
    this.classes.push(ranged);
    this.raidGroups = raidGroups;
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      if (event.previousIndex !== event.currentIndex) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        this.saveToRealtime();
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      setTimeout(() => {
        if (this.scrollable){
        event.container.element.nativeElement.children[
          event.currentIndex
        ].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });}
        event.container.data[event.currentIndex]['AssignedTo'] =
          event.container.id.includes('Nothing')
            ? 'Nothing'
            : event.container.id;
        this.saveToRealtime();
      }, 200);
    }
  }
  saveToRealtime() {
    console.log('drop & save');
  }
  saveToFirestore() {
    const saveData = {
      SortedRaids: {
        RaidInfo: { ...this.raidInfo },
        RaidMembers: {
          ...[
            ...this.raidGroups.flat(),
            ...this.classes.flat(),
            ...this.miscFields.flat(),
          ],
        },
      },
    };
    this.crudService
      .uploadSelectedRaidData(this.guildId, this.raidId, saveData)
      .then(() => window.alert('Saved Successfully'))
      .catch(() => window.alert('Saved Failed'));
  }
  tankPredicate(item: CdkDrag<string>) {
    return item.data === 'Tank';
  }
  healerPredicate(item: CdkDrag<string>) {
    return item.data === 'Healer';
  }
  rangedPredicate(item: CdkDrag<string>) {
    return item.data === 'Ranged-DPS';
  }
  meleePredicate(item: CdkDrag<string>) {
    return item.data === 'Melee-DPS';
  }
}
