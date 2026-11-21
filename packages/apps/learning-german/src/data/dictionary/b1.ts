// biome-ignore-all format: one entry per line keeps the word data scannable
import { aiEx, type Entry, sepVerb, verb } from "./build.ts";

export default {
  wachsen: verb("wachsen", "to grow", ["wachse", "wächst", "wächst", "wachsen", "wachst", "wachsen"], "wuchs", "ist gewachsen", aiEx("Das Kind wächst schnell.", "The child is growing fast."), aiEx("Du bist aber gewachsen!", "You have really grown!")),
  aufwachen: sepVerb("auf", "aufwachen", "to wake up", ["wache auf", "wachst auf", "wacht auf", "wachen auf", "wacht auf", "wachen auf"], "wachte auf", "ist aufgewacht", aiEx("Ich wache um sieben Uhr auf.", "I wake up at seven o'clock."), aiEx("Jess ist heute spät aufgewacht.", "Jess woke up late today.")),
  // Not on any Goethe list: B1 is our own estimate.
  verschlafen: verb("verschlafen", "to oversleep", ["verschlafe", "verschläfst", "verschläft", "verschlafen", "verschlaft", "verschlafen"], "verschlief", "hat verschlafen", aiEx("Jess hat heute verschlafen.", "Jess overslept today.")),
} satisfies Record<string, Entry>;