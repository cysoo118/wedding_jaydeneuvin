import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WEDDING } from '../wedding-data';

@Component({
  selector: 'app-cover',
  standalone: true,
  template: `
    @if (!gone && w.cover.video) {
      <div class="cover" [class.opening]="opening" (click)="start()">
        <video
          #vid
          class="film"
          [class.poised]="poised"
          muted
          playsinline
          webkit-playsinline
          disablePictureInPicture
          preload="auto"
          (loadedmetadata)="warmPoster()"
          (timeupdate)="onTime()"
          (ended)="reveal()"
          (error)="reveal()"
        >
          <source [src]="w.cover.video" type="video/webm" />
          @if (w.cover.videoFallback) {
            <source [src]="w.cover.videoFallback" type="video/mp4" />
          }
        </video>

        @if (!started) {
          <!-- animated hint over the wax seal: tap here to open -->
          <div class="guide">
            <div class="target" aria-hidden="true">
              <span class="ring"></span>
              <span class="ring"></span>
              <span class="dot">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 1 0-9 0c0 1.56.79 2.93 2 3.74Zm9.84 4.63-4.54-2.26a1.5 1.5 0 0 0-.54-.11H13v-6a1.5 1.5 0 0 0-3 0v10.74l-3.43-.72a1.2 1.2 0 0 0-1.03.3l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27a1.5 1.5 0 0 0-.9-1.58Z"
                  />
                </svg>
              </span>
            </div>
            <button class="cta" type="button" aria-label="Tap the seal to open the invitation">
              Tap the seal to open
            </button>
          </div>
        } @else {
          <button class="skip" type="button" (click)="reveal(); $event.stopPropagation()">
            Skip &rsaquo;
          </button>
        }
      </div>
    }
  `,
  styles: [
    `
      .cover {
        /* Move the tap hint over the seal if it isn't dead-centre in your clip */
        --seal-x: 50%;
        --seal-y: 50%;

        position: fixed;
        inset: 0;
        z-index: 100;
        overflow: hidden;
        /* soft matte shown around the portrait video on wider screens */
        background: radial-gradient(circle at 50% 44%, #2d4634 0%, #1a2b21 78%);
        cursor: pointer;
        transition:
          opacity 0.9s ease,
          transform 0.9s ease;
      }
      .cover.opening {
        opacity: 0;
        transform: scale(1.04);
        pointer-events: none;
      }

      .film {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        /* hidden until the poster frame is warmed, so the black intro never flashes */
        opacity: 0;
        transition: opacity 0.45s ease;
      }
      .film.poised {
        opacity: 1;
      }

      /* ---- animated tap guide ---- */
      .guide {
        position: absolute;
        left: var(--seal-x);
        top: var(--seal-y);
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.6rem;
        pointer-events: none;
      }
      .target {
        position: relative;
        width: 96px;
        height: 96px;
      }
      .ring {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 96px;
        height: 96px;
        border: 2px solid rgba(244, 239, 227, 0.9);
        border-radius: 50%;
        opacity: 0;
        will-change: transform, opacity;
        animation: ping 2.4s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
      }
      .ring:nth-child(2) {
        animation-delay: 1.2s;
      }
      .dot {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 62px;
        height: 62px;
        display: grid;
        place-items: center;
        color: #f4efe3;
        background: rgba(20, 28, 18, 0.55);
        border: 1px solid rgba(244, 239, 227, 0.75);
        border-radius: 50%;
        box-shadow: 0 6px 18px rgba(10, 16, 8, 0.4);
        will-change: transform;
        animation: tap 2.4s ease-in-out infinite;
      }
      .dot svg {
        width: 28px;
        height: 28px;
        margin: 3px -2px -2px 3px;
      }
      .cta {
        pointer-events: auto;
        padding: 0.55rem 1.3rem;
        font-family: var(--label);
        letter-spacing: 0.26em;
        text-transform: uppercase;
        font-size: 0.66rem;
        color: rgba(245, 240, 225, 0.92);
        text-shadow: 0 1px 4px rgba(10, 16, 8, 0.6);
        background: rgba(20, 28, 18, 0.45);
        border: 1px solid rgba(244, 239, 227, 0.45);
        border-radius: 999px;
        cursor: pointer;
        will-change: opacity;
        animation: breathe 2.4s ease-in-out infinite;
      }

      .skip {
        position: absolute;
        right: max(1.25rem, env(safe-area-inset-right));
        bottom: max(1.25rem, env(safe-area-inset-bottom));
        padding: 0.5rem 1rem;
        font-family: var(--label);
        letter-spacing: 0.2em;
        text-transform: uppercase;
        font-size: 0.62rem;
        color: rgba(244, 239, 227, 0.85);
        background: rgba(20, 28, 18, 0.5);
        border: 1px solid rgba(244, 239, 227, 0.3);
        border-radius: 999px;
        cursor: pointer;
      }
      .skip:hover {
        background: rgba(20, 28, 18, 0.5);
      }

      @keyframes ping {
        0% {
          transform: scale(0.55);
          opacity: 0.9;
        }
        100% {
          transform: scale(1.9);
          opacity: 0;
        }
      }
      @keyframes tap {
        0%,
        100% {
          transform: scale(1);
        }
        10% {
          transform: scale(0.85);
        }
        22% {
          transform: scale(1);
        }
      }
      @keyframes breathe {
        0%,
        100% {
          opacity: 0.62;
        }
        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .ring {
          display: none;
        }
        .dot,
        .cta {
          animation: none;
        }
      }
    `,
  ],
})
export class CoverComponent implements OnInit, OnDestroy {
  w = WEDDING;

