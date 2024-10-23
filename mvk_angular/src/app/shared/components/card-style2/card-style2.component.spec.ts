import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStyle2Component } from './card-style2.component';

describe('CardStyle2Component', () => {
  let component: CardStyle2Component;
  let fixture: ComponentFixture<CardStyle2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardStyle2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardStyle2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
