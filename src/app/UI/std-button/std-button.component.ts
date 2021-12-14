import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-std-button',
  templateUrl: './std-button.component.html',
  styleUrls: ['./std-button.component.css'],
})
export class StdButtonComponent implements OnInit {
  buttonStyle: string;
  buttonText: string;  
  buttonType:string
  disabledClass: string;
  @Input() disabled: boolean
  @Input() buttonInfo: { text: string; style: string;type:string };
  @Output() click = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.buttonStyle = this.buttonInfo.style;
    this.buttonText = this.buttonInfo.text;
    this.disabledClass = this.disabled ? 'disabled' : '';
  }

  onClickHandler() {
    this.click.emit();
  }
}
