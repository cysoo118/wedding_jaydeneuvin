import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

/**
 * Adds `is-visible` to the host the first time it scrolls into view,
 * enabling a CSS-driven reveal. Falls back to visible if IO is missing.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private el = inject(ElementRef<HTMLElement>);
  private r = inject(Renderer2);
  private io?: IntersectionObserver;

  ngOnInit(): void {
    const host = this.el.nativeElement as HTMLElement;
    this.r.addClass(host, 'reveal-init');
    if (this.revealDelay) {
      this.r.setStyle(host, 'transition-delay', `${this.revealDelay}ms`);
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.r.addClass(host, 'is-visible');
      return;
    }

    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            this.r.addClass(host, 'is-visible');
            this.io?.unobserve(host);
          }
        }
      },
      { threshold: 0.18 },
    );
    this.io.observe(host);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
