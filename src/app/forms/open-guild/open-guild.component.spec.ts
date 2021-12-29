import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenGuildComponent } from './open-guild.component';

describe('OpenGuildComponent', () => {
  let component: OpenGuildComponent;
  let fixture: ComponentFixture<OpenGuildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenGuildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenGuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
