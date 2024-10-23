import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBannerComponent } from './tab-banner.component';

describe('TabBannerComponent', () => {
  let component: TabBannerComponent;
  let fixture: ComponentFixture<TabBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
