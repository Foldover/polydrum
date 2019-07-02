import { Component } from '@angular/core';
import {AudioService} from './audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Polydrum2';
  public audioOn = false;

  constructor(private audioService: AudioService) {
  }

  onAudioToggleClick($event: MouseEvent) {
    this.audioService.initialize()
      .then(res => {
        this.audioOn = true;
      });
  }
}
