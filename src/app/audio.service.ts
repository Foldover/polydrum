import {Injectable} from '@angular/core';
import {CompositionStoreService} from './composition-store.service';
import {IComposition} from './interfaces';
import {tap} from 'rxjs/operators';
import * as uuid from 'uuid';
import {SamplerSourceModule} from 'src/assets/audio-units/sampler-source-module.js';
import {ClockModule} from 'src/assets/audio-units/clock-module.js';

export interface ISamplerAudio {
  samplerSourceModule: SamplerSourceModule;
}

export interface ISampler {
  uuid: string;
  trackUuid: string;
  patternUuid: string;
  audio: ISamplerAudio;
}

export type IPlaybackState = 'stopped' | 'paused' | 'playing';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private clock: ClockModule;
  private bpm = 120;
  private base = 4;
  private stateSnapshot: IComposition;
  private audioContext: AudioContext;
  private destination: AudioDestinationNode;
  private samplers: Array<ISampler>;
  private playbackState: IPlaybackState = 'stopped';

  constructor(private compositionStoreService: CompositionStoreService) {
    this.compositionStoreService.state$.pipe(tap(state => {
      this.stateSnapshot = state;
      this.bpm = state.bpm;
    })).subscribe();
  }

  public async initialize() {
    this.audioContext = new AudioContext({
      latencyHint: 1024,
    });
    await this.registerClock();
    await this.registerSamplerSource();
    this.clock = new ClockModule(this.audioContext);
    this.createAllSamplers(this.stateSnapshot);
    this.samplers.forEach(sampler => {
      this.clock.connect(sampler.audio.samplerSourceModule);
      sampler.audio.samplerSourceModule.connect(this.audioContext.destination);
    });
    this.destination = this.audioContext.destination;
  }

  public deleteSampler(patternUuid: string, trackUuid: string) {
    const samplerToDeleteIndex = this.samplers.findIndex(sampler => sampler.patternUuid === patternUuid && sampler.trackUuid === trackUuid);
    this.samplers[samplerToDeleteIndex].audio.samplerSourceModule.disconnect();
    this.samplers = this.samplers.splice(samplerToDeleteIndex, 1);
  }

  public addSampler(patternUuid: string, trackUuid: string) {
    const newSampler = this.createSampler(trackUuid, patternUuid, undefined);
    this.clock.connect(newSampler.audio.samplerSourceModule);
    newSampler.audio.samplerSourceModule.connect(this.destination);
    this.samplers.push(newSampler);
  }

  public findSamplerByPatternAndTrack(patternUuid: string, trackUuid: string): ISampler {
    return this.samplers.find(sampler => sampler.patternUuid === patternUuid && sampler.trackUuid === trackUuid);
  }

  public play() {
    this.playbackState = 'playing';
    this.audioContext.resume();
  }

  public pause() {
    this.playbackState = 'paused';
    this.audioContext.suspend();
  }

  public async stop() {
    this.playbackState = 'stopped';
    this.clock.reset();
    await this.audioContext.suspend();
  }

  public createAllSamplers(composition: IComposition) {
    this.samplers = composition.patterns.reduce((acc, pattern) => acc.concat(pattern.tracks.map((track) => {
      return this.createSampler(track.uuid, pattern.uuid, track.filePath);
    })), []);
  }

  public async parseAudioFile(file: File) {
  }

  public setAudioFile(file: File, patternUuid: string, trackUuid: string) {
    const sampler = this.findSamplerByPatternAndTrack(patternUuid, trackUuid);
    const fileReader = new FileReader();
    const data = fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      this.audioContext.decodeAudioData((e.target as FileReader).result as ArrayBuffer)
        .then(res => {
          sampler.audio.samplerSourceModule.setArrayBuffer(res.getChannelData(0));
        });
    };
  }

  public setStep(patternUuid: string, trackUuid: string, stepNumber: number, active: boolean) {
    const sampler = this.findSamplerByPatternAndTrack(patternUuid, trackUuid);
    sampler.audio.samplerSourceModule.setStep(stepNumber, active);
  }

  public setStepCount(patternUuid: string, trackUuid: string, count: number) {
    const sampler = this.findSamplerByPatternAndTrack(patternUuid, trackUuid);
    sampler.audio.samplerSourceModule.setStepCount(count);
  }

  public setBPM(bpm: number) {
    for (let i = 0; i < this.samplers.length; i++) {
      this.samplers[i].audio.samplerSourceModule.setBPM(bpm);
    }
  }

  private createSampler(trackUuid: string, patternUuid: string, filePath: string | undefined) {
    const result = {
      uuid: uuid.v4(),
      trackUuid,
      patternUuid,
    } as Partial<ISampler>;
    result.audio = this.createSamplerAudio(filePath);
    return result as ISampler;
  }

  private createSamplerAudio(filePath: string | undefined): ISamplerAudio {
    const result = new SamplerSourceModule(this.audioContext);
    return {
      samplerSourceModule: result,
    };
  }

  private async registerClock(): Promise<void> {
    return this.audioContext.audioWorklet.addModule('assets/audio-units/clock-processor.js');
  }

  private async registerSamplerSource(): Promise<void> {
    return this.audioContext.audioWorklet.addModule('assets/audio-units/sampler-source-processor.js');
  }
}
