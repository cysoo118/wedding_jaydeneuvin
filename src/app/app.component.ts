import { Component } from '@angular/core';
import { HeroComponent } from './components/hero.component';
import { CountdownComponent } from './components/countdown.component';
import { StoryComponent } from './components/story.component';
import { CelebrationComponent } from './components/celebration.component';
import { GalleryComponent } from './components/gallery.component';
import { RsvpComponent } from './components/rsvp.component';
import { FooterComponent } from './components/footer.component';
import { MusicComponent } from './components/music.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    CountdownComponent,
    StoryComponent,
    CelebrationComponent,
    GalleryComponent,
    RsvpComponent,
    FooterComponent,
    MusicComponent,
  ],
  template: `
    <app-hero />
    <app-countdown />
    <app-story />
    <app-celebration />
    <app-gallery />
    <app-rsvp />
    <app-footer />
    <app-music />
  `,
})
export class AppComponent {}
