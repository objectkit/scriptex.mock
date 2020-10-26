import { Event } from "com/objectkit/scriptex/mock/event/Event"

/**
 * A representation of a MIDI ControlChange event.
 * @extends Event
 * @interface
 */
class ControlChange extends Event {
  /** @override */
  static get STATUS () {
    return 176
  }

  constructor (event={}) {
    super(event)
    const { value= 100, number= 100 } = event
    this.value= value
    this.number= number
  }

  /**
   * [value description]
   * @type  {number}
   */
  set value (value) {
    this._value= value
  }

  get value () {
    return this._value
  }

  set number (number) {
    this._number= number
  }

  get number () {
    return this._number
  }
}

export { ControlChange }
