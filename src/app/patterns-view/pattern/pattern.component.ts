import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IPattern} from '../../interfaces';
import {CompositionStoreService} from '../../composition-store.service';
import {distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.css']
})
export class PatternComponent implements OnInit {

  @Input() public patternN: number;
  public patternStateObservable: Observable<IPattern>;



  constructor(private composition: CompositionStoreService) {
  }

  ngOnInit() {
    this.patternStateObservable = this.composition.state$.pipe(
      map(state => state.patterns[this.patternN]),
      distinctUntilChanged(CompositionStoreService.stateHasChanged)
    );
  }

}
