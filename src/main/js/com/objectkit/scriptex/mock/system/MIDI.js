/**
 * Inteface for mocks represeting the Scripter MIDI object
 * @interface
 */
class MIDI {

  /**
   * [noteNumber description]
   * @param  {string} noteName [description]
   * @return {number}          [description]
   */
  noteNumber (noteName) {}

  /**
   * [noteName description]
   * @param  {number} noteNumber [description]
   * @return {string}            [description]
   */
  noteName (noteNumber) {}

  /**
   * [ccName description]
   * @param  {string} ccNumber [description]
   * @return {number}          [description]
   */
  ccName (ccNumber) {}

  /**
   * [normalizeStatus description]
   * @param  {number} statusNumber [description]
   * @return {number}              [description]
   */
  normalizeStatus (statusNumber) {}

  /**
   * [normalizeChannel description]
   * @param  {number} channelNumber [description]
   * @return {number}               [description]
   */
  normalizeChannel (channelNumber) {}

  /**
   * [normalizeData description]
   * @param  {number} number [description]
   * @return {number}        [description]
   */
  normalizeData (number) {}

  /**
   * [allNotesOff description]
   * @return {void}
   */
  allNotesOff () {}
}

export { MIDI }
