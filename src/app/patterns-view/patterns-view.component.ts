import { Component, OnInit } from '@angular/core';
import {CompositionStoreService} from '../composition-store.service';
import {CompositionService} from '../composition.service';
import {IPattern} from '../interfaces';
import {map, tap} from 'rxjs/operators';
import {Observable, pipe} from 'rxjs';
import {AudioService} from '../audio.service';

@Component({
  selector: 'app-patterns-view',
  templateUrl: './patterns-view.component.html',
  styleUrls: ['./patterns-view.component.css']
})
export class PatternsViewComponent implements OnInit {

  public currentlySelectedPattern$: Observable<IPattern>;
  private currentlySelectedPattern: IPattern;

  private name: string;

  constructor(private compositionStoreService: CompositionStoreService,
              private compositionService: CompositionService,
              private audioService: AudioService) {
    this.compositionStoreService.state$.pipe(tap(state => {
      this.name = state.name;
    })).subscribe();
  }

  ngOnInit() {
    this.currentlySelectedPattern$ = this.compositionStoreService.state$.pipe(
      map(state => this.compositionService.findPatternWithUUID(state.currentlySelectedPattern)),
      tap(pattern => {
        this.currentlySelectedPattern = pattern;
      }),
    );
    this.currentlySelectedPattern$.subscribe();
  }

  onSaveClick($event: MouseEvent) {
    this.compositionService.save(this.name);
  }

  onFileInputChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];
    this.compositionService.load(file);
  }

  onSelectedPatternChange($event: Event) {
    this.compositionService.selectPattern(($event.target as HTMLSelectElement).value);
  }

  onPlayClick($event: MouseEvent) {
    this.audioService.play();
  }

  onPauseClick($event: MouseEvent) {
    this.audioService.pause();
  }

  onStopClick($event: MouseEvent) {
    this.audioService.stop();
  }

  onNameInputKeyDownEnter($event: Event) {
    this.compositionService.setCompositionName(($event.target as HTMLInputElement).value);
  }

  onNameInputBlur($event: FocusEvent) {
    this.compositionService.setCompositionName(($event.target as HTMLInputElement).value);
  }

  onBPMChange($event: Event) {
    this.compositionService.setBPM(parseInt(($event.target as HTMLInputElement).value, 10));
    this.audioService.setBPM(parseInt(($event.target as HTMLInputElement).value, 10));
  }

  onAddPatternClick($event: MouseEvent) {
    this.compositionService.addPattern();

  }

  onAddTrackClick($event: MouseEvent) {
    this.compositionService.addTrack(this.currentlySelectedPattern.uuid);
  }
}
