import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfgListComponent } from './mfg-list.component';

describe('MfgListComponent', () => {
  let component: MfgListComponent;
  let fixture: ComponentFixture<MfgListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfgListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MfgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
