import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appOverlayAction]'
})
export class OverlayActionDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
