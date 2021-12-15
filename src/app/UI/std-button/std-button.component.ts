import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-std-button',
  templateUrl: './std-button.component.html',
  styleUrls: ['./std-button.component.css'],
})
export class StdButtonComponent implements OnInit, OnChanges {
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
    this.buttonType = this.buttonInfo.type;
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.disabledClass = this.disabled ? 'disabled' : '';
  }
  onClickHandler() {
    this.click.emit();
  }
}
