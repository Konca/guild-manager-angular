import { Component, OnInit, } from '@angular/core';
import { faHome, faCaretDown, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnInit {
  faHome = faHome;
  faCaretDown = faCaretDown;
  isDDVisible = false;
  isMobileMenuVisible = false;
  faBars = faBars;

  constructor() {}

  ngOnInit(): void {}

  onShowDD() {
    this.isDDVisible = !this.isDDVisible;
  }
  onShowMobileMenu(){
    this.isMobileMenuVisible=!this.isMobileMenuVisible
  }

}
