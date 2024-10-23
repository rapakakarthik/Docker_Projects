import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuV2Component } from './menu-v2.component';

describe('MenuV2Component', () => {
  let component: MenuV2Component;
  let fixture: ComponentFixture<MenuV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
