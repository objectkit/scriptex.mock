/**
 * Interface for representing a Scripter TimingInfo object
 * @interface
 */
class TimingInfo {
  constructor (info= {}) {
    const {
      playing= false
    , blockStartBeat= 0
    , blockEndBeat= 0
    , blockLength= 0
    , tempo= 120
    , meterNumerator= 4
    , meterDenominator= 4
    , cycling= false
    , leftCycleBeat= 0
    , rightCycleBeat= 0
    } = info
    this.playing= playing
    this.blockStartBeat= blockStartBeat
    this.blockEndBeat= blockEndBeat
    this.blockLength= blockLength
    this.tempo= tempo
    this.meterNumerator= meterNumerator
    this.meterDenominator= meterDenominator
    this.cycling= cycling
    this.leftCycleBeat= leftCycleBeat
    this.rightCycleBeat= rightCycleBeat
  }

  /**
   * Indicate that the host is playing or not
   * @type {boolean}
   */
  get playing() {
    return this._playing
  }
  set playing (any) {
    this._playing= any
  }

  /**
   * Describe the beat position of a process blocks start point
   * @type {number}
   */
  get blockStartBeat() {
    return this._blockStartBeat
  }
  set blockStartBeat(any) {
    this._blockStartBeat= any
  }

  /**
   * Describe the beat position of a process blocks end point
   * @type {number}
   */
  get blockEndBeat() {
    return this._blockEndBeat
  }
  set blockEndBeat(any){
    this._blockEndBeat= any
  }

  /**
   * Describe the beat duration of a process block
   * @type {number}
   */
  set blockLength (any) {
    this._blockLength= any
  }
  get blockLength () {
    return this._blockLength
  }

  /**
   * Describe the hosts playback tempo
   * @type {number}
   */
  get tempo() {
    return this._tempo
  }
  set tempo (any) {
    this._tempo = any
  }

  /**
   * Describe the music meters numerator
   * @see [Time Signature]{@link https://en.wikipedia.org/wiki/Time_signature}
   * @type {number}
   */
  get meterNumerator() {
    return this._meterNumerator
  }
  set meterNumerator(any) {
    this._meterNumerator= any
  }

  /**
   * Describe the music meters denominator
   * @see [Time Signature]{@link https://en.wikipedia.org/wiki/Time_signature}
   * @type {number}
   */
  get meterDenominator() {
    return this._meterDenominator
  }
  set meterDenominator(any) {
    this._meterDenominator= any
  }

  /**
   * Describe the hosts cycle state
   * @type {number}
   */
  get cycling() {
    return this._cycling
  }
  set cycling(any) {
    this._cycling= any
  }

  /**
   * Describe the beat position of the cycles start point
   * @type {number}
   */
  get leftCycleBeat() {
    return this._leftCycleBeat
  }
  set leftCycleBeat(any) {
    this._leftCycleBeat= any
  }

  /**
   * Describe the beat position of the cycles end point
   * @type {number}
   */
  get rightCycleBeat() {
    return this._rightCycleBeat
  }
  set rightCycleBeat(any) {
    this._rightCycleBeat= any
  }
}

export { TimingInfo }
