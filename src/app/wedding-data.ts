/* ============================================================
   EDIT EVERYTHING HERE.
   Change names, dates, venues and copy in this one file and the
   whole invitation updates. No other file needs touching.
   ============================================================ */

export interface StoryChapter {
  year: string;
  title: string;
  text: string;
}

export interface EventDetail {
  kind: string; // e.g. "Ceremony"
  time: string;
  venue: string;
  address: string;
  note: string;
  mapUrl: string;
}

export const WEDDING = {
  partnerA: 'Jayden Wong',
  partnerB: 'Euvin Foong',

  // Used for the hero date line and the live countdown.
  // Format: YYYY-MM-DDTHH:mm:ss (24-hour, local time).
  dateISO: '2026-09-12T16:00:00',
  dateLong: 'Saturday, the Twelfth of September',
  year: 'Two Thousand Twenty-Six',
  dateShort: '12 · 09 · 2026',

  location: 'Ipoh, Malaysia',
  hashtag: '#JaydenAndEuvin',

  invitationLine: 'Together with their families',
  heroBlessing:
    'request the honour of your presence as they exchange their vows',

  story: <StoryChapter[]>[
    {
      year: '2018',
      title: 'A borrowed umbrella',
      text: 'A sudden monsoon downpour, one shared umbrella outside an old kopitiam, and a conversation that outlasted the rain.',
    },
    {
      year: '2021',
      title: 'The long way home',
      text: 'Years of letters, long drives, and slow mornings taught us that we had, quietly, become each other\u2019s favourite place.',
    },
    {
      year: '2025',
      title: 'A question, at last',
      text: 'Beneath the same rain trees where we first met, one knee bent, and a lifetime was gladly, gently, said yes to.',
    },
  ],

  events: <EventDetail[]>[
    {
      kind: 'The Ceremony',
      time: '4:00 in the afternoon',
      venue: 'Heritage Garden Pavilion',
      address: 'No. 12, Jalan Sultan Idris Shah, Ipoh',
      note: 'Do arrive a little early; the vows begin promptly at four.',
      mapUrl: 'https://maps.google.com',
    },
    {
      kind: 'The Reception',
      time: '6:30 until late',
      venue: 'The Long Verandah',
      address: 'Same grounds, beyond the garden arch',
      note: 'Dinner, dancing, and a toast beneath the lanterns.',
      mapUrl: 'https://maps.google.com',
    },
  ],

  dressCode: 'Garden formal, in soft heritage tones',

  // Intro cover video. Plays when a guest "opens" the invitation, then the
  // first page is revealed. Drop the file in src/assets. Set video to '' to skip.
  cover: {
    video: 'assets/opening.mp4',
    // Seconds into the clip to rest on before it's tapped — pick the moment the
    // sealed letter is clearly visible (this skips any black intro). Playback
    // also begins here, so tapping never flashes back to black.
    posterTime: 0.5,
  },

  // Background music. Drop an audio file into src/assets/music/ and point to
  // it here (it loops automatically). Set src to '' to hide the music button.
  music: {
    src: 'assets/music/married.mp3',
    title: 'Our song',
  },

  // Simple placeholder gallery. Swap these for your own photo URLs
  // (or files placed in src/assets and referenced as 'assets/....jpg').
  gallery: [
    { caption: 'The kopitiam corner' },
    { caption: 'Cameron mornings' },
    { caption: 'Ipoh, golden hour' },
    { caption: 'The proposal' },
    { caption: 'Old town walks' },
    { caption: 'Us, lately' },
  ],
};
