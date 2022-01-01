import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CrudService, GuildMembers } from 'src/app/service/crud.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { faWrench } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.css'],
})
export class RaidListComponent implements OnInit, OnDestroy {
  @Input() sortedRaids;
  @Input() raidId: string;
  @Input() guildId: string;
  @Input() editable: boolean;
  @Input() scrollable: boolean;
  @Output() onChange = new EventEmitter<boolean>();
  raidName:string
  faWrench = faWrench;
  showRaidOptions: boolean;
  private guildSub: Subscription;
  private readGuildRole: {
    [id: string]: { Id: string; Group: string; Name: string };
  };
  private guildMembers: GuildMembers;
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
    this.guildSub = this.crudService.guildData$.subscribe((data) => {
      this.showRaidOptions = false;
      this.readGuildRole = data.Roles;
    });
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
    this.crudService.readGuildMembers(this.guildId).then((data) => {
      this.guildMembers = data.data();
      Object.values(this.sortedRaids.RaidMembers).forEach((member) => {
        const readMember = {
          Class: member['Class'],
          Id: member['Id'],
          Name: member['Name'],
          Role: member['Role'],
          Spec: member['Spec'],
          Status: member['Status'],
          AssignedTo: member['AssignedTo'],
          GuildRoleGroup: this.getSavedPlayerRole(member),
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
    });
  }
  ngOnDestroy(): void {
    this.guildSub.unsubscribe();
  }
  setAnyChanges(val: boolean) {
    this.onChange.emit(val);
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      if (event.previousIndex !== event.currentIndex) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.setAnyChanges(true);

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
        if (this.scrollable) {
          event.container.element.nativeElement.children[
            event.currentIndex
          ].scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
        event.container.data[event.currentIndex]['AssignedTo'] =
          event.container.id.includes('Nothing')
            ? 'Nothing'
            : event.container.id;
        this.setAnyChanges(true);
        this.saveToRealtime();
      }, 200);
    }
  }
  saveToRealtime() {
    console.log('drop & save');
  }
  addRaidHandler() {
    this.raidInfo.push('Raid' + (this.raidInfo.length + 1));
    this.raidGroups.push([]);
    console.log(this.raidGroups);
  }
  getSavedPlayerRole(member) {
    if (!member.GuildRoleGroup) return this.getCurrentPlayerRole(member.Id);
    return member.GuildRoleGroup;
  }
  getCurrentPlayerRole(id: string) {
    if (!this.guildMembers) return '';
    if (!this.guildMembers[id]) return 'Pug';
    return this.readGuildRole[this.guildMembers[id].Role].Group;
  }
  refreshPlayerRoles() {
    console.log(this.raidGroups);
    this.raidGroups.map((raidMember) => {
      if (raidMember.length === 0) return;
      const member = raidMember;
      //member.GuildRoleGroup = this.getCurrentPlayerRole(member.Id);
      return member;
    });
    console.log(this.classes);
    this.classes.map((team) =>
      team.map((raidMember) => {
        const member = raidMember;
        member.GuildRoleGroup = this.getCurrentPlayerRole(member.Id);
        return member;
      })
    );
    console.log(this.miscFields);
    this.miscFields.map((team) =>
      team.map((raidMember) => {
        const member = raidMember;
        member.GuildRoleGroup = this.getCurrentPlayerRole(member.Id);
        return member;
      })
    );
  }

  openRaidOptionsHandler(event) {
    this.showRaidOptions = true;
    this.raidName=this.raidInfo[event.currentTarget.id.split("-")[1]]
  }
  closeRaidOptionsHandler() {
    this.showRaidOptions = false;
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
      .then(() => {
        window.alert('Saved Successfully');
        this.setAnyChanges(false);
      })
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
