import {ComponentFactoryResolver, ComponentRef, Injectable, Type} from '@angular/core';
import {AppComponent, OverlayRef} from './app.component';

@Injectable({
  providedIn: AppComponent,
})
export class OverlayService {

  private appComponent: ComponentRef<AppComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public create<T>(component: Type<T>): OverlayRef {
    return this.appComponent.instance.createOverlay(component);
  }

  public destroy(overlayRef: OverlayRef) {
    this.appComponent.instance.destroyComponent(overlayRef);
  }
}
