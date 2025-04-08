import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftlistitemheaderComponent } from './leftlistitemheader.component';

describe('LeftlistitemheaderComponent', () => {
  let component: LeftlistitemheaderComponent;
  let fixture: ComponentFixture<LeftlistitemheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftlistitemheaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftlistitemheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
