import { VirtualScripter } from "com/objectkit/scriptex/mock/system/support/VirtualScripter"
import { DeployPluginHarness } from "com/objectkit/scriptex/mock/plugin/support/DeployPluginHarness"

const { defineProperty, deleteProperty, get, set }= Reflect

/**
 * VirtualScripterEnvironment is a testing utility that provides the means
 * to approximately simulate a static Scripter environment
 * @classDesc
 */
class VirtualScripterEnvironment {

  /**
   * Get a list of all Scripter keys that this virtual environment will use
   * @return {Array<string>}
   * @see {@link VirtualScripterEnvironment.METHOD_KEYS}
   * @see {@link VirtualScripterEnvironment.OBJECT_KEYS}
   * @see {@link VirtualScripterEnvironment.EVENT_KEYS}
   */
  static get KEYS () {
    return [
    /* objects */
      ...this.OBJECT_KEYS
    /* events */
    , ...this.EVENT_KEYS
    /* methods */
    , ...this.METHOD_KEYS
    ]
  }

  /**
   * Get a list of all Scripter method keys
   * @return {Array<string>}
   */
  static get METHOD_KEYS () {
    return [
      `Trace`
    , `UpdatePluginParameters`
    , `GetParameter`
    , `SetParameter`
    , `GetTimingInfo`
    , `SendMIDIEventNow`
    , `SendMIDIEventAtBeat`
    , `SendMIDIEventAfterBeats`
    , `SendMIDIEventAfterMilliseconds`
    ]
  }

  /**
   * Get a list of all Scripter event keys
   * @return {Array<string>}
   */
  static get EVENT_KEYS () {
    return [
      `ChannelPressure`
    , `ControlChange`
    , `Event`
    , `Note`
    , `NoteOn`
    , `NoteOff`
    , `PitchBend`
    , `PolyPressure`
    , `ProgramChange`
    , `TargetEvent`
    ]
  }

  /**
   * Get a list of all Scripter object keys
   * @type {Array<string>}
   */
  static get OBJECT_KEYS () {
    return [
      `MIDI`
    ]
  }

  /**
   * Instantiate a new VirtualScripterEnvironment.
   *
   * @param {Object} target The ground of the environment.
   */
  constructor (target) {
    this._installed= false
    this._system= null
    this._target= target
  }

  /**
   * Determine if the virutal environment has been installed
   * @type {boolean}
   * @see {@link #install}
   */
  get installed () {
    return this._system != null
  }

  /**
   * Obtain a reference to the virtual environments host environment
   * @type {Object}
   */
  get target () {
    return this._target
  }

  /**
   * Obtain a reference to the internal VirtualScripter instance.
   *
   * Accessing this when not #installed throws a reference error as
   * the #system is not available.
   *
   * @type {VirtualScripter}
   * @throws "SystemUnavailable"
   * @see {@link #installed}
   */
  get system () {
    if (this.installed)
      return this._system
    throw new Error(`SystemUnavailable`)
  }

  /**
   * [install description]
   * @return {void}
   * @see {@link #restore}
   */
  install () {
    const { target } = this
    const sys= this._system= new VirtualScripter()
    const pod= (val) => ({ value: val, configurable: true, enumerable: true })
    const def= (key, desc) => defineProperty(target, key, desc)
    const evt= (event) => def(event.name, pod(event))
    const fun= (fn) => def(fn.name, pod(fn.bind(sys)))
    const spy= (key) => def(key, {
        configurable: true
      , enumerable: true
      , get: () => get(sys, key, sys)
      , set: val=> set(sys, key, val, sys)
      }
    )
    /* objects */
    def(`MIDI`, pod(sys.MIDI))
    /* events */
    evt(sys.ChannelPressure)
    evt(sys.ControlChange)
    evt(sys.Event)
    evt(sys.Note)
    evt(sys.NoteOn)
    evt(sys.NoteOff)
    evt(sys.PitchBend)
    evt(sys.PolyPressure)
    evt(sys.ProgramChange)
    evt(sys.TargetEvent)
    /* methods */
    fun(sys.UpdatePluginParameters)
    fun(sys.GetParameter)
    fun(sys.SetParameter)
    fun(sys.SetParameter)
    fun(sys.GetTimingInfo)
    fun(sys.Trace)
    fun(sys.SendMIDIEventNow)
    fun(sys.SendMIDIEventAtBeat)
    fun(sys.SendMIDIEventAfterBeats)
    fun(sys.SendMIDIEventAfterMilliseconds)
    /* interceptors */
    spy(`NeedsTimingInfo`)
    spy(`PluginParameters`)
    spy(`ResetParameterDefaults`)
    spy(`HandleMIDI`)
    spy(`ProcessMIDI`)
    spy(`ParameterChanged`)
    spy(`Idle`)
    spy(`Reset`)

    return
  }

  /**
   * Deploy a plugin to the internal VirtualScripter.
   *
   * @throws "SystemUnavailable"
   * @param  {Function} pluginClass A plugin class constructor
   * @param  {Array}  [ctorArgs=[]] Any arguments to pass to the plugin constructor
   * @return {Object}               Metadata from the deployment
   * @return {Object.plugin}        The plugin instance
   * @return {Object.system}        The system instance or global scope
   * @return {Object.api}           The deployments system integration keys
   * @see {@link DeployPluginHarness}
   * @see {@link #system}
   */
  deployPlugin (pluginClass, ctorArgs=[]) {
    return new DeployPluginHarness()
      .deployPlugin(pluginClass, this.system, ctorArgs)
  }

  /**
   * [restore description]
   * @return {void}
   * @see {@link #install}
   */
  restore () {
    if (!this.installed)
      return

    const { target }= this
    const del= (key) => {
      if (false === deleteProperty(target, key))
        throw new Error(`UninstallKeyFault: ${key}`)
    }

    del(`MIDI`)
    del(`ChannelPressure`)
    del(`ControlChange`)
    del(`Event`)
    del(`NoteOff`)
    del(`NoteOn`)
    del(`Note`)
    del(`PitchBend`)
    del(`PolyPressure`)
    del(`ProgramChange`)
    del(`TargetEvent`)
    del(`UpdatePluginParameters`)
    del(`GetParameter`)
    del(`SetParameter`)
    del(`SetParameter`)
    del(`GetTimingInfo`)
    del(`Trace`)
    del(`SendMIDIEventNow`)
    del(`SendMIDIEventAtBeat`)
    del(`SendMIDIEventAfterBeats`)
    del(`SendMIDIEventAfterMilliseconds`)
    /** @todo confirm that deleteProperty will delete the spy get/set impl */
    /** @todo confirm that this class has remit to delete hooks */
    del(`NeedsTimingInfo`)
    del(`PluginParaemters`)
    del(`ResetParameterDefaults`)
    del(`HandleMIDI`)
    del(`ProcessMIDI`)
    del(`ParameterChanged`)
    del(`Idle`)
    del(`Reset`)

    /* demarcate the condition that determines the truth of #installed */
    this._system= null
    return
  }
}

export { VirtualScripterEnvironment }
