import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRaidInfoComponent } from './edit-raid-info.component';

describe('EditRaidInfoComponent', () => {
  let component: EditRaidInfoComponent;
  let fixture: ComponentFixture<EditRaidInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRaidInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRaidInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
