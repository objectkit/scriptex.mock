import { Event } from "com/objectkit/scriptex/mock/event/Event"

/**
 * A representation of a MIDI Note event.
 * @extends Event
 * @interface
 */
class Note extends Event {
  /** @override */
  static get STATUS () {
    return 144
  }

  constructor (event={}) {
    super(event)
    const { pitch= 100, velocity= 100 } = event
    this.pitch= pitch
    this.velocity= velocity
  }

  set pitch (pitch) {
    this._pitch= pitch
  }

  get pitch () {
    return this._pitch
  }

  set velocity (velocity) {
    this._velocity= velocity
  }

  get velocity () {
    return this._velocity
  }
}

export { Note }
