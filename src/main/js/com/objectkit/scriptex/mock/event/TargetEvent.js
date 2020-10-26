import { Event } from "com/objectkit/scriptex/mock/event/Event"

/**
 * A representation of a MIDI TargetEvent event.
 * @extends Event
 * @interface
 */
class TargetEvent extends Event {
  /** @override */
  static get STATUS () {
    return 80
  }
}

export { TargetEvent }
