import { Event } from "com/objectkit/scriptex/mock/event/Event"

/**
 * A representation of a MIDI ProgramChange event.
 * @extends Event
 * @interface
 */
class ProgramChange extends Event {
  /** @override */
  static get STATUS () {
    return 192
  }

  constructor (event={}) {
    super(event)
    const { number= 1 }= event
    this.number= number
  }

  set number (number) {
    this._number= number
  }

  get number () {
    return this._number
  }
}

export { ProgramChange }
