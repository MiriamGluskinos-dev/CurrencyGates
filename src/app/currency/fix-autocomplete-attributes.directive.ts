import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[fixAutocompleteAttributes]'
})
export class FixAutocompleteAttributesDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const autoCompleteElement = this.el.nativeElement;
    if (autoCompleteElement) {
      this.renderer.removeAttribute(autoCompleteElement, 'aria-autocomplete');
      this.renderer.removeAttribute(autoCompleteElement, 'role');
      this.renderer.removeAttribute(autoCompleteElement, 'aria-expanded');
      this.renderer.removeAttribute(autoCompleteElement, 'placeholder');
    }
  }
}
