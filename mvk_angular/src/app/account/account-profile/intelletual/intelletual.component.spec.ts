import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelletualComponent } from './intelletual.component';

describe('IntelletualComponent', () => {
  let component: IntelletualComponent;
  let fixture: ComponentFixture<IntelletualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntelletualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntelletualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
