export class  SamplerSourceModule extends AudioWorkletNode {
  constructor(context) {
    super(context, "sampler-source-processor");
  }

  setBPM(bpm) {
    this.port.postMessage(["setBPM", bpm]);
  }

  setBase(base) {
    this.port.postMessage("setBase", [base]);
  }

  setStepCount(count) {
    this.port.postMessage(["setStepCount", count]);
  }

  setStep(stepN, active) {
    this.port.postMessage(["setStep", [stepN, active]]);
  }

  setArrayBuffer(buffer) {
    this.port.postMessage(["setArrayBuffer", buffer]);
  }
}
