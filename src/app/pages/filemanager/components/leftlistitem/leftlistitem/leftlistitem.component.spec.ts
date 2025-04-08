import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftlistitemComponent } from './leftlistitem.component';

describe('LeftlistitemComponent', () => {
  let component: LeftlistitemComponent;
  let fixture: ComponentFixture<LeftlistitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftlistitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftlistitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
