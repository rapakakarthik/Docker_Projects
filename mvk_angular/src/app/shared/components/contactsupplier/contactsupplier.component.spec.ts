import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsupplierComponent } from './contactsupplier.component';

describe('ContactsupplierComponent', () => {
  let component: ContactsupplierComponent;
  let fixture: ComponentFixture<ContactsupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
