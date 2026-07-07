import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { WEDDING } from '../wedding-data';

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-countdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="countdown" id="countdown">
      <p class="eyebrow">Counting the days</p>
      <div class="rule"><span class="diamond"></span></div>

      @if (!isPast()) {
        <div class="grid">
          <div class="unit">
            <span class="num">{{ pad(t().days) }}</span>
            <span class="lbl">Days</span>
          </div>
          <span class="sep">·</span>
          <div class="unit">
            <span class="num">{{ pad(t().hours) }}</span>
            <span class="lbl">Hours</span>
          </div>
          <span class="sep">·</span>
          <div class="unit">
            <span class="num">{{ pad(t().minutes) }}</span>
            <span class="lbl">Minutes</span>
          </div>
          <span class="sep">·</span>
          <div class="unit">
            <span class="num">{{ pad(t().seconds) }}</span>
            <span class="lbl">Seconds</span>
          </div>
        </div>
        <p class="until">until we say “I do”</p>
      } @else {
        <p class="until married">
          With joy — {{ w.partnerA }} &amp; {{ w.partnerB }} are married.
        </p>
      }
    </section>
  `,
  styles: [
    `
      .countdown {
        text-align: center;
        padding: var(--section-y) 1.25rem;
        background: var(--pine);
        color: var(--parchment);
      }
      .countdown .eyebrow {
        color: var(--gold-light);
      }
      .countdown .rule {
        color: var(--gold-light);
        margin: 1.1rem 0 2rem;
      }
      .grid {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: clamp(0.6rem, 3vw, 1.8rem);
        flex-wrap: nowrap;
      }
      .unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 3.4rem;
      }
      .num {
        font-family: var(--display);
        font-size: clamp(2.6rem, 11vw, 4.6rem);
        line-height: 1;
        color: var(--parchment);
        font-variant-numeric: tabular-nums;
      }
      .lbl {
        font-family: var(--label);
        font-size: 0.62rem;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--gold-light);
        margin-top: 0.7rem;
      }
      .sep {
        font-family: var(--display);
        font-size: clamp(1.8rem, 7vw, 3rem);
        color: var(--gold);
        opacity: 0.6;
        transform: translateY(-0.35em);
      }
      .until {
        font-family: var(--display);
        font-style: italic;
        font-size: 1.4rem;
        color: var(--gold-light);
        margin: 2.2rem 0 0;
      }
      .married {
        font-style: normal;
      }
    `,
  ],
})
export class CountdownComponent implements OnInit, OnDestroy {
  w = WEDDING;
  private target = new Date(WEDDING.dateISO).getTime();
  private id?: ReturnType<typeof setInterval>;

  t = signal<TimeParts>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  isPast = signal(false);

  ngOnInit(): void {
    this.tick();
    this.id = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    if (this.id) clearInterval(this.id);
  }

  private tick(): void {
    const diff = this.target - Date.now();
    if (diff <= 0) {
      this.isPast.set(true);
      return;
    }
    const s = Math.floor(diff / 1000);
    this.t.set({
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
