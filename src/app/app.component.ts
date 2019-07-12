import {AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, Type, ViewChild} from '@angular/core';
import {AudioService} from './audio.service';
import {OverlayActionDirective} from './overlay-action.directive';
import {AudioPermissionsDialogComponent} from './audio-permissions-dialog/audio-permissions-dialog.component';
import {OverlayService} from './overlay.service';
import {Subject} from 'rxjs';
import {take} from 'rxjs/operators';

export class OverlayRef<T> {
  private onDestroy = new Subject<T>();
  public onDestroy$ = this.onDestroy.pipe(take(1));

  constructor(private overlayService: OverlayService,
              private componentRef: ComponentRef<Component>) {
  }

  public destroy(data: T) {
    this.overlayService.destroy(this);
    this.onDestroy.next(data);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Polydrum2';
  public audioOn = false;
  @ViewChild(OverlayActionDirective, {static: true}) adHost: OverlayActionDirective;
  private overlays: Array<OverlayRef<any>>;

  constructor(private audioService: AudioService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private overlayService: OverlayService) {
  }

  ngAfterViewInit(): void {
    if (!this.audioService.isInitialized()) {
      const audioPermissionOverlay =
        this.createOverlay<AudioPermissionsDialogComponent, { wasPermissionGiven: boolean }>(AudioPermissionsDialogComponent);
      audioPermissionOverlay.onDestroy$.subscribe(data => {
        if (data.wasPermissionGiven) {
          this.audioService.initialize()
            .then(res => {
              this.audioOn = true;
            });
        }
      });
    }
  }

  public createOverlay<T, D>(component: Type<T>): OverlayRef<D> {
    const componentRef = this.loadComponent(component);
    const overlayRef = new OverlayRef<D>(this.overlayService, componentRef);
    this.overlays.push(overlayRef);
    return overlayRef;
  }

  private loadComponent<T>(component: Type<T>): ComponentRef<T> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();
    return viewContainerRef.createComponent(componentFactory);
  }

  public destroyComponent(overlayRef: OverlayRef<any>) {
    this.adHost.viewContainerRef.clear();
    this.overlays = this.overlays.filter(overlay => overlay !== overlayRef);
  }
}
