import { Component } from '@angular/core';
import { WEDDING } from '../wedding-data';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <header class="hero">
      <div class="frame">
        <p class="eyebrow reveal" style="--d: 0.2s">{{ w.invitationLine }}</p>

        <!-- self-drawing garden pavilion -->
        <svg
          class="pavilion"
          viewBox="0 0 240 170"
          fill="none"
          aria-hidden="true"
        >
          <g
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <!-- dome -->
            <path class="draw" style="--len: 210" d="M60 66 Q120 4 180 66" />
            <path class="draw" style="--len: 40" d="M120 8 L120 66" />
            <circle class="draw" style="--len: 20" cx="120" cy="10" r="3" />
            <!-- roof rim -->
            <path class="draw" style="--len: 150" d="M50 66 L190 66" />
            <path class="draw" style="--len: 150" d="M56 72 L184 72" />
            <!-- columns -->
            <path class="draw" style="--len: 62" d="M64 72 L64 132" />
            <path class="draw" style="--len: 62" d="M96 72 L96 132" />
            <path class="draw" style="--len: 62" d="M144 72 L144 132" />
            <path class="draw" style="--len: 62" d="M176 72 L176 132" />
            <!-- arches -->
            <path class="draw" style="--len: 70" d="M64 92 Q80 78 96 92" />
            <path class="draw" style="--len: 90" d="M96 92 Q120 74 144 92" />
            <path class="draw" style="--len: 70" d="M144 92 Q160 78 176 92" />
            <!-- base steps -->
            <path class="draw" style="--len: 130" d="M56 132 L184 132" />
            <path class="draw" style="--len: 150" d="M46 142 L194 142" />
            <path class="draw" style="--len: 170" d="M36 152 L204 152" />
            <!-- botanical flourishes -->
            <path class="draw sprig" style="--len: 60" d="M40 132 q-14 -12 -8 -34" />
            <path class="draw sprig" style="--len: 20" d="M32 108 q-9 2 -12 10" />
            <path class="draw sprig" style="--len: 20" d="M33 116 q9 3 15 -2" />
            <path class="draw sprig" style="--len: 60" d="M200 132 q14 -12 8 -34" />
            <path class="draw sprig" style="--len: 20" d="M208 108 q9 2 12 10" />
            <path class="draw sprig" style="--len: 20" d="M207 116 q-9 3 -15 -2" />
          </g>
        </svg>

        <p class="together reveal" style="--d: 1.7s">the marriage of</p>

        <h1 class="names">
          <span class="reveal" style="--d: 1.9s">{{ w.partnerA }}</span>
          <span class="amp reveal" style="--d: 2.1s">&amp;</span>
          <span class="reveal" style="--d: 2.3s">{{ w.partnerB }}</span>
        </h1>

        <div class="rule reveal" style="--d: 2.6s">
          <span class="diamond"></span>
        </div>

        <p class="date reveal" style="--d: 2.8s">
          {{ w.dateLong }}<br />{{ w.year }}
        </p>
        <p class="place reveal" style="--d: 3s">{{ w.location }}</p>
      </div>

      <a class="scroll reveal" style="--d: 3.4s" href="#countdown" aria-label="Scroll to details">
        <span>the day approaches</span>
        <svg viewBox="0 0 24 40" fill="none" aria-hidden="true">
          <path
            d="M12 4 L12 30 M6 24 L12 32 L18 24"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </header>
  `,
  styles: [
    `
      .hero {
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 3rem 1.25rem 2rem;
        position: relative;
      }
      .frame {
        position: relative;
        max-width: 40rem;
        padding: clamp(2rem, 6vw, 4rem) clamp(1.5rem, 6vw, 4rem);
      }
      /* engraved double border */
      .frame::before,
      .frame::after {
        content: '';
        position: absolute;
        inset: 0;
        border: 1px solid var(--gold);
        opacity: 0.55;
        pointer-events: none;
      }
      .frame::after {
        inset: 7px;
        opacity: 0.3;
      }

      .pavilion {
        width: clamp(190px, 46vw, 280px);
        height: auto;
        color: var(--pine);
        margin: 1.4rem auto 0.6rem;
      }
      .draw {
        stroke-dasharray: var(--len);
        stroke-dashoffset: var(--len);
        animation: draw 1.4s ease forwards;
      }
      .sprig {
        color: var(--gold);
        stroke: var(--gold);
      }
      /* stagger the drawing so it feels hand-inked */
      .pavilion .draw:nth-child(n + 2) { animation-delay: 0.25s; }
      .pavilion .draw:nth-child(n + 6) { animation-delay: 0.5s; }
      .pavilion .draw:nth-child(n + 10) { animation-delay: 0.75s; }
      .pavilion .draw:nth-child(n + 14) { animation-delay: 1s; }
      .pavilion .draw:nth-child(n + 18) { animation-delay: 1.2s; }

      .together {
        font-family: var(--body);
        font-style: italic;
        color: var(--stone);
        margin: 0.4rem 0 0.2rem;
        font-size: 1.05rem;
      }
      .names {
        font-size: clamp(3.2rem, 13vw, 6rem);
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        letter-spacing: 0.02em;
      }
      .names .amp {
        font-family: var(--script);
        color: var(--gold);
        font-size: 0.62em;
        line-height: 0.7;
        margin: -0.1em 0;
      }
      .date {
        font-family: var(--display);
        font-size: 1.3rem;
        color: var(--pine-soft);
        margin: 0.9rem 0 0.3rem;
      }
      .place {
        font-family: var(--label);
        letter-spacing: 0.32em;
        text-transform: uppercase;
        font-size: 0.7rem;
        color: var(--gold);
        margin: 0;
      }

      .scroll {
        margin-top: 2.6rem;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--stone);
      }
      .scroll span {
        font-family: var(--label);
        letter-spacing: 0.3em;
        text-transform: uppercase;
        font-size: 0.6rem;
      }
      .scroll svg {
        width: 18px;
        height: 30px;
        color: var(--gold);
        animation: bob 2.4s ease-in-out infinite;
      }

      .reveal {
        opacity: 0;
        transform: translateY(12px);
        animation: rise 1.1s ease forwards;
        animation-delay: var(--d, 0s);
      }

      @keyframes draw {
        to {
          stroke-dashoffset: 0;
        }
      }
      @keyframes rise {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes bob {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(6px);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .draw {
          stroke-dashoffset: 0;
        }
        .reveal {
          opacity: 1;
          transform: none;
        }
      }
    `,
  ],
})
export class HeroComponent {
  w = WEDDING;
}
