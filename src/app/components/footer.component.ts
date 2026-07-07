import { Component } from '@angular/core';
import { WEDDING } from '../wedding-data';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="seal">
        <svg viewBox="0 0 90 90" aria-hidden="true">
          <circle
            cx="45"
            cy="45"
            r="40"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            opacity="0.5"
          />
          <circle
            cx="45"
            cy="45"
            r="34"
            fill="none"
            stroke="currentColor"
            stroke-width="0.6"
            stroke-dasharray="2 3"
            opacity="0.6"
          />
        </svg>
        <span class="mono">{{ initialA }}&amp;{{ initialB }}</span>
      </div>

      <p class="names">{{ w.partnerA }} &amp; {{ w.partnerB }}</p>
      <p class="date">{{ w.dateShort }} &nbsp;·&nbsp; {{ w.location }}</p>
      <p class="tag">{{ w.hashtag }}</p>

      <p class="made">Made with love · an invitation to celebrate</p>
    </footer>
  `,
  styles: [
    `
      .footer {
        text-align: center;
        padding: var(--section-y) 1.5rem 3.5rem;
        color: var(--pine);
      }
      .seal {
        position: relative;
        width: 90px;
        height: 90px;
        margin: 0 auto 1.6rem;
        color: var(--gold);
        display: grid;
        place-items: center;
      }
      .seal svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .mono {
        font-family: var(--display);
        font-size: 1.7rem;
        color: var(--oxblood);
        letter-spacing: 0.02em;
      }
      .footer .names {
        font-family: var(--display);
        font-size: 2rem;
        margin: 0;
      }
      .footer .date {
        font-family: var(--label);
        letter-spacing: 0.24em;
        text-transform: uppercase;
        font-size: 0.68rem;
        color: var(--stone);
        margin: 0.8rem 0 0;
      }
      .footer .tag {
        font-family: var(--display);
        font-style: italic;
        color: var(--gold);
        margin: 1.2rem 0 0;
        font-size: 1.15rem;
      }
      .made {
        font-family: var(--label);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-size: 0.58rem;
        color: var(--stone);
        opacity: 0.7;
        margin: 2.6rem 0 0;
      }
    `,
  ],
})
export class FooterComponent {
  w = WEDDING;
  initialA = WEDDING.partnerA.charAt(0);
  initialB = WEDDING.partnerB.charAt(0);
}
