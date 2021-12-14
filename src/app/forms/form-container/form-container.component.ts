import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.css'],
})
export class FormContainerComponent implements OnInit {
  formValid: boolean;
  @Input() title: string;
  @Output() closeForm = new EventEmitter();
  faWindowClose = faWindowClose;
  constructor() {}

  ngOnInit(): void {
    this.formValid = false;
  }

  onCloseForm() {
    this.closeForm.emit();
  }
  onSubmit(form:NgForm) {
    console.log(form)
  }
}
