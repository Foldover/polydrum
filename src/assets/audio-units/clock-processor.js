export class ClockProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.clock = 0;

    this.port.onmessage = (event) => {
      switch (event.data) {
        case "reset":
          this.clock = 0;
          break;
        default:
          (() => null)();
          break;
      }
    };
  }

  process(inputs, outputs, parameters) {
    for (let i = 0; i < outputs.length; i++) {
      const output = outputs[i];
      for (let c = 0; c < output.length; c++) {
        const outputChannel = output[c];
        for (let n = 0; n < outputChannel.length; n++) {
          outputChannel[n] = this.clock;
          this.clock += 1;
        }
      }
    }
    return true;
  }
}

registerProcessor("clock-processor", ClockProcessor);
