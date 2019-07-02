import {Component, Host, Input, OnInit} from '@angular/core';
import {CompositionStoreService} from '../../../../composition-store.service';
import {IStep} from '../../../../interfaces';
import {TrackComponent} from '../track.component';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CompositionService} from '../../../../composition.service';
import {AudioService} from '../../../../audio.service';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {

  @Input() public patternN: number;
  @Input() public trackN: number;
  @Input() public stepN: number;
  public active = false;
  public stepStateObservable: Observable<IStep>;
  private uuid: string;

  constructor(public compositionStoreService: CompositionStoreService,
              private compositionService: CompositionService,
              private audioService: AudioService) {
  }

  ngOnInit() {
    this.stepStateObservable = this.compositionStoreService.state$.pipe(
      map(state => state.patterns[this.patternN].tracks[this.trackN].steps[this.stepN]),
      filter(step => step !== undefined),
      distinctUntilChanged((prev, curr) => prev.active !== curr.active)
    );
    this.stepStateObservable.subscribe(stepState => {
      this.active = stepState.active;
      this.uuid = stepState.uuid;
    });
  }

  onStepClicked($event: MouseEvent) {
    this.compositionService.toggleStep(this.uuid);
    const track = this.compositionService.findTrackFromStep(this.uuid);
    const pattern = this.compositionService.findPatternFromTrack(track.uuid);
    this.audioService.setStep(pattern.uuid, track.uuid, this.stepN, this.active);
  }
}
