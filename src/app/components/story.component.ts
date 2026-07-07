import { Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';
import { WEDDING } from '../wedding-data';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section class="story" id="story">
      <div class="head" appReveal>
        <p class="eyebrow">Our story</p>
        <h2>How we came to be</h2>
      </div>

      <div class="line">
        @for (c of w.story; track c.year; let i = $index) {
          <article class="chapter" appReveal [revealDelay]="i * 120">
            <div class="marker">
              <span class="dot"></span>
            </div>
            <div class="body">
              <span class="year">{{ c.year }}</span>
              <h3>{{ c.title }}</h3>
              <p>{{ c.text }}</p>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .story {
        padding: var(--section-y) 1.5rem;
        max-width: 44rem;
        margin: 0 auto;
      }
      .head {
        text-align: center;
        margin-bottom: 3.5rem;
      }
      .head h2 {
        font-size: clamp(2.2rem, 7vw, 3.4rem);
        margin-top: 0.6rem;
      }
      .line {
        position: relative;
        padding-left: 2.2rem;
      }
      .line::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 6px;
        bottom: 6px;
        width: 1px;
        background: linear-gradient(
          var(--gold),
          var(--gold) 60%,
          transparent
        );
        opacity: 0.5;
      }
      .chapter {
        position: relative;
        padding-bottom: 2.8rem;
      }
      .chapter:last-child {
        padding-bottom: 0;
      }
      .marker {
        position: absolute;
        left: -2.2rem;
        top: 0.35rem;
      }
      .dot {
        display: block;
        width: 13px;
        height: 13px;
        transform: rotate(45deg);
        background: var(--parchment);
        border: 1.5px solid var(--gold);
      }
      .year {
        font-family: var(--label);
        letter-spacing: 0.3em;
        font-size: 0.72rem;
        color: var(--gold);
      }
      .chapter h3 {
        font-size: 1.9rem;
        font-style: italic;
        margin: 0.3rem 0 0.5rem;
        color: var(--oxblood);
      }
      .chapter p {
        color: var(--ink);
        margin: 0;
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
export class StoryComponent {
  w = WEDDING;
}
