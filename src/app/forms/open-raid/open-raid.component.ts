import { Component, Input, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { ControlContainer, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-open-raid',
  templateUrl: './open-raid.component.html',
  styleUrls: ['./open-raid.component.css'],

  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class OpenRaidComponent implements OnInit {
  guildId: string;
  link: string;
  @Input() isFormValid: boolean;
  @Input() raidObj: { selectedRaid: { Id: string } };

  raidList: {
    Id: string;
    Name: string;
    CreatorName: string;
    Date: Date;
  }[] = [];
  constructor(private crudService: CrudService, private router: Router,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.link =
      "To generate a links, select a raid and click the 'Get Link' button";
    this.isFormValid = false;
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
  onSubmitFormHandler() {
    this.router.navigate(["/raidBuilder/"+this.guildId+"/"+this.raidObj.selectedRaid.Id]);
  }
  showLinkHandler() {
    this.link = window.location.origin + "/raidBuilder/" +this.guildId + '/' + this.raidObj.selectedRaid.Id;
  }
  async getRaidData(guildId) {
    const raidz = await this.crudService.readRaidsListData(guildId).then((data) => {
      const raids = [];
      data.docs.forEach((doc) => {
        raids.push(doc.data());
      });
      return raids;
    });
    return raidz;
  }
}
