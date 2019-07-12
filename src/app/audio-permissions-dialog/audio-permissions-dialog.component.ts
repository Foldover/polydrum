import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-permissions-dialog',
  templateUrl: './audio-permissions-dialog.component.html',
  styleUrls: ['./audio-permissions-dialog.component.css']
})
export class AudioPermissionsDialogComponent implements OnInit {
  public data;
  constructor() { }

  ngOnInit() {
  }

  onYes($event: MouseEvent) {

  }

  onNo($event: MouseEvent) {

  }
}
