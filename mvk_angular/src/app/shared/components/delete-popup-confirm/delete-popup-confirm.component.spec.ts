import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePopupConfirmComponent } from './delete-popup-confirm.component';

describe('DeletePopupConfirmComponent', () => {
  let component: DeletePopupConfirmComponent;
  let fixture: ComponentFixture<DeletePopupConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePopupConfirmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletePopupConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
