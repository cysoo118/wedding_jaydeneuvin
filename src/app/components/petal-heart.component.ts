import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WEDDING } from '../wedding-data';

/** One rose petal on the canvas. */
interface Petal {
  x: number;
  y: number;
  rot: number;
  scale: number;
  sprite: number;
  /** 0 resting in the heart · 1 brushed away · 2 gathering into the wreath · 3 in the wreath */
  state: 0 | 1 | 2 | 3;
  vx: number;
  vy: number;
  vr: number;
  life: number;
  max: number;
  // wreath flight
  fx: number;
  fy: number;
  fr: number;
  tx: number;
  ty: number;
  tr: number;
  alpha: number;
  delay: number;
}

/** A petal drifting down in the rain. */
interface Drop {
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
  phase: number;
  sway: number;
  scale: number;
  sprite: number;
  t: number;
}

/**
 * Save-the-date card with a heart of rose petals over the details. Guests
 * brush the petals away (finger or mouse); once most are gone the rest gather
 * into a heart wreath around the message and petals start to rain down.
 * Keyboard & screen-reader users get the same reveal from the hint button,
 * and the message itself is always real text underneath the canvas.
 */
@Component({
  selector: 'app-petal-heart',
  standalone: true,
  template: `
    <div class="card">
      <img class="emboss" src="assets/photobooth/envelope-body.webp" alt="" />
      <p class="kicker">{{ c.kicker }}</p>
      <h2 class="names">{{ names[0] }} <span class="amp">&amp;</span> {{ names[1] }}</h2>

      <div class="heart" [class.open]="revealed">
        <div class="message">
          <p class="lead">{{ c.heading }}</p>
          <p class="line">{{ c.message }}</p>
          <p class="when">{{ date }}</p>
        </div>
        <canvas
          #petals
          class="petals"
          aria-hidden="true"
          (pointerdown)="down($event)"
          (pointermove)="move($event)"
          (pointerup)="up($event)"
          (pointercancel)="up($event)"
          (pointerleave)="up($event)"
        ></canvas>
      </div>

      <button #hint class="hint" type="button" [class.gone]="revealed" (click)="revealAll()" [attr.tabindex]="revealed ? -1 : null">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9 11.2V6.5a1.5 1.5 0 0 1 3 0v4.2m0-1.2V5a1.5 1.5 0 0 1 3 0v5.3m0-3.3a1.5 1.5 0 0 1 3 0v5.5c0 4.1-2.4 7-6.3 7-2.6 0-4.1-1-5.6-3.2L3.8 13a1.5 1.5 0 0 1 2.5-1.6L9 14.6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ c.hint }}
      </button>

      <p class="time">{{ time }}</p>
      <p class="place">{{ place }}</p>
      <canvas #rain class="rain" aria-hidden="true"></canvas>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .card {
        --hw: min(calc(var(--ew) * 0.8), calc(var(--eh) * 0.42));
        position: relative;
        width: var(--ew);
        height: var(--eh);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: calc(var(--eh) * 0.1);
        box-sizing: border-box;
        text-align: center;
        color: #4a2a22;
        background:
          radial-gradient(120% 80% at 50% 30%, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 60%),
          radial-gradient(130% 90% at 50% 50%, rgba(0, 0, 0, 0) 60%, rgba(120, 60, 50, 0.16) 100%),
          linear-gradient(180deg, #f8efea, #f1e2dc);
        box-shadow: 0 2.5rem 5rem -1.5rem rgba(0, 0, 0, 0.6);
      }
      .kicker,
      .names,
      .heart,
      .hint,
      .time,
      .place {
        position: relative;
      }
      .emboss {
        /* the envelope's floral emboss, whisper-faint, so the stationery matches */
        position: absolute;
        top: 0;
        left: 50%;
        width: var(--tex-w);
        max-width: none;
        transform: translateX(-50%);
        mix-blend-mode: multiply;
        opacity: 0.3;
        pointer-events: none;
      }
      p {
        margin: 0;
      }
      .kicker {
        font-family: var(--display);
        font-weight: 600;
        font-size: calc(var(--ew) * 0.03);
        letter-spacing: 0.36em;
        text-indent: 0.36em;
        text-transform: uppercase;
        color: #9a6b4f;
      }
      .names {
        margin: calc(var(--eh) * 0.012) 0 calc(var(--eh) * 0.05);
        font-family: var(--display);
        font-style: italic;
        font-weight: 500;
        font-size: calc(var(--ew) * 0.105);
        line-height: 1.1;
        color: #4a2a22;
      }
      .names .amp {
        font-family: var(--script);
        font-style: normal;
        font-size: 0.8em;
        color: #9e3b3b;
      }

      .heart {
        position: relative;
        width: var(--hw);
        height: calc(var(--hw) * 0.95);
        flex: none;
      }
      .message {
        position: absolute;
        left: 20%;
        right: 20%;
        top: 18.5%;
        bottom: 44.5%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: calc(var(--hw) * 0.022);
      }
      .lead {
        font-family: var(--display);
        font-weight: 600;
        font-size: calc(var(--hw) * 0.034);
        letter-spacing: 0.3em;
        text-indent: 0.3em;
        text-transform: uppercase;
        color: #9a6b4f;
      }
      .line {
        font-family: var(--display);
        font-style: italic;
        font-size: calc(var(--hw) * 0.048);
        line-height: 1.3;
        color: #6a4a40;
      }
      .when {
        margin-top: calc(var(--hw) * 0.015);
        font-family: var(--display);
        font-weight: 500;
        white-space: nowrap;
        font-size: calc(var(--hw) * 0.064);
        line-height: 1.1;
        color: #4a2a22;
      }
      .time {
        margin-top: calc(var(--eh) * 0.006);
        font-family: var(--display);
        font-weight: 600;
        font-size: calc(var(--ew) * 0.027);
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: #8a5a45;
      }
      .petals {
        /* larger than the heart box so outline petals are never clipped */
        position: absolute;
        inset: -12%;
        width: 124%;
        height: 124%;
        touch-action: none;
        cursor: grab;
      }
      .heart.open .petals {
        cursor: default;
      }

      .hint {
        margin-top: calc(var(--eh) * 0.022);
        display: inline-flex;
        align-items: center;
        gap: 0.55em;
        padding: 0.5em 0.9em;
        border: 0;
        background: none;
        font-family: var(--display);
        font-weight: 600;
        font-size: calc(var(--ew) * 0.027);
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #8a5a45;
        cursor: pointer;
        transition: opacity 0.6s ease;
        animation: nudge 2.8s ease-in-out 1.6s infinite;
      }
      .hint svg {
        width: 1.6em;
        height: 1.6em;
        flex: none;
      }
      .hint:focus-visible {
        outline: 1px solid #9a6b4f;
        outline-offset: 2px;
        border-radius: 3px;
      }
      .hint.gone {
        opacity: 0;
        pointer-events: none;
        animation: none;
      }
      .place {
        margin-top: calc(var(--eh) * 0.004);
        font-family: var(--display);
        font-style: italic;
        font-size: calc(var(--ew) * 0.045);
        color: #7a5a4e;
      }
      .place::after {
        content: '';
        display: block;
        width: 5px;
        height: 5px;
        margin: calc(var(--eh) * 0.012) auto 0;
        background: #b05050;
        transform: rotate(45deg);
        opacity: 0.6;
      }
      .rain {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      @keyframes nudge {
        0%,
        100% {
          opacity: 0.75;
        }
        50% {
          opacity: 1;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .hint {
          animation: none;
        }
      }
    `,
  ],
})
export class PetalHeartComponent implements AfterViewInit, OnDestroy {
  @Output() readonly opened = new EventEmitter<void>();

