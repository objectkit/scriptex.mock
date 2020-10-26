import { Event } from "com/objectkit/scriptex/mock/event/Event"

/**
 * A representation of a MIDI ChannelPressure event.
 * @extends Event
 * @interface
 */
class ChannelPressure extends Event {
  
  /** @override */
  static get STATUS () {
    return 208
  }

  constructor (event= {} ) {
    super(event)
    const { value= 0 } = event
    this.value = value
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
}

export { ChannelPressure }
