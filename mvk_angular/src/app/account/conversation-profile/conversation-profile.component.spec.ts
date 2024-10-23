import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationProfileComponent } from './conversation-profile.component';

describe('ConversationProfileComponent', () => {
  let component: ConversationProfileComponent;
  let fixture: ComponentFixture<ConversationProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
