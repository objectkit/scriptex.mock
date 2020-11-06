import { Scripter } from "com/objectkit/scriptex/mock/system/Scripter"
import { MIDI } from "com/objectkit/scriptex/mock/system/MIDI"
import { TimingInfo } from "com/objectkit/scriptex/mock/system/TimingInfo"
import { ChannelPressure } from "com/objectkit/scriptex/mock/event/ChannelPressure"
import { ControlChange } from "com/objectkit/scriptex/mock/event/ControlChange"
import { Event } from "com/objectkit/scriptex/mock/event/Event"
import { Note } from "com/objectkit/scriptex/mock/event/Note"
import { NoteOn } from "com/objectkit/scriptex/mock/event/NoteOn"
import { NoteOff } from "com/objectkit/scriptex/mock/event/NoteOff"
import { PitchBend } from "com/objectkit/scriptex/mock/event/PitchBend"
import { PolyPressure } from "com/objectkit/scriptex/mock/event/PolyPressure"
import { ProgramChange } from "com/objectkit/scriptex/mock/event/ProgramChange"
import { TargetEvent } from "com/objectkit/scriptex/mock/event/TargetEvent"

/**
 * The key used to access the hidden parameter state Map
 * @private
 * @constant
 * @ignore
 * @type {Symbol}
 */
const viewModelKey= Symbol()

/**
 * A conveneince property injector
 * @private
 * @ignore
 * @param  {VirtualScripter} target [description]
 * @param  {Object obj    [description]
 * @return {boolean}        [description]
 */
const inject= (target, obj) =>
  Reflect.defineProperty(target, obj.name, {
    value: obj, configurable: true, enumerable: true
  }
)

/**
 * VirtualScripter is a psuedo emulation of the Scripter runtime.
 *
 * Its functionality is geared mostly towards parameter management, with minimal
 * support for GetTimingInfo.
 *
 * @extends Scripter
 * @classDesc
 */
class VirtualScripter extends Scripter {

  /**
   * A Scripter warning traced when GetParameter or SetParameter is passed a bad index or name
   * @type {string}
   */
  static get BAD_PARAM_KEY () {
    return /*Get|Set*/`Parameter() called with an argument that is neither a string (the parameter name) nor a number (the parameter index).`
  }

  /**
   * A Scripter warning traced when GetParameter or SetParameter is called
   *  - with no arguments
   *  - before PluginParameters is defined
   * @type {string}
   */
  static get BAD_PARAM_NAME () {
    return /*Get|Set*/`Parameter() called with an argument: (#) that does not equal any registered parameter name.`
  }

  /**
   * A Scripter warning traced when GetParameter is not called with exactly two arguments.
   * @type {string}
   */
  static get BAD_PARAM_ARGS () {
    return /*Get|Set*/`Parameter() called with too many arguments.`
  }

  /**
   * A Scripter warning traced with GetTimingInfo is invoked while NeedsTimingInfo !== true
   * @type {string}
   */
  static get BAD_TIMING_INFO () {
    return "hint: add 'var NeedsTimingInfo = true' to your script at the global scope."
  }

  /**
   * Get the ViewModel of a VirtualScripter instance.
   *
   * The ViewModel is a cache of parameters and an its known data state.
   * Keys are parameter names, values are numbers
   *
   * @example
   *  const virtual= new VirtualScripter()
   *  virtual.PluginParameters= [
   *    {
   *      name: `Checkbox`
   *    , type: `checkbox`
   *    , defaultValue: 1
   *    }
   *  ]
   *  const viewModel= VirtualScripter.getViewModel(virtual)
   *  virtual.UpdatePluginParameters() // emulate RunScript
   *  assert.strictEqual(virtual.GetParameter(0), viewModel.get(`Checkbox`))
   *
   * @param  {VirtualScripter} virtualScripter [description]
   * @return {Map<string,string>}                 [description]
   */
  static getViewModel (virtualScripter) {
    return virtualScripter[viewModelKey]
  }

  constructor () {
    super()
    this.MIDI= new MIDI()
    this[viewModelKey]= new Map()
    inject(this, ChannelPressure)
    inject(this, ControlChange)
    inject(this, Event)
    inject(this, Note)
    inject(this, NoteOn)
    inject(this, NoteOff)
    inject(this, PitchBend)
    inject(this, PolyPressure)
    inject(this, ProgramChange)
    inject(this, TargetEvent)

    /** @todo Event prototype adjustments to implement transient send... delegation */
    const virtual= this

    inject(Event.prototype, function send (){
      virtual.SendMIDIEventNow(this)
    })
    inject(Event.prototype, function sendAtBeat (val){
      virtual.SendMIDIEventAtBeat(this, val)
    })
    inject(Event.prototype, function sendAfterBeats (val) {
      virtual.SendMIDIEventAfterBeats(this, val)
    })
    inject(Event.prototype, function sendAfterMilliseconds (val) {
      virtual.SendMIDIEventAfterMilliseconds(this, val)
    })
  }

