import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PatternsViewComponent } from './patterns-view/patterns-view.component';
import { PatternComponent } from './patterns-view/pattern/pattern.component';
import { TrackComponent } from './patterns-view/pattern/track/track.component';
import { StepComponent } from './patterns-view/pattern/track/step/step.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AudioPermissionsDialogComponent } from './audio-permissions-dialog/audio-permissions-dialog.component';
import { OverlayActionDirective } from './overlay-action.directive';

@NgModule({
  declarations: [
    AppComponent,
    PatternsViewComponent,
    PatternComponent,
    TrackComponent,
    StepComponent,
    AudioPermissionsDialogComponent,
    OverlayActionDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent, AudioPermissionsDialogComponent]
})
export class AppModule { }
