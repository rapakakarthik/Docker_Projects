import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqDmComponent } from './rfq-dm.component';

describe('RfqDmComponent', () => {
  let component: RfqDmComponent;
  let fixture: ComponentFixture<RfqDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RfqDmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfqDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
