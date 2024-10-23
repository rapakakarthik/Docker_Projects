import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWrapComponent } from './chat-wrap.component';

describe('ChatWrapComponent', () => {
  let component: ChatWrapComponent;
  let fixture: ComponentFixture<ChatWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatWrapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
