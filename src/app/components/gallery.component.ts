import { Component } from '@angular/core';
import { RevealDirective } from '../reveal.directive';
import { WEDDING } from '../wedding-data';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section class="gallery" id="gallery">
      <div class="head" appReveal>
        <p class="eyebrow">A few moments</p>
        <h2>Along the way</h2>
      </div>

      <div class="grid">
        @for (g of w.gallery; track g.caption; let i = $index) {
          <figure class="tile" appReveal [revealDelay]="i * 90">
            <!-- Replace this placeholder with:
                 <img [src]="g.src" [alt]="g.caption" /> -->
            <div class="placeholder">
              <svg viewBox="0 0 60 60" aria-hidden="true">
                <path
                  d="M30 14 C22 22 22 30 30 46 C38 30 38 22 30 14 Z M30 22 L30 46"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <figcaption>{{ g.caption }}</figcaption>
          </figure>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .gallery {
        padding: var(--section-y) 1.5rem;
        max-width: 52rem;
        margin: 0 auto;
      }
      .head {
        text-align: center;
        margin-bottom: 3rem;
      }
      .head h2 {
        font-size: clamp(2.2rem, 7vw, 3.4rem);
        margin-top: 0.6rem;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
        gap: 1.1rem;
      }
      .tile {
        margin: 0;
        text-align: center;
      }
      .placeholder {
        aspect-ratio: 3 / 4;
        background: var(--parchment-deep);
        border: 1px solid rgba(166, 124, 61, 0.35);
        display: grid;
        place-items: center;
        color: var(--gold);
        overflow: hidden;
      }
      .tile img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        aspect-ratio: 3 / 4;
      }
      .placeholder svg {
        width: 46px;
        height: 46px;
        opacity: 0.6;
      }
      figcaption {
        font-family: var(--display);
        font-style: italic;
        color: var(--stone);
        margin-top: 0.7rem;
        font-size: 1.05rem;
      }

      .reveal-init {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
        transition:
          opacity 0.7s ease,
          transform 0.7s ease;
      }
      .reveal-init.is-visible {
        opacity: 1;
        transform: none;
      }
    `,
  ],
})
export class GalleryComponent {
  w = WEDDING;
}
