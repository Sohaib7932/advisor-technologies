/**
 * Card motion: the one place to tune how card groups open and how a card
 * answers the pointer. Read by CardDeck / DeckCard; the hover moves (lift,
 * icon spring, ring ripple) are the `.deck-card` / `.icon-art` rules in
 * globals.css.
 */
export const CARD_MOTION = {
  /** Plays once when the deck's top reaches this point (about 25% in view). */
  start: "top 75%",
  /** Rest state: cards tucked into a loose stack. */
  rest: {
    scale: 0.92,
    /** Degrees; alternates sign card to card. */
    rotate: 3.5,
    opacity: 0.35,
    /** How far each card is pulled toward the deck's centre (0 to 1). */
    gather: 0.82,
    /** Tall decks (one column on phones) just tuck down by this many px. */
    tuck: 48,
  },
  open: { duration: 0.9, stagger: 0.1, ease: "back.out(1.25)" },
  /** Illustration rises after its card opens. */
  illustration: { y: 34, duration: 0.8, delay: 0.25, ease: "power3.out" },
  /** Touch screens: seconds after opening before each icon plays its move. */
  touchPlay: 0.7,
  /** Degrees of illustration tilt following the pointer. */
  tilt: 7,
} as const;
