import { Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';
import { WEDDING } from '../wedding-data';

@Component({
  selector: 'app-celebration',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section class="celebration" id="details">
      <div class="head" appReveal>
        <p class="eyebrow">The celebration</p>
        <h2>Where &amp; when</h2>
        <div class="rule"><span class="diamond"></span></div>
        <p class="date-band">{{ w.dateLong }} &nbsp;·&nbsp; {{ w.dateShort }}</p>
      </div>

      <div class="cards">
        @for (e of w.events; track e.kind; let i = $index) {
          <article class="card" appReveal [revealDelay]="i * 140">
            <span class="kind">{{ e.kind }}</span>
            <span class="time">{{ e.time }}</span>
            <h3>{{ e.venue }}</h3>
            <p class="addr">{{ e.address }}</p>
            <p class="note">{{ e.note }}</p>
            <a class="map" [href]="e.mapUrl" target="_blank" rel="noopener">
              View map
            </a>
          </article>
        }
      </div>

      <p class="dress" appReveal>
        <span class="eyebrow">Attire</span><br />{{ w.dressCode }}
      </p>
    </section>
  `,
  styles: [
    `
      .celebration {
        padding: var(--section-y) 1.5rem;
        background: var(--parchment-deep);
      }
      .head {
        text-align: center;
        max-width: 40rem;
        margin: 0 auto 3rem;
      }
      .head h2 {
        font-size: clamp(2.2rem, 7vw, 3.4rem);
        margin-top: 0.6rem;
      }
      .head .rule {
        margin: 1.4rem 0 1rem;
      }
      .date-band {
        font-family: var(--display);
        font-style: italic;
        font-size: 1.25rem;
        color: var(--pine-soft);
        margin: 0;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
        gap: 1.6rem;
        max-width: 44rem;
        margin: 0 auto;
      }
      .card {
        background: var(--parchment);
        border: 1px solid rgba(166, 124, 61, 0.4);
        padding: 2.4rem 2rem;
        text-align: center;
        position: relative;
      }
      .card::before {
        content: '';
        position: absolute;
        inset: 6px;
        border: 1px solid rgba(166, 124, 61, 0.22);
        pointer-events: none;
      }
      .kind {
        font-family: var(--label);
        letter-spacing: 0.34em;
        text-transform: uppercase;
        font-size: 0.66rem;
        color: var(--gold);
        display: block;
      }
      .time {
        font-family: var(--display);
        font-style: italic;
        color: var(--stone);
        display: block;
        margin: 0.5rem 0 1rem;
      }
      .card h3 {
        font-size: 1.9rem;
        color: var(--oxblood);
      }
      .addr {
        color: var(--pine-soft);
        margin: 0.5rem 0 0.9rem;
        font-size: 1rem;
      }
      .note {
        font-style: italic;
        color: var(--stone);
        font-size: 0.98rem;
        margin: 0 0 1.4rem;
      }
      .map {
        font-family: var(--label);
        letter-spacing: 0.2em;
        text-transform: uppercase;
        font-size: 0.66rem;
        color: var(--pine);
        text-decoration: none;
        border-bottom: 1px solid var(--gold);
        padding-bottom: 3px;
        transition: color 0.3s ease;
      }
      .map:hover {
        color: var(--gold);
      }
      .dress {
        text-align: center;
        margin: 3rem auto 0;
        font-family: var(--display);
        font-style: italic;
        font-size: 1.3rem;
        color: var(--pine-soft);
        line-height: 2.2;
      }

      .reveal-init {
        opacity: 0;
        transform: translateY(22px);
        transition:
          opacity 0.8s ease,
          transform 0.8s ease;
      }
      .reveal-init.is-visible {
        opacity: 1;
        transform: none;
      }
    `,
  ],
})
export class CelebrationComponent {
  w = WEDDING;
}
