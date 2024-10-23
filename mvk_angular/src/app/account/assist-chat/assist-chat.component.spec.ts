import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistChatComponent } from './assist-chat.component';

describe('AssistChatComponent', () => {
  let component: AssistChatComponent;
  let fixture: ComponentFixture<AssistChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssistChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
