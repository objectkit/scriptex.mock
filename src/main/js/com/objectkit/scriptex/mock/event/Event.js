/**
 * A representaion of a MIDI event.
 * @interface
 */
class Event {

  /**
   * Though the reference implementation simply has a prototype property
   * named status, status is defined as static value here in order to
   * facilitate testing without the need for instantiation of events
   *
   * @example
   * expect(event).property(`status`, NoteOn.STATUS)
   *
   * @type {Object}
   */
  static get STATUS () {
    return 0
  }

  constructor (event={}) {
    const {
      channel= 1
    , port= 1
    , isRealtime= false
    , articulationID= 0
    , beatPos= 0
    , data1= 0
    , data2= 0
    , data3= 0
    } = event
    this.channel= channel
    this.port= port
    this.isRealtime= isRealtime
    this.articulationID= articulationID
    this.beatPos= beatPos
    this.data1= data1
    this.data2= data2
    this.data3= data3
  }

  /**
   * The events midi status code.
   * @type {number}
   */
  get status () {
    return this.constructor.STATUS
  }

  /**
   * The events midi channel.
   * @type {number}
   */
  set channel (channel) {
    this._channel= channel
  }

  get channel () {
    return this._channel
  }

  /**
   * The events midi port.
   * @type {number}
   */
  set port (port) {
    this._port= port
  }

  get port () {
    return this._port
  }

  /**
   * The events beat position.
   * @type {number}
   */
  set beatPos (beatPos) {
    this._beatPos= beatPos
  }

  get beatPos () {
    return this._beatPos
  }

  /**
   * The events articulationID.
   * @type {number}
   */
  set articulationID (articulationID) {
    this._articulationID= articulationID
  }

  get articulationID () {
    return this._articulationID
  }

  /**
   * The events isRealtime status.
   * @type {number}
   */
  set isRealtime (isRealtime) {
    this._isRealtime= isRealtime
  }

  get isRealtime () {
    return this._isRealtime
  }

  /**
   * Send the event after a millisecond delay.
   * @param  {number} number An unsigned float or int.
   * @return {void}
   * @see [SendMIDIEventAfterMillseconds]{@link Scripter#SendMIDIEventAfterMilliseconds}
   */
  sendAfterMilliseconds (number) {
    return
  }

  /**
   * Send the event after a beat delay.
   * @param  {number} number An unsigned float or int.
   * @return {void}        [description]
   * @see [SendMIDIEventAfterBeats]{@link Scripter#SendMIDIEventAfterBeats}
   */
  sendAfterBeats (number) {
    return
  }

  /**
   * Schedule the event for a specific beat.
   * @param  {number} number An unsigned float or int.
   * @return {void}
   * @see [SendMIDIEventAtBeat]{@link Scripter#SendMIDIEventAtBeat}
   */
  sendAtBeat (number) {
    return
  }

  /**
   * [send description]
   * @return {void}
   * @see [SendMIDIEventNow]{@link Scripter#SendMIDIEventNow}
   */
  send() {
    return
  }
}

export { Event }