  readonly c = WEDDING.photobooth.petals;
  readonly names = WEDDING.photobooth.names;
  readonly date = WEDDING.photobooth.petals.date;
  readonly time = WEDDING.events[0]?.time ?? '';
  readonly place = [WEDDING.events[0]?.venue, WEDDING.location].filter(Boolean).join(' · ');

  revealed = false;

  @ViewChild('petals') private petalCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rain') private rainCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hint') private hintButton!: ElementRef<HTMLButtonElement>;

  private ctx!: CanvasRenderingContext2D;
  private rctx!: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private RW = 0;
  private RH = 0;
  private dpr = 1;
  private sprites: HTMLCanvasElement[] = [];
  private petalSize = 24;
  private petals: Petal[] = [];
  private drops: Drop[] = [];
  private total = 0;
  private raf = 0;
  private last = 0;
  private lastPt: { x: number; y: number; t: number } | null = null;
  private rainOn = false;
  private rainClock = 0;
  private rainBurst = 0;
  private reduce = false;
  private resizeObs?: ResizeObserver;

  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngAfterViewInit(): void {
    this.reduce = !!this.doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.ctx = this.petalCanvas.nativeElement.getContext('2d')!;
    this.rctx = this.rainCanvas.nativeElement.getContext('2d')!;
    this.layout();
    this.fillHeart();
    this.kick();
    // keep the canvases sharp if the phone rotates or the window resizes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObs = new ResizeObserver(() => this.zone.run(() => this.relayout()));
      this.resizeObs.observe(this.petalCanvas.nativeElement);
    }
  }

  /** Hand keyboard focus to the reveal button (the card it replaces is gone). */
  focusHint(): void {
    this.hintButton?.nativeElement.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------ */
  /* layout & artwork                                                     */
  /* ------------------------------------------------------------------ */

  private layout(): void {
    const view = this.doc.defaultView!;
    this.dpr = Math.min(2, view.devicePixelRatio || 1);
    const pc = this.petalCanvas.nativeElement;
    const rc = this.rainCanvas.nativeElement;
    this.W = pc.clientWidth;
    this.H = pc.clientHeight;
    this.RW = rc.clientWidth;
    this.RH = rc.clientHeight;
    pc.width = Math.round(this.W * this.dpr);
    pc.height = Math.round(this.H * this.dpr);
    rc.width = Math.round(this.RW * this.dpr);
    rc.height = Math.round(this.RH * this.dpr);
    this.petalSize = Math.max(14, this.W * 0.086);
    this.makeSprites();
  }

  private relayout(): void {
    const pc = this.petalCanvas.nativeElement;
    if (!pc.clientWidth || (pc.clientWidth === this.W && pc.clientHeight === this.H)) return;
    const sx = pc.clientWidth / this.W;
    const sy = pc.clientHeight / this.H;
    this.layout();
    for (const p of this.petals) {
      p.x *= sx;
      p.y *= sy;
      p.tx *= sx;
      p.ty *= sy;
    }
    this.kick();
  }

  /** A handful of rose-petal sprites in slightly different reds and shapes. */
  private makeSprites(): void {
    const palette = [
      ['#e2394a', '#b3172b', '#6f0a18'],
      ['#d92b3d', '#a3111f', '#650714'],
      ['#ee4a57', '#c11f31', '#7c0d1c'],
      ['#cf2236', '#960c1d', '#5a0510'],
      ['#e63e50', '#b81a2c', '#710b19'],
      ['#f05a64', '#c9283a', '#86101f'],
    ];
    const s = this.petalSize * this.dpr;
    this.sprites = palette.map(([light, mid, dark], i) => {
      const c = this.doc.createElement('canvas');
      c.width = c.height = Math.ceil(s * 1.5);
      const g = c.getContext('2d')!;
      const w = s * (0.86 + (i % 3) * 0.08);
      const h = s;
      g.translate(c.width / 2, c.height / 2);
      g.beginPath();
      g.moveTo(0, h * 0.5);
      g.bezierCurveTo(-w * 0.58, h * 0.24, -w * 0.64, -h * 0.36, -w * 0.13, -h * 0.5);
      g.quadraticCurveTo(0, -h * (0.34 + (i % 2) * 0.06), w * 0.13, -h * 0.5);
      g.bezierCurveTo(w * 0.64, -h * 0.36, w * 0.58, h * 0.24, 0, h * 0.5);
      g.closePath();
      const rg = g.createRadialGradient(-w * 0.12, -h * 0.12, h * 0.05, 0, h * 0.1, h * 0.75);
      rg.addColorStop(0, light);
      rg.addColorStop(0.55, mid);
      rg.addColorStop(1, dark);
      g.fillStyle = rg;
      g.fill();
      // velvet sheen and a soft crease
      const lg = g.createLinearGradient(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5);
      lg.addColorStop(0, 'rgba(255,255,255,0.22)');
      lg.addColorStop(0.45, 'rgba(255,255,255,0)');
      lg.addColorStop(1, 'rgba(60,0,10,0.18)');
      g.fillStyle = lg;
      g.fill();
      g.strokeStyle = 'rgba(80, 0, 14, 0.4)';
      g.lineWidth = Math.max(0.6, s * 0.025);
      g.stroke();
      g.beginPath();
      g.moveTo(0, h * 0.42);
      g.quadraticCurveTo(w * 0.04, 0, -w * 0.02, -h * 0.3);
      g.strokeStyle = 'rgba(70, 0, 12, 0.22)';
      g.lineWidth = Math.max(0.6, s * 0.02);
      g.stroke();
      return c;
    });
  }

  /**
   * Classic heart curve, t in [0, 2π), as canvas pixels; k < 1 shrinks it
   * about its middle. Sized so petals on the outline never touch the edges.
   */
  private heartPoint(t: number, k = 1): [number, number] {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const sx = (this.W * 0.41) / 16;
    const sy = (this.H * 0.4) / 16;
    const midY = 2.5; // vertical middle of the curve (it spans -17..12)
    return [this.W / 2 + x * sx * k, this.H * 0.37 - (midY + (y - midY) * k) * sy];
  }

  /** Is (x, y) inside the heart outline? (ray casting against the curve) */
  private inside(x: number, y: number): boolean {
    const poly = this.outline;
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  }

  private outline: [number, number][] = [];

  private fillHeart(): void {
    this.outline = Array.from({ length: 120 }, (_, i) => this.heartPoint((i / 120) * Math.PI * 2, 0.98));
    const count = Math.round(260 * Math.min(1.3, Math.max(0.7, this.W / 300)));
    const pts: Petal[] = [];
    let guard = 0;
    while (pts.length < count && guard++ < 20000) {
      const x = Math.random() * this.W;
      const y = Math.random() * this.H;
      if (!this.inside(x, y)) continue;
      pts.push(this.newPetal(x, y));
    }
    this.petals = pts;
    this.total = pts.length;
  }

  private newPetal(x: number, y: number): Petal {
    return {
      x,
      y,
      rot: Math.random() * Math.PI * 2,
      scale: 0.8 + Math.random() * 0.45,
      sprite: (Math.random() * this.sprites.length) | 0,
      state: 0,
      vx: 0,
      vy: 0,
      vr: 0,
      life: 0,
      max: 1,
      fx: 0,
      fy: 0,
      fr: 0,
      tx: 0,
      ty: 0,
      tr: 0,
      alpha: 1,
      delay: 0,
    };
  }

  /* ------------------------------------------------------------------ */
  /* brushing                                                             */
  /* ------------------------------------------------------------------ */

  down(e: PointerEvent): void {
    if (this.revealed) return;
    this.petalCanvas.nativeElement.setPointerCapture?.(e.pointerId);
    this.lastPt = this.local(e);
  }

  move(e: PointerEvent): void {
    if (this.revealed) return;
    // a mouse brushes simply by passing over; fingers and pens while touching
    if (e.pointerType !== 'mouse' && !this.lastPt) return;
    const pt = this.local(e);
    const from = this.lastPt ?? pt;
    this.brush(from, pt);
    this.lastPt = pt;
  }

  up(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' || e.type !== 'pointermove') this.lastPt = null;
  }

  private local(e: PointerEvent): { x: number; y: number; t: number } {
    const r = this.petalCanvas.nativeElement.getBoundingClientRect();
    // the canvas may be scaled by a parent transform; map back to its own pixels
    return {
      x: ((e.clientX - r.left) / r.width) * this.W,
      y: ((e.clientY - r.top) / r.height) * this.H,
      t: performance.now(),
    };
  }

  private brush(a: { x: number; y: number; t: number }, b: { x: number; y: number; t: number }): void {
    const R = this.W * 0.1;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy || 1;
    const dt = Math.max(16, b.t - a.t) / 1000;
    const pvx = dx / dt;
    const pvy = dy / dt;
    let hit = false;
    for (const p of this.petals) {
      if (p.state !== 0) continue;
      // closest point on the stroke segment
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
      const cx = a.x + dx * t;
      const cy = a.y + dy * t;
      const ox = p.x - cx;
      const oy = p.y - cy;
      const d = Math.hypot(ox, oy);
      if (d > R * (0.75 + p.scale * 0.25)) continue;
      const n = d || 1;
      const push = this.W * (0.9 + Math.random() * 1.1);
      p.state = 1;
      p.vx = (ox / n) * push + pvx * 0.35;
      p.vy = (oy / n) * push + pvy * 0.35 - this.W * 0.4;
      p.vr = (Math.random() - 0.5) * 12;
      p.life = 0;
      p.max = this.reduce ? 0.25 : 0.9 + Math.random() * 0.5;
      hit = true;
    }
    if (hit) {
      this.kick();
      const resting = this.petals.reduce((n, p) => n + (p.state === 0 ? 1 : 0), 0);
      if (resting < this.total * 0.42) this.reveal();
    }
  }

  /** Keyboard / tap-the-hint path: sweep every petal away at once. */
  revealAll(): void {
    if (this.revealed) return;
    const cx = this.W / 2;
    const cy = this.H * 0.45;
    for (const p of this.petals) {
      if (p.state !== 0) continue;
      const ox = p.x - cx;
      const oy = p.y - cy;
      const n = Math.hypot(ox, oy) || 1;
      const push = this.W * (0.8 + Math.random() * 1.2);
      p.state = 1;
      p.vx = (ox / n) * push;
      p.vy = (oy / n) * push - this.W * 0.5;
      p.vr = (Math.random() - 0.5) * 12;
      p.life = 0;
      p.max = this.reduce ? 0.25 : 0.9 + Math.random() * 0.6;
    }
    this.kick();
    this.reveal();
  }

  /* ------------------------------------------------------------------ */
  /* reveal: gather a wreath, start the rain                              */
  /* ------------------------------------------------------------------ */

  private reveal(): void {
    if (this.revealed) return;
    this.revealed = true;

    // evenly spaced spots along the heart outline, two petals deep
    const spots: [number, number, number][] = [];
    const N = 58;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      for (const k of [1, 0.95]) {
        const [x, y] = this.heartPoint(t + (k < 1 ? Math.PI / N : 0), k);
        spots.push([x, y, Math.random() * Math.PI * 2]);
      }
    }
    // reuse the petals still resting; any shortfall drifts in from outside
    const resting = this.petals.filter((p) => p.state === 0);
    const cx = this.W / 2;
    const cy = this.H * 0.45;
    const angle = (x: number, y: number) => Math.atan2(y - cy, x - cx);
    resting.sort((a, b) => angle(a.x, a.y) - angle(b.x, b.y));
    spots.sort((a, b) => angle(a[0], a[1]) - angle(b[0], b[1]));
    spots.forEach(([tx, ty, tr], i) => {
      let p = resting[Math.floor((i / spots.length) * resting.length)];
      if (!p || p.state !== 0) {
        const a = angle(tx, ty);
        p = this.newPetal(cx + Math.cos(a) * this.W * 0.8, cy + Math.sin(a) * this.H * 0.8);
        p.alpha = 0;
        this.petals.push(p);
      }
      p.state = 2;
      p.fx = p.x;
      p.fy = p.y;
      p.fr = p.rot;
      p.tx = tx + (Math.random() - 0.5) * this.W * 0.02;
      p.ty = ty + (Math.random() - 0.5) * this.W * 0.02;
      p.tr = tr;
      p.life = 0;
      p.delay = this.reduce ? 0 : Math.random() * 0.35;
      p.max = this.reduce ? 0.01 : 1.1 + Math.random() * 0.4;
    });
    // whatever didn't find a place in the wreath is blown away
    for (const p of resting) {
      if (p.state === 0) {
        p.state = 1;
        p.vx = (Math.random() - 0.5) * this.W;
        p.vy = -this.W * 0.6;
        p.vr = (Math.random() - 0.5) * 10;
        p.life = 0;
        p.max = 0.9;
      }
    }
    if (!this.reduce) {
      this.rainOn = true;
      this.rainBurst = 26;
    }
    this.kick();
    setTimeout(() => this.zone.run(() => this.opened.emit()), this.reduce ? 50 : 900);
  }

  /* ------------------------------------------------------------------ */
  /* animation loop (outside Angular, so it never triggers change detection) */
  /* ------------------------------------------------------------------ */

  private kick(): void {
    if (this.raf) return;
    this.zone.runOutsideAngular(() => {
      this.last = performance.now();
      this.raf = requestAnimationFrame((t) => this.frame(t));
    });
  }

  private frame(now: number): void {
    this.raf = 0;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    let busy = false;

    for (let i = this.petals.length - 1; i >= 0; i--) {
      const p = this.petals[i];
      if (p.state === 1) {
        busy = true;
        p.life += dt;
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 + this.W * 1.6 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.life >= p.max) this.petals.splice(i, 1);
      } else if (p.state === 2) {
        busy = true;
        p.life += dt;
        const k = Math.min(1, Math.max(0, (p.life - p.delay) / p.max));
        const e = 1 - Math.pow(1 - k, 3);
        p.x = p.fx + (p.tx - p.fx) * e;
        p.y = p.fy + (p.ty - p.fy) * e - Math.sin(e * Math.PI) * this.W * 0.06;
        p.rot = p.fr + (p.tr - p.fr) * e;
        p.alpha = Math.max(p.alpha, Math.min(1, k * 3));
        if (k >= 1) p.state = 3;
      }
    }
    this.drawPetals();

    if (this.rainOn) {
      busy = true;
      this.rainClock += dt;
      const gap = this.rainBurst > 0 ? 0.07 : 0.42;
      while (this.rainClock > gap) {
        this.rainClock -= gap;
        if (this.rainBurst > 0) this.rainBurst--;
        this.drops.push({
          x: Math.random() * this.RW,
          y: -this.petalSize,
          vy: this.RH * (0.07 + Math.random() * 0.07),
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 2.4,
          phase: Math.random() * Math.PI * 2,
          sway: this.RW * (0.02 + Math.random() * 0.04),
          scale: 0.7 + Math.random() * 0.5,
          sprite: (Math.random() * this.sprites.length) | 0,
          t: 0,
        });
      }
      this.drawRain(dt);
    }

    if (busy) this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private drawPetals(): void {
    const g = this.ctx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    for (const p of this.petals) {
      let a = p.alpha;
      if (p.state === 1) a *= 1 - Math.pow(p.life / p.max, 2);
      if (a <= 0) continue;
      const img = this.sprites[p.sprite];
      // flutter: squash on one axis as a flying petal turns over
      const flip = p.state === 1 ? Math.cos(p.life * 9 + p.rot) : 1;
      g.globalAlpha = a;
      g.setTransform(1, 0, 0, 1, p.x * this.dpr, p.y * this.dpr);
      g.rotate(p.rot);
      g.scale(p.scale * (0.35 + 0.65 * Math.abs(flip)), p.scale);
      g.drawImage(img, -img.width / 2, -img.height / 2);
    }
    g.globalAlpha = 1;
  }

  private drawRain(dt: number): void {
    const g = this.rctx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.t += dt;
      d.y += d.vy * dt;
      d.rot += d.vr * dt;
      const x = d.x + Math.sin(d.t * 1.6 + d.phase) * d.sway;
      if (d.y > this.RH + this.petalSize * 2) {
        this.drops.splice(i, 1);
        continue;
      }
      const img = this.sprites[d.sprite];
      const flip = Math.cos(d.t * 2.4 + d.phase);
      g.globalAlpha = 0.92;
      g.setTransform(1, 0, 0, 1, x * this.dpr, d.y * this.dpr);
      g.rotate(d.rot);
      g.scale(d.scale * (0.3 + 0.7 * Math.abs(flip)), d.scale);
      g.drawImage(img, -img.width / 2, -img.height / 2);
    }
    g.globalAlpha = 1;
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.resizeObs?.disconnect();
    this.rainOn = false;
  }
}
