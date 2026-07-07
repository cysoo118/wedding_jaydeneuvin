import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { WEDDING } from '../wedding-data';

interface Rsvp {
  name: string;
  email: string;
  attending: 'yes' | 'no' | '';
  guests: number;
  message: string;
}

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="rsvp" id="rsvp">
      <div class="panel">
        <p class="eyebrow">Kindly reply</p>
        <h2>Will you join us?</h2>
        <div class="rule"><span class="diamond"></span></div>

        @if (!sent) {
          <form #f="ngForm" (ngSubmit)="submit(f)" novalidate>
            <label class="field">
              <span>Full name</span>
              <input
                name="name"
                [(ngModel)]="model.name"
                required
                autocomplete="name"
              />
            </label>

            <label class="field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                [(ngModel)]="model.email"
                required
                email
                autocomplete="email"
              />
            </label>

            <div class="field">
              <span>Will you attend?</span>
              <div class="choice">
                <label>
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    [(ngModel)]="model.attending"
                    required
                  />
                  <span>Joyfully accepts</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    [(ngModel)]="model.attending"
                  />
                  <span>Regretfully declines</span>
                </label>
              </div>
            </div>

            @if (model.attending === 'yes') {
              <label class="field">
                <span>Number in your party</span>
                <input
                  name="guests"
                  type="number"
                  min="1"
                  max="10"
                  [(ngModel)]="model.guests"
                />
              </label>
            }

            <label class="field">
              <span>A note for the couple <em>(optional)</em></span>
              <textarea
                name="message"
                rows="3"
                [(ngModel)]="model.message"
              ></textarea>
            </label>

            <button type="submit" [disabled]="f.invalid">
              Send our reply
            </button>
            @if (f.submitted && f.invalid) {
              <p class="err">Please add your name, a valid email, and a reply.</p>
            }
          </form>
        } @else {
          <div class="thanks">
            <svg viewBox="0 0 60 60" aria-hidden="true">
              <path
                d="M16 32 L26 42 L46 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                opacity="0.5"
              />
            </svg>
            @if (model.attending === 'yes') {
              <p class="line">
                Thank you, {{ firstName() }}. We can hardly wait to celebrate
                with you.
              </p>
            } @else {
              <p class="line">
                Thank you for letting us know, {{ firstName() }}. You’ll be
                dearly missed.
              </p>
            }
            <p class="tag">{{ w.hashtag }}</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .rsvp {
        padding: var(--section-y) 1.5rem;
        background: var(--pine);
      }
      .panel {
        max-width: 32rem;
        margin: 0 auto;
        text-align: center;
        color: var(--parchment);
      }
      .panel .eyebrow {
        color: var(--gold-light);
      }
      .panel h2 {
        color: var(--parchment);
        font-size: clamp(2.2rem, 7vw, 3.2rem);
        margin-top: 0.5rem;
      }
      .panel .rule {
        color: var(--gold-light);
        margin: 1.2rem 0 2.4rem;
      }
      form {
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 1.3rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .field > span {
        font-family: var(--label);
        letter-spacing: 0.22em;
        text-transform: uppercase;
        font-size: 0.64rem;
        color: var(--gold-light);
      }
      .field em {
        text-transform: none;
        letter-spacing: 0;
        font-style: italic;
        opacity: 0.7;
      }
      input,
      textarea {
        font-family: var(--body);
        font-size: 1.05rem;
        color: var(--parchment);
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(198, 167, 101, 0.5);
        padding: 0.5rem 0.2rem;
        outline: none;
        transition: border-color 0.3s ease;
      }
      input:focus,
      textarea:focus {
        border-color: var(--gold-light);
      }
      textarea {
        resize: vertical;
        border: 1px solid rgba(198, 167, 101, 0.5);
        padding: 0.7rem;
      }
      .choice {
        display: flex;
        flex-wrap: wrap;
        gap: 1.2rem;
      }
      .choice label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: var(--body);
        font-size: 1.05rem;
        color: var(--parchment);
        cursor: pointer;
      }
      .choice input {
        accent-color: var(--gold);
        width: auto;
      }
      button {
        margin-top: 0.6rem;
        align-self: center;
        font-family: var(--label);
        letter-spacing: 0.28em;
        text-transform: uppercase;
        font-size: 0.72rem;
        color: var(--pine);
        background: var(--gold-light);
        border: none;
        padding: 0.95rem 2.4rem;
        cursor: pointer;
        transition:
          background 0.3s ease,
          transform 0.2s ease;
      }
      button:hover:not(:disabled) {
        background: var(--parchment);
        transform: translateY(-2px);
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .err {
        color: var(--gold-light);
        font-style: italic;
        text-align: center;
        margin: 0;
        font-size: 0.95rem;
      }
      .thanks {
        color: var(--parchment);
      }
      .thanks svg {
        width: 62px;
        height: 62px;
        color: var(--gold-light);
        margin-bottom: 1rem;
      }
      .thanks .line {
        font-family: var(--display);
        font-style: italic;
        font-size: 1.5rem;
        color: var(--parchment);
      }
      .thanks .tag {
        font-family: var(--label);
        letter-spacing: 0.3em;
        color: var(--gold-light);
        font-size: 0.7rem;
        margin: 1.4rem 0 0;
      }
    `,
  ],
})
export class RsvpComponent {
  w = WEDDING;
  sent = false;
  model: Rsvp = {
    name: '',
    email: '',
    attending: '',
    guests: 1,
    message: '',
  };

  firstName(): string {
    return this.model.name.trim().split(' ')[0] || 'friend';
  }

  submit(form: NgForm): void {
    if (form.invalid) return;
    // No backend is wired up. To collect replies, POST `this.model` to your
    // own API, a Formspree endpoint, or a Google Apps Script — e.g.:
    //   fetch('https://your-endpoint', { method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(this.model) });
    console.log('RSVP submitted:', this.model);
    this.sent = true;
  }
}
