class Sound {
  set buffer(val) {
    this._buffer = val;
  }

  get buffer() {
    return this._buffer;
  }

  play() {
    this.playing = true;
    this.sIdx = 0;
  }

  stop() {
    this.playing = false;
    this.sIdx = 0;
  }

  isPlaying() {
    return this.playing;
  }

  next() {
    if (this.isPlaying()) {
      if (this.buffer !== undefined && this.sIdx < this.buffer.length) {
        return this.buffer[this.sIdx++];
      } else {
        this.stop();
        return 0;
      }
    }
    return 0;
  }
}

export class SamplerSourceProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.profiler = [];
    this.stepsPerLoop = 8;
    this.bpm = 120;
    this.base = 4;
    this.xcalc = () => Math.floor(44100 / (this.bpm / 60) * (this.base / this.stepsPerLoop));
    this.xfactor = this.xcalc();
    this.stepsActive = Array.from({length: 32}).map(e => false);
    this.stepIndex = 0;
    this.buffer = new ArrayBuffer(0);
    this.sounds = [
      new Sound(), new Sound(), new Sound(), new Sound(),
    ];
    this.voiceAllocationIndex = 0;
    this.maxVoices = 4;

    this.port.onmessage = (event) => {
      switch (event.data[0]) {
        case "setArrayBuffer":
          this.buffer = event.data[1];
          for (let i = 0; i < this.sounds.length; i++) {
            this.sounds[i].buffer = this.buffer;
          }
          break;
        case "setStep":
          this.stepsActive[event.data[1][0]] = event.data[1][1];
          break;
        case "setStepCount":
          this.stepsPerLoop = event.data[1];
          for (let i = this.stepsPerLoop; i < 32; i++) {
            this.stepsActive[i] = false;
          }
          this.xfactor = this.xcalc();
          break;
        case "setBPM":
          this.bpm = event.data[1];
          this.xfactor = this.xcalc();
          break;
        case "setBase":
          this.base = event.data[1][0];
          this.xfactor = this.xcalc();
          break;
        default:
          break;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0][0];
    for (let i = 0; i < input.length - 1; i++) {
      const sampleCount = input[i];
      if (sampleCount % this.xfactor === 0) {
        if (this.stepsActive[this.stepIndex]) {
          const sound = this.sounds[this.voiceAllocationIndex];
          if (sound.isPlaying()) sound.stop();
          sound.play();
          this.voiceAllocationIndex += 1;
          if (this.voiceAllocationIndex >= this.maxVoices) {
            this.voiceAllocationIndex -= this.maxVoices;
          }
        }
        this.profiler[0] = sampleCount;

        this.stepIndex++;
        if (this.stepIndex >= this.stepsPerLoop) {
          this.stepIndex = 0;
        }
      }
      for (let sound of this.sounds) {
        const sample = sound.next();
        outputs[0][0][i] += sample;
      }
    }
    return true;
  }
}

registerProcessor("sampler-source-processor", SamplerSourceProcessor);
