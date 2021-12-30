import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { faDiscord } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-std-button',
  templateUrl: './std-button.component.html',
  styleUrls: ['./std-button.component.css'],
})
export class StdButtonComponent implements OnInit, OnChanges {
  faDiscord = faDiscord;
  buttonStyle: string;
  buttonText: string;
  buttonType: string;
  disabledClass: string;
  specialIcon: string;
  @Input() disabled: boolean;
  @Input() buttonInfo: { text: string; style: string; type: string };
  @Output() click = new EventEmitter();
  constructor() {}
  
  ngOnInit(): void {
    
    this.buttonStyle = this.buttonInfo.style;
    this.buttonText = this.buttonInfo.text;
    this.buttonType = this.buttonInfo.type;
    if (this.buttonInfo.type === 'discord') {
      this.specialIcon = this.buttonInfo.type;
      this.buttonType = 'button';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.disabledClass = this.disabled ? 'disabled' : '';
  }
  onClickHandler() {
    this.click.emit();
  }
}
