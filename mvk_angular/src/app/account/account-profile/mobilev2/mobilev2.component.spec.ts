import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mobilev2Component } from './mobilev2.component';

describe('Mobilev2Component', () => {
  let component: Mobilev2Component;
  let fixture: ComponentFixture<Mobilev2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mobilev2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mobilev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
