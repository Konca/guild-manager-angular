import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mouseOverAnimation]',
})
export class MouseOverAnimation {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') mouseover() {
    this.renderer.setStyle(
      this.elRef.nativeElement,
      'animation',
      'on-hover 300ms ease-in'
    );
  }
  @HostListener('mouseleave') mouseleave() {
    if (!this.elRef.nativeElement.className.includes('active'))
      this.renderer.setStyle(
        this.elRef.nativeElement,
        'animation',
        'off-hover 300ms ease-in'
      );
  }
}
