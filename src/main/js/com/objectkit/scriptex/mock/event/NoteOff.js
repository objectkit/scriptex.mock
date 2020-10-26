import { Note } from "com/objectkit/scriptex/mock/event/Note"

/**
 * A representation of a MIDI NoteOff event.
 * @extends Note
 * @interface
 */
class NoteOff extends Note {
  /** @override */
  static get STATUS () {
    return 128
  }
}

export { NoteOff }
