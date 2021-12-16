import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.css'],
})
export class FormContainerComponent implements OnInit {
  formValid: boolean;
  @ViewChild('thisform') thisForm: NgForm;
  @ViewChild('childForm') childForm: any; //any for reusability 
  @Input() type: string;
  @Input() title: string;
  @Output() closeForm = new EventEmitter();
  faWindowClose = faWindowClose;
  constructor() {}

  ngOnInit(): void {
    this.thisForm;
  }

  closeFormHandler() {
    this.closeForm.emit();
  }
  onSubmit() {
    console.log(this.thisForm.value);
    this.childForm.onSubmitFormHandler();
    this.closeFormHandler();
  }
}
