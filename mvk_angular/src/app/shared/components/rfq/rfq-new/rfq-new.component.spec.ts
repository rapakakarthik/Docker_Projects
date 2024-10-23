import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqNewComponent } from './rfq-new.component';

describe('RfqNewComponent', () => {
  let component: RfqNewComponent;
  let fixture: ComponentFixture<RfqNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfqNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfqNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
