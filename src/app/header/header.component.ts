import { Component, OnInit } from '@angular/core';
import { faHome, faCaretDown, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  faHome = faHome;
  faCaretDown = faCaretDown;
  faBars = faBars;

  isDDVisible = false;
  isMobileMenuVisible = false;
  isOpenRaidFormVisible = false;

  constructor() {}

  ngOnInit(): void {}

  onShowDD() {
    this.isDDVisible = !this.isDDVisible;
  }
  onShowMobileMenu() {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }
  onShowOpenRaidForm() {
    this.isMobileMenuVisible = false;
    this.isDDVisible = false;
    this.isOpenRaidFormVisible = true;
  }
  onHideOpenRaidForm() {
    this.isOpenRaidFormVisible = false;
  }
}
