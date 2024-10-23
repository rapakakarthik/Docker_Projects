import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNowComponent } from './chat-now.component';

describe('ChatNowComponent', () => {
  let component: ChatNowComponent;
  let fixture: ComponentFixture<ChatNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatNowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
