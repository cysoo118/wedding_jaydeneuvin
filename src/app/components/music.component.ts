import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { WEDDING } from '../wedding-data';

@Component({
  selector: 'app-music',
  standalone: true,
  template: `
    @if (w.music.src) {
      <audio #player [src]="w.music.src" loop preload="auto"></audio>

      <button
        class="music"
        [class.playing]="playing"
        (click)="toggle()"
        [title]="playing ? 'Pause ' + w.music.title : 'Play ' + w.music.title"
        [attr.aria-label]="playing ? 'Pause music' : 'Play music'"
        [attr.aria-pressed]="playing"
      >
        @if (playing) {
          <span class="eq" aria-hidden="true">
            <i></i><i></i><i></i><i></i>
          </span>
        } @else {
          <svg class="note" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 17V6l9-1.8v9.3"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <ellipse cx="6.6" cy="17" rx="2.6" ry="2.1" stroke="currentColor" stroke-width="1.4" />
            <ellipse cx="15.6" cy="13.5" rx="2.6" ry="2.1" stroke="currentColor" stroke-width="1.4" />
          </svg>
        }
      </button>
    }
  `,
  styles: [
    `
      .music {
        position: fixed;
        right: max(1.25rem, env(safe-area-inset-right));
        bottom: max(1.25rem, env(safe-area-inset-bottom));
        z-index: 50;
        width: 3rem;
        height: 3rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
        cursor: pointer;
        color: var(--gold);
        background: rgba(244, 239, 227, 0.72);
        border: 1px solid var(--gold);
        box-shadow: 0 4px 18px rgba(42, 38, 32, 0.14);
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);
        transition:
          transform 0.35s ease,
          color 0.35s ease,
          box-shadow 0.35s ease;
        animation: fade-in 0.8s ease both 0.6s;
      }
      .music:hover {
        transform: translateY(-2px);
        color: var(--pine);
      }
      .music:focus-visible {
        outline: 2px solid var(--gold);
        outline-offset: 3px;
      }
      /* soft resonating ring while the track plays */
      .music.playing::after {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 50%;
        border: 1px solid var(--gold);
        animation: ripple 2.6s ease-out infinite;
      }

      .note {
        width: 1.25rem;
        height: 1.25rem;
      }

      .eq {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 1.1rem;
      }
      .eq i {
        width: 2px;
        height: 100%;
        background: currentColor;
        border-radius: 1px;
        transform-origin: bottom;
        animation: bounce 1.05s ease-in-out infinite;
      }
      .eq i:nth-child(2) {
        animation-delay: 0.22s;
      }
      .eq i:nth-child(3) {
        animation-delay: 0.44s;
      }
      .eq i:nth-child(4) {
        animation-delay: 0.12s;
      }

      @keyframes bounce {
        0%,
        100% {
          transform: scaleY(0.35);
        }
        50% {
          transform: scaleY(1);
        }
      }
      @keyframes ripple {
        0% {
          transform: scale(1);
          opacity: 0.5;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .music {
          animation: none;
        }
        .eq i,
        .music.playing::after {
          animation: none;
        }
        .eq i {
          transform: scaleY(0.7);
        }
      }
    `,
  ],
})
export class MusicComponent implements AfterViewInit, OnDestroy {
  w = WEDDING;
  playing = false;

  @ViewChild('player') private playerRef?: ElementRef<HTMLAudioElement>;
  private userPaused = false;
  private fadeTimer?: ReturnType<typeof setInterval>;
  private readonly gestures = ['pointerdown', 'keydown', 'touchstart'] as const;
  private readonly startOnGesture = (e: Event) => {
    // Taps on the button itself are handled by its click -> toggle(); ignoring
    // them here keeps the button the single source of truth for play/pause and
    // avoids a race that could restart the track the instant you try to stop it.
    if (e.target instanceof Element && e.target.closest('.music')) return;
    this.disarmGestures();
    if (!this.userPaused) this.play();
  };

  ngAfterViewInit(): void {
    if (!this.w.music.src) return;
    // Autoplay with sound is blocked until the user interacts, so attempt an
    // immediate start (works if they already have) and otherwise begin on the
    // first gesture elsewhere on the page.
    this.play();
    this.gestures.forEach((e) =>
      window.addEventListener(e, this.startOnGesture, { passive: true }),
    );
  }

  private disarmGestures(): void {
    this.gestures.forEach((e) => window.removeEventListener(e, this.startOnGesture));
  }

  toggle(): void {
    if (this.playing) {
      this.userPaused = true;
      this.pause();
    } else {
      this.userPaused = false;
      this.play();
    }
  }

  private play(): void {
    const audio = this.playerRef?.nativeElement;
    if (!audio) return;
    audio
      .play()
      .then(() => {
        this.playing = true;
        this.fadeTo(0.85);
      })
      .catch(() => {
        /* blocked — the first gesture listener will retry */
      });
  }

  private pause(): void {
    this.playing = false;
    this.fadeTo(0, () => this.playerRef?.nativeElement.pause());
  }

  /** Gently ramp the volume so the track eases in and out. */
  private fadeTo(target: number, done?: () => void): void {
    const audio = this.playerRef?.nativeElement;
    if (!audio) return;
    clearInterval(this.fadeTimer);
    const step = (target - audio.volume) / 20 || target;
    this.fadeTimer = setInterval(() => {
      const next = audio.volume + step;
      if ((step >= 0 && next >= target) || (step < 0 && next <= target)) {
        audio.volume = Math.min(1, Math.max(0, target));
        clearInterval(this.fadeTimer);
        done?.();
      } else {
        audio.volume = Math.min(1, Math.max(0, next));
      }
    }, 40);
  }

  ngOnDestroy(): void {
    clearInterval(this.fadeTimer);
    this.disarmGestures();
  }
}
