import {Component, ElementRef, Host, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IStep, ITrack} from '../../../interfaces';
import {PatternComponent} from '../pattern.component';
import {CompositionStoreService} from '../../../composition-store.service';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {CompositionService} from '../../../composition.service';
import {tap} from 'rxjs/internal/operators/tap';
import {AudioService} from '../../../audio.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  @Input() public patternN;
  @Input() public trackN;

  public trackStateObservable: Observable<ITrack>;

  private uuid: string;
  private patternUuid: string;

  constructor(public compositionStoreService: CompositionStoreService,
              private compositionService: CompositionService,
              private  audioService: AudioService) {
  }

  ngOnInit() {
    this.trackStateObservable = this.compositionStoreService.state$.pipe(
      tap(state => this.patternUuid = state.patterns[this.patternN].uuid),
      map(state => state.patterns[this.patternN].tracks[this.trackN]),
      tap(track => { this.uuid = track.uuid; }),
      distinctUntilChanged(CompositionStoreService.stateHasChanged)
    );
  }

  onMuteClick($event: Event) {
    this.compositionService.setMute(this.uuid, ($event.target as HTMLInputElement).checked);
  }

  onNameInputBlur($event: FocusEvent) {
    this.compositionService.setTrackName(this.uuid, ($event.target as HTMLInputElement).value);
  }

  onNameInputKeyDownEnter($event) {
    this.compositionService.setTrackName(this.uuid, ($event.target as HTMLInputElement).value);
  }

  onStepsNumberChange($event: Event) {
    const value = parseInt(($event.target as HTMLInputElement).value, 10);
    if (value > 32) {
      ($event.target as HTMLInputElement).value = '32';
    }
    if (value < 1) {
      ($event.target as HTMLInputElement).value = '1';
    }
    this.compositionService.setStepsCountForTrack(this.uuid, parseInt(($event.target as HTMLInputElement).value, 10));
    this.audioService.setStepCount(this.compositionService.findPatternFromTrack(this.uuid).uuid, this.uuid, value);
  }

  onAudioFileInputChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];
    this.compositionService.setAudioFilePath(file.name, this.uuid);
    this.audioService.setAudioFile(file, this.patternUuid, this.uuid);
  }
}
