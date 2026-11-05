import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WEDDING } from '../wedding-data';
import { PetalHeartComponent } from './petal-heart.component';

type Stage = 'sealed' | 'opening' | 'open' | 'petals' | 'leaving' | 'gone';

/** Length of the seal's glow & gold drawing (keep in step with --d in the CSS). */
const PRELUDE_MS = 3100;
/** The envelope-to-mirror sequence that follows it. */
const OPENING_MS = 3700;

interface Mote {
  x: number;
  y: number;
  size: number;
  dx: number;
  duration: number;
  delay: number;
}

/**
 * Photo-booth save-the-date.
 *
 *  1. A sealed, embossed envelope closed with a gold wax seal.
 *  2. Tap -> the seal glows, gold traces the embossed flowers, the seal lifts,
 *     the flap swings open in a burst of warm light and a gilded mirror slides
 *     out of the pocket onto a velvet wall, engraved with the couple's names.
 *  3. Tap the mirror -> camera flash, the names fade and a photo strip feeds
 *     out of the booth slot and develops. Tap again to tuck it back in.
 *  4. "Continue" -> a save-the-date card with a heart of rose petals; brushing
 *     them away uncovers the date, then petals rain down.
 *  5. "View the invitation" fades the booth away to reveal the rest of the site.
 *
 * Content comes from WEDDING.photobooth in wedding-data.ts. Motion is pure CSS
 * (see photobooth.component.css); this class only moves between stages.
 */
@Component({
  selector: 'app-photobooth',
  standalone: true,
  imports: [PetalHeartComponent],
  templateUrl: './photobooth.component.html',
  styleUrl: './photobooth.component.css',
})
export class PhotoboothComponent implements OnInit, OnDestroy {
  readonly p = WEDDING.photobooth;
  readonly tag = WEDDING.hashtag;
  readonly initials = this.p.names.map((n) => n.trim().charAt(0).toUpperCase());

  stage: Stage = 'sealed';
  revealed = false;
  ctaReady = false;
  /** True once the guest has moved on from the mirror to the petal card. */
  pastMirror = false;

  /** Gold motes drifting in the spotlight (positions fixed per load). */
  readonly dust: Mote[] = Array.from({ length: 26 }, (_, i) => {
    const r = (n: number) => {
      const v = Math.sin((i + 1) * 12.9898 * n) * 43758.5453;
      return v - Math.floor(v);
    };
    return {
      x: 4 + r(1) * 92,
      y: 12 + r(2) * 82,
      size: 1.5 + r(3) * 3,
      dx: (r(4) - 0.5) * 40,
      duration: 9 + r(5) * 9,
      delay: -r(6) * 18,
    };
  });

  @ViewChild('mirrorHit') private mirrorHit?: ElementRef<HTMLButtonElement>;
  @ViewChild(PetalHeartComponent) private petalHeart?: PetalHeartComponent;

  private timers: ReturnType<typeof setTimeout>[] = [];
  private pace = 1;
  private inerted: Element[] = [];

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Lock the page behind the booth and hold the hero's entrance until we leave.
    this.doc.body.classList.add('letter-sealed');
    // Keep keyboard & screen-reader focus inside the booth (the music toggle
    // stays reachable); the rest of the page wakes up when we leave.
    const me = this.host.nativeElement;
    for (const el of Array.from(me.parentElement?.children ?? [])) {
      if (el === me || el.tagName === 'APP-MUSIC' || el.hasAttribute('inert')) continue;
      el.setAttribute('inert', '');
      this.inerted.push(el);
    }
    const reduce = this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduce?.matches) this.pace = 0.05;
  }

  get ctaLabel(): string {
    return this.stage === 'open' && this.p.petals.enabled ? 'Continue' : 'View the invitation';
  }

  /** Tap the envelope. */
  open(): void {
    if (this.stage !== 'sealed') return;
    this.stage = 'opening';
    this.later(PRELUDE_MS + OPENING_MS, () => {
      this.stage = 'open';
      // Render the enabled mirror button first, then hand it the focus the
      // (now removed) envelope button had — so keyboard users carry on.
      this.cdr.detectChanges();
      this.mirrorHit?.nativeElement.focus({ preventScroll: true });
      // Offer the way on even if nobody taps the mirror.
      this.later(7000, () => {
        if (this.stage === 'open') this.ctaReady = true;
      });
    });
  }

  /** Tap the mirror: print the strip (or tuck it back in). */
  toggleStrip(): void {
    if (this.stage !== 'open') return;
    this.revealed = !this.revealed;
    if (this.revealed)
      this.later(3400, () => {
        if (this.stage === 'open') this.ctaReady = true;
      });
  }

  /** The call to action: on to the petal card, or into the invitation. */
  next(): void {
    if (this.stage === 'open' && this.p.petals.enabled) this.toPetals();
    else this.enter();
  }

  /** Swap the mirror for the save-the-date card with the petal heart. */
  private toPetals(): void {
    this.stage = 'petals';
    this.pastMirror = true;
    this.ctaReady = false;
    this.cdr.detectChanges();
    this.petalHeart?.focusHint();
    // in case nobody brushes the petals, offer the way on after a while
    this.later(15000, () => {
      if (this.stage === 'petals') this.ctaReady = true;
    });
  }

  /** The petals have been brushed away and the details are showing. */
  petalsOpened(): void {
    this.later(1600, () => {
      if (this.stage === 'petals') this.ctaReady = true;
    });
  }

  /** Fade the booth away and hand over to the invitation below. */
  enter(): void {
    if (this.stage === 'leaving' || this.stage === 'gone') return;
    this.stage = 'leaving';
    this.doc.defaultView?.scrollTo(0, 0);
    this.doc.body.classList.remove('letter-sealed');
    this.wake();
    this.later(1200, () => (this.stage = 'gone'));
  }

  private wake(): void {
    this.inerted.forEach((el) => el.removeAttribute('inert'));
    this.inerted = [];
  }

  private later(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms * this.pace));
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
    this.doc.body.classList.remove('letter-sealed');
    this.wake();
  }
}
