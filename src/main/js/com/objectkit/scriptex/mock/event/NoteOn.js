import { Note } from "com/objectkit/scriptex/mock/event/Note"

/**
 * A representation of a MIDI NoteOn event.
 * @extends Note
 * @interface
 */
class NoteOn extends Note {
  /** @override */
  static get STATUS () {
    return 144
  }
}

export { NoteOn }
