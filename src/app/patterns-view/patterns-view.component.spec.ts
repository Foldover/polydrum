import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternsViewComponent } from './patterns-view.component';

describe('PatternsViewComponent', () => {
  let component: PatternsViewComponent;
  let fixture: ComponentFixture<PatternsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatternsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
