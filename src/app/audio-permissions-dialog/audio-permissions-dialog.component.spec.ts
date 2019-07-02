import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPermissionsDialogComponent } from './audio-permissions-dialog.component';

describe('AudioPermissionsDialogComponent', () => {
  let component: AudioPermissionsDialogComponent;
  let fixture: ComponentFixture<AudioPermissionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioPermissionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioPermissionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
