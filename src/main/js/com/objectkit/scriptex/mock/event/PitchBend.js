import { Event } from "com/objectkit/scriptex/mock/event/Event"

/**
 * A representation of a MIDI PitchBend event.
 * @extends Event
 * @interface
 */
class PitchBend extends Event {
  /** @override */
  static get STATUS () {
    return 224
  }

  constructor (event={}) {
    super(event)
    const { value= 0 } = event
    this.value= value
  }

  /**
   * A PitchBend value in the range of -8191 to 8192
   * @type {number}
   */
  set value (value) {
    this._value= value
  }

  get value () {
    return this._value
  }
}

export { PitchBend }
