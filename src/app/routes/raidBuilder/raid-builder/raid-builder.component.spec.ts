import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidBuilderComponent } from './raid-builder.component';

describe('RaidBuilderComponent', () => {
  let component: RaidBuilderComponent;
  let fixture: ComponentFixture<RaidBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaidBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaidBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
