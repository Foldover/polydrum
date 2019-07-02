export class ClockModule extends AudioWorkletNode {
  constructor(context) {
    super(context, "clock-processor");
  }

  reset() {
    this.port.postMessage("reset");
  }
}
