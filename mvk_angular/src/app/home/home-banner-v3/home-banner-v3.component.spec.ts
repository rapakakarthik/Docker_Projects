import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBannerV3Component } from './home-banner-v3.component';

describe('HomeBannerV3Component', () => {
  let component: HomeBannerV3Component;
  let fixture: ComponentFixture<HomeBannerV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBannerV3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeBannerV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
