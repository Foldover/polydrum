import {Injectable} from '@angular/core';
import {CompositionStoreService} from './composition-store.service';
import {IComposition, IPattern, IStep, ITrack, IUUID} from './interfaces';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import * as uuidLib from 'uuid';
import {SerializerService} from './serializer.service';

@Injectable({
  providedIn: 'root'
})
export class CompositionService {

  private snapshotObservable: Observable<IComposition>;
  private stateSnapshot: IComposition;

  constructor(private composition: CompositionStoreService,
              private serializer: SerializerService) {
    this.snapshotObservable = this.composition.state$.pipe(
      tap(state => {
        this.stateSnapshot = state;
      })
    );
    this.snapshotObservable.subscribe(_ => (() => {})());
  }

  public static isStep(step: any): step is IStep {
    return (step as IStep).active !== undefined;
  }

  public static isTrack(track: any): track is ITrack {
    return (track as ITrack).steps !== undefined;
  }

  public static isPattern(pattern: any): pattern is IPattern {
    return (pattern as IPattern).tracks !== undefined;
  }

  public toggleStep(uuid: string) {
    const step = this.findStepWithUUID(uuid);
    step.active = !step.active;
    this.composition.update(this.stateSnapshot);
  }

  public setMute(uuid: string, muted: boolean) {
    const track = this.findTrackWithUUID(uuid);
    track.muted = muted;
    this.composition.update(this.stateSnapshot);
  }

  public setTrackName(uuid: string, name: string) {
    const track = this.findTrackWithUUID(uuid);
    track.name = name;
    this.composition.update(this.stateSnapshot);
  }

  public setStepsCountForTrack(uuid: string, count: number) {
    const track = this.findTrackWithUUID(uuid);
    const oldLength = track.steps.length;
    if (count < 1) { return; }
    if (count - oldLength > 0) {
      const newSteps: Array<IStep> = Array.from({length: count - oldLength})
        .map((step, i, arr) => ({
          uuid: uuidLib.v4(),
          active: false,
        }));
      track.steps.push(...newSteps);
    } else {
      track.steps.length = count;
    }
    this.composition.update(this.stateSnapshot);
  }

  public selectPattern(uuid: string) {
    const pattern = this.findPatternWithUUID(uuid);
    this.stateSnapshot.currentlySelectedPattern = pattern.uuid;
    this.composition.update(this.stateSnapshot);
  }

  public save(name: string) {
    this.serializer.serialize(this.stateSnapshot, name);
  }

  public load(file: File) {
    this.serializer.deserialize(file)
      .then(composition => {
        this.composition.update(composition);
      });
  }

  public setAudioFilePath(path: string, trackUuid: string) {
    const track = this.findTrackWithUUID(trackUuid);
    track.filePath = path;
    this.composition.update(this.stateSnapshot);
  }

  public findStepWithUUID(uuid: string): IStep {
    const tracks = this.stateSnapshot.patterns
      .reduce((result, pattern) => {
        result.push(...pattern.tracks);
        return result;
      }, [] as Array<ITrack>);
    const steps = tracks.reduce((result, track) => {
      result.push(...track.steps);
      return result;
    }, [] as Array<IStep>);
    const foundStep = steps.find(step => step.uuid === uuid);
    if (!CompositionService.isStep(foundStep)) {
      throw new Error('Step not found, something has gone horribly wrong');
    }
    return foundStep;
  }

  public findTrackWithUUID(uuid: string): ITrack {
    const tracks = this.stateSnapshot.patterns
      .reduce((result, pattern) => {
        result.push(...pattern.tracks);
        return result;
      }, [] as Array<ITrack>);
    const foundTrack = tracks.find(track => track.uuid === uuid);
    if (!CompositionService.isTrack(foundTrack)) {
      throw new Error('Track not found, something has gone horribly wrong');
    }
    return foundTrack;
  }

  public findPatternWithUUID(uuid: string): IPattern {
    const foundPattern = this.stateSnapshot.patterns.find(pattern => pattern.uuid === uuid);
    if (!CompositionService.isPattern(foundPattern)) {
      throw new Error('Pattern not found, something has gone horribly wrong');
    }
    return foundPattern;
  }

  public findTrackFromStep(stepUuid: string): ITrack {
    const found = this.stateSnapshot.patterns.reduce((acc, pattern) => {
      return acc.concat(pattern.tracks);
    }, [] as Array<ITrack>).find(track => {
      return track.steps.filter(step => step.uuid === stepUuid).length > 0;
    });
    if (!found) {
      throw Error('No track was found from this step');
    }
    return found;
  }

  public findPatternFromTrack(trackUuid: string): IPattern {
    const found = this.stateSnapshot.patterns.find(pattern => {
      return pattern.tracks.filter(track => track.uuid === trackUuid).length > 0;
    });
    if (!found) {
      throw Error('No pattern was found from this track');
    }
    return found;
  }

  public setCompositionName(value: string) {
    this.stateSnapshot.name = value;
    this.composition.update(this.stateSnapshot);
  }

  public setBPM(bpm: number) {
    this.stateSnapshot.bpm = bpm;
    this.composition.update(this.stateSnapshot);
  }

  public createStep(props?: Partial<IStep>): IStep {
    const result = {} as IStep;
    result.active = false;
    Object.assign(result, props);
    result.uuid = uuidLib.v4();
    return result;
}

  public createTrack(props?: Partial<ITrack>): ITrack {
    const result = {} as ITrack;
    result.muted = false;
    result.name = 'New track';
    result.filePath = null;
    result.steps = Array.from({length: 8}).map(this.createStep);
    Object.assign(result, props);
    result.uuid = uuidLib.v4();
    return result;
  }

  public createPattern(props?: Partial<IPattern>): IPattern {
    const result = {} as IPattern;
    result.tracks = Array.from({length: 4}).map(this.createTrack.bind(this));
    result.name = `Pattern ${this.stateSnapshot.patterns.length}`;
    Object.assign(result, props);
    result.uuid = uuidLib.v4();
    return result;
  }

  public addPattern() {
    const lastPattern = this.stateSnapshot.patterns[this.stateSnapshot.patterns.length - 1];
    const newPattern = this.createPattern({
      tracks: Array.from({length: lastPattern.tracks.length}).map(this.createTrack.bind(this)),
    });
    this.stateSnapshot.patterns.push(newPattern);
    this.stateSnapshot.currentlySelectedPattern = newPattern.uuid;
    this.composition.update(this.stateSnapshot);
  }

  public addTrack(patternUuid: string) {
    const pattern = this.findPatternWithUUID(patternUuid);
    const newTrack = this.createTrack();
    pattern.tracks.push(newTrack);
    this.composition.update(this.stateSnapshot);
  }
}
