/**
 * A representation of the Scripter interface.
 *
 * User configurable properties are omitted:
 *
 * - NeedsTimingInfo
 * - ResetParameterDefaults
 * - PluginParameters
 * - HandleMIDI
 * - ProcessMIDI
 * - ParameterChanged
 * - Idle
 * - Reset
 *
 * @interface
 */
class Scripter {

  /**
   * [GetTimingInfo description]
   * @return {?TimingInfo}
   * @see [TimingInfo]{@link https://support.apple.com/en-gb/guide/logicpro/lgcee186be46/10.5/mac/10.14.6}
   */
  GetTimingInfo () {}

  /**
   * [SetParameter description]
   * @param {string|number} key An existing parameters index or name
   * @param {number} val The value to set the parameter to
   * @see [SetParameter]{@link https://support.apple.com/en-gb/guide/logicpro/lgcead02fa47/10.5/mac/10.14.6}
   */
  SetParameter (key, val) {}

  /**
   * [GetParameter description]
   * @param {string|number} key [description]
   * @see [GetParameter]{@link https://support.apple.com/en-gb/guide/logicpro/lgce71e8f5c8/10.5/mac/10.14.6}
   */
  GetParameter (key) {}

  /**
   * [UpdatePluginParameters description]
   * @return {void}
   * @see [Dynamically hide or show MIDI plug-in controls]{@link https://support.apple.com/en-gb/guide/logicpro/lgce9f7063b5/10.5/mac/10.14.6}
   */
  UpdatePluginParameters () {}

  /**
   * [SendMIDIEventNow description]
   * @param {Event} event [description]
   * @return {void}
   * @see {@link Event#send}
   */
  SendMIDIEventNow (event) {}

  /**
   * [SendMIDIEventAtBeat description]
   * @param {Event} event   [description]
   * @param {number} beatPos [description]
   * @return {void}
   * @see {@link Event#sendAtBeat}
   */
  SendMIDIEventAtBeat (event, beatPos) {}

  /**
   * [SendMIDIEventAfterBeats description]
   * @param {Event} even      [description]
   * @param {number} beatDelay [description]
   * @return {void}
   * @see {@link Event#sendAfterBeats}
   */
  SendMIDIEventAfterBeats (even, beatDelay) {}

  /**
   * [SendMIDIEventAfterMilliseconds description]
   * @param {Event} event  [description]
   * @param {number} millis [description]
   * @return {void}
   * @see {@link Event#sendAfterMilliseconds}
   */
  SendMIDIEventAfterMilliseconds (event, millis) {}

  /**
   * [Trace description]
   * @param {*} val [description]
   * @return {void}
   * @see [Trace]{@link https://support.apple.com/en-gb/guide/logicpro/lgce4135e1fa/10.5/mac/10.14.6}
   */
  Trace (val) {}
}

export { Scripter }