  /**
   * An emulation of the UpdatePluginParameters method.
   *
   * ```
   * Given UpdatePluginParameters is invoked
   *   When PluginParameters is not defined
   *     Then UpdatePluginParameters is a noop
   *   When PluginParameters is defined
   *     Then parameters are iterated
   *     When parameter is not in viewModel
   *      Then paramater is assigned defaultValue or 0 if unknown
   *     When ParameterChanged is a Function
   *      Then ParameterChanged is invoked with the parameter index and value
   * ```
   * @return {void}
   */
  UpdatePluginParameters () {
    const { PluginParameters: ui, ParameterChanged= new Function}= this
    const viewModel = this[viewModelKey]

    if (ui) {
      for (const [index, p] of ui.entries() ) {
        let value;
        const { name, type, defaultValue=0 }= p
        if (/momentary|text/.test(type))
          continue

        if (viewModel.has( name )) {
          value= viewModel.get( name )
        }
        else {
          viewModel.set( name, ( value= defaultValue ) )
        }
        /* @todo direct attention to SetParameter rather than */
        /* ParameterChanged in order to preserve linearity of flow */
        ParameterChanged( index, value )
      }
    }
  }

  /**
   * An emulation of the Scripter.GetParameter method including
   * tracing behaviour,
   * @param {number|string} key A parameter name or parameter index
   */
  GetParameter (key) {
    let warning, parameter;
    const {
      BAD_PARAM_KEY
    , BAD_PARAM_NAME
    }= VirtualScripter

    const { PluginParameters=[] }= this

    if (Number.isFinite(key)) {
      warning= BAD_PARAM_KEY
      parameter = PluginParameters[key]
    }
    else {
      warning= BAD_PARAM_NAME
      parameter= PluginParameters.find( p => p.name === key )
    }

    /* exit on success */
    if (parameter) {
      const { name }= parameter
      return this[viewModelKey].get(name)
    }

    /* emulate Scripter behaviour with Trace */
    if (BAD_PARAM_NAME === warning) {
      warning= warning.replace(`#`, key)
    }

    this.Trace(`Get${warning}`);
    return
  }

  /**
   * An emulation of the Scripter SetParameter method including
   * tracing behaviour
   *
   * @param {name|string} key A parameter index of parameter name
   * @param {number} val The parameter value
   * @return { void }
   */
  SetParameter (key, val) {
    let warning, parameter;

    const {
      BAD_PARAM_ARGS
    , BAD_PARAM_KEY
    , BAD_PARAM_NAME
    }= VirtualScripter

    const {
      PluginParameters=[ ]
    , ParameterChanged
    }= this

    if (val === undefined) {
      /* follow the script */
      warning= BAD_PARAM_ARGS
    }
    else if (Number.isFinite(key)) {
      parameter = PluginParameters[key]
      warning= BAD_PARAM_KEY
    }
    else {
      parameter= PluginParameters.find( p => p.name === key )
      warning= BAD_PARAM_NAME
    }

    /* find failed */
    if (null == parameter) {
      if (BAD_PARAM_NAME === warning) {
        warning= warning.replace(`#`, key)
      }

      return this.Trace(`Set${warning}`)
    }

    /* update param data  */
    this[viewModelKey].set(parameter.name, val)

    if (ParameterChanged instanceof Function) {
      /* notify */
      const index = PluginParameters.indexOf(parameter)
      const value = this[viewModelKey].get(parameter.name)
      ParameterChanged(index, value)
    }
    return
  }

  /**
   * An emulation of the Scripter GetTimingInfo method, including
   * tracing behaviour.
   *
   * @example
   *  const virtual= new VirtualScripter()
   *  const traceSpy= sinon.spy(virtual, `Trace`)
   *  assert.isUndefined(virtual.GetTimingInfo())
   *  assert.calledWith(traceSpy, VirtualScripter.BAD_TIMING_INFO) // hint:...
   *  traceSpy.resetHistory()
   *  virtual.NeedsTimingInfo= true
   *  assert.instanceOf(virtual.GetTimingInfo(), TimingInfo)
   *  assert.notCalled(traceSpy)
   *
   * @return void
   */
  GetTimingInfo () {
    if (this.NeedsTimingInfo) {
      return new TimingInfo
    }
    else {
      this.Trace(VirtualScripter.BAD_TIMING_INFO)
    }
  }
}

export { VirtualScripter }
