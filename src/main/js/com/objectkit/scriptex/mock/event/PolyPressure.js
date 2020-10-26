import { Event } from "com/objectkit/scriptex/mock/event/Event"

/**
 * A representation of a MIDI PolyPressure event.
 * @extends Event
 * @interface
 */
class PolyPressure extends Event {
  /** @override */
  static get STATUS () {
    return 160
  }

  constructor (event={}) {
    super(event)
    const { value= 0, pitch= 0 } = event
    this.value= value
    this.pitch= pitch
  }

  set value (value) {
    this._value= value
  }

  get value () {
    return this._value
  }

  set pitch (pitch) {
    this._pitch= pitch
  }

  get pitch () {
    return this._pitch
  }
}

export { PolyPressure }