  started = false;
  poised = false;
  opening = false;
  gone = false;
  private fallback?: ReturnType<typeof setTimeout>;

  @ViewChild('vid') private vidRef?: ElementRef<HTMLVideoElement>;

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    if (!this.w.cover.video) return;
    // Seal the letter: lock scroll and hold the first page's animations at
    // their start so the reveal plays only once the video has finished.
    this.doc.body.classList.add('letter-sealed');
  }

  /**
   * Mobile browsers don't decode a paused video's frame until it actually
   * plays, so seeking alone leaves a blank (green matte). Instead we play the
   * clip muted, let it advance to the poster frame, then freeze there (onTime)
   * — that reliably renders the sealed letter on phones.
   */
  warmPoster(): void {
    const video = this.vidRef?.nativeElement;
    if (!video || this.started) return;
    video.muted = true;
    video.play().catch(() => this.seekPoster()); // autoplay blocked → best-effort seek
  }

  /** Freeze on the poster frame once the warm-up reaches it. */
  onTime(): void {
    const video = this.vidRef?.nativeElement;
    if (!video || this.started || this.poised) return;
    if (video.currentTime >= (this.w.cover.posterTime || 0)) {
      this.poised = true; // fades the video in
      video.pause();
    }
  }

  /** Fallback when autoplay is blocked: try to seek to the poster frame. */
  seekPoster(): void {
    const video = this.vidRef?.nativeElement;
    if (!video) return;
    const t = Math.min(this.w.cover.posterTime || 0, (video.duration || 0) - 0.05);
    if (t > 0) {
      try {
        video.currentTime = t;
      } catch {
        /* ignore — some browsers block seeking before canplay */
      }
    }
  }

  /** Tap the seal: play the opening from the poster frame on (this gesture also starts the music). */
  start(): void {
    if (this.started || this.opening) return;
    this.started = true;
    this.poised = true; // make sure the video is visible
    const video = this.vidRef?.nativeElement;
    if (!video) {
      this.reveal();
      return;
    }
    video.muted = true;
    // Play forward from wherever we rested (the poster frame) — no reset to 0,
    // so it never flashes back to the black intro.
    video.play().catch(() => this.reveal());
    this.armFallback();
  }

  /** Safety net: reveal shortly after the remaining runtime in case `ended` misfires. */
  private armFallback(): void {
    const video = this.vidRef?.nativeElement;
    if (!video || !isFinite(video.duration)) return;
    const remaining = Math.max(0, video.duration - video.currentTime);
    clearTimeout(this.fallback);
    this.fallback = setTimeout(() => this.reveal(), remaining * 1000 + 1500);
  }

  /** Video finished (or was skipped): reveal the first page. */
  reveal(): void {
    if (this.opening) return;
    this.opening = true;
    clearTimeout(this.fallback);
    this.vidRef?.nativeElement.pause();
    // Unlock scrolling and let the first page draw itself in as the cover fades.
    this.doc.body.classList.remove('letter-sealed');
    setTimeout(() => (this.gone = true), 1000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.fallback);
    this.doc.body.classList.remove('letter-sealed');
  }
}
