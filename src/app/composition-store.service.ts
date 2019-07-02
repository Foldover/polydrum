import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IComposition, IPattern, IStep, ITrack} from './interfaces';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CompositionStoreService {

  private firstPatternUuid = (() => {
    const id = uuid.v4();
    return () => id;
  })();

  private state = new BehaviorSubject<IComposition>({
    uuid: uuid.v4(),
    bpm: 120,
    name: 'New Project',
    currentlySelectedPattern: this.firstPatternUuid(),
    patterns: [{
      name: 'Pattern 0',
      uuid: this.firstPatternUuid(),
      tracks: [
        {
          filePath: null,
          steps: [
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
          ],
          muted: false,
          uuid: uuid.v4(),
          name: 'Track 1',
        },
        {
          filePath: null,
          steps: [
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
          ],
          muted: false,
          uuid: uuid.v4(),
          name: 'Track 2',
        },
        {
          filePath: null,
          steps: [
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
          ],
          muted: false,
          uuid: uuid.v4(),
          name: 'Track 3',
        },
        {
          filePath: null,
          steps: [
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
            {
              active: false,
              uuid: uuid.v4(),
            },
          ],
          muted: false,
          uuid: uuid.v4(),
          name: 'Track 4',
        },
      ]
    }],
  });

  public state$ = this.state.asObservable();

  static stateHasChanged(prev: any, curr: any) {
    const prevProps = Object.entries(prev);
    const currProps = Object.entries(curr);
    for (let i = 0; i < prevProps.length - 1; i++) {
      if (prevProps[i][1] !== currProps[i][1]) {
        return true;
      }
    }
    return false;
  }

  constructor() { }

  public update(state: Partial<IComposition>) {
    this.state.next({...this.state.getValue(), ...state});
  }

  public updatePattern(patternState: Partial<IPattern>, patternN: number) {
    const newState = this.state.getValue();
    newState.patterns[patternN] = {...newState.patterns[patternN], ...patternState};
    this.state.next(newState);
  }

  public updateTrack(trackState: Partial<ITrack>, patternN: number, trackN: number) {
    const newState = this.state.getValue();
    newState.patterns[patternN].tracks[trackN] = {...newState.patterns[patternN].tracks[trackN], ...trackState};
    this.state.next(newState);
  }

  public updateStep(stepState: Partial<IStep>, patternN: number, trackN: number, stepN: number) {
    const newState = this.state.getValue();
    newState.patterns[patternN].tracks[trackN].steps[stepN] = {...newState.patterns[patternN].tracks[trackN].steps[stepN], ...stepState};
    this.state.next(newState);
  }
}
