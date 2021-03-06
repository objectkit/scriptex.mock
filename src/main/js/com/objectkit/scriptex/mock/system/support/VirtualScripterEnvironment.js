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
   * Instantiate a new VirtualScripterEnvironment and define its #target object.
   *
   * @param {Object} target The object that VirtualScripterEnvironment will apply Scripter API artefacts to
   * @see [#applyEnvironment]{@link VirtualScripterEnvironment#applyEnvironment}
   * @see [#unapplyEnvironment]{@link VirtualScripterEnvironment#unapplyEnvironment}
   * @see [#target]{@link VirtualScripterEnvironment#target}
   * @throws "BadTarget"
   */
  constructor (target) {
    this.target= target
  }

  /**
   * Determine if the virtual environment has been applied to its #target
   * @type {boolean}
   * @see [#applyEnvironment]{@link VirtualScripterEnvironment#applyEnvironment}
   * @see [#target]{@link VirtualScripterEnvironment#target}
   */
  get applied () {
    return ( null != this._system )
  }

  /**
   * A reference to the VirtualScriperEnvironments internal target object. This object is
   * decorated with artefacts of the Scripter API by #applyEnvironment, and conversely,
   * is undecorated of the same artefacts by #unapplyEnvironment.
   *
   * Best practice is to simply provide this object to the constructor,
   *
   * @type {Object}
   * @throws "TargetAlreadyApplied" the existing #target is in use
   * @throws "TargetMustBeExtensible" #target must be an instanceof of Object
   * @throws "TargetMissing" if #target is accessed before being set
   */
  set target (val) {
    if (this.applied)
      throw new Error(`TargetAlreadyApplied`)

    /* extensibility */
    if (!(Object.isExtensible(val)))
      throw new TypeError(`TargetMustBeExtensible: ${val}`)

    this._target= val
  }

  get target () {
    const target= this._target;
    if (null == target) {
      throw new ReferenceError(`TargetMissing`)
    }
    return target
  }

  /**
   * A reference to the internal VirtualScripter instance.
   *
   * Accessing this when not #applied throws a reference error as
   * the #system is not available.
   *
   * @type {VirtualScripter}
   * @throws "SystemUnavailable"
   * @see [#applied]{@link VirtualScripterEnvironment#applied}
   */
  get system () {
    if (this.applied)
      return this._system
    throw new Error(`SystemUnavailable`)
  }

  /**
   * Apply the environment by decorating #target with artefacts of the Scripter API.
   *
   * @return {void}
   * @see [#unapplyEnvironment]{@link VirtualScripterEnvironment#unapplyEnvironment}
   * @see [#target]{@link VirtualScripterEnvironment#target}
   */
  applyEnvironment () {
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
   * Unapply the VirtualScripterEnvironment by undecorating #target and reverting it to its
   * original state.
   *
   * @return {void}
   * @see [#applyEnvironment]{@link VirtualScripterEnvironment#applyEnvironment}
   * @see [#target]{@link VirtualScripterEnvironment#target}
   */
  unapplyEnvironment () {
    if (!this.applied)
      return

    const { target }= this
    /* @todo: guard against `TypeError: Reflect.defineProperty called on non-object` */
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

    /* demarcate the condition that determines the truth of #applied */
    this._system= null
    return
  }

  /**
   * Deploy a plugin to the internal VirtualScripter.
   *
   * @throws "SystemUnavailable"
   * @param  {Function} pluginClass A plugin class constructor
   * @param  {Array}  [ctorArgs=[]] Any arguments to pass to the plugin constructor
   * @return {Object}               Reference captures from the deployment
   * @return {Object.plugin}        The plugin instance
   * @return {Object.system}        The system instance or global scope
   * @return {Object.api}           The deployments system integration keys
   * @see {@link DeployPluginHarness}
   * @see [#system]{@link VirtualScripterEnvironment#system}
   */
  deployPlugin (pluginClass, ctorArgs=[]) {
    return new DeployPluginHarness()
      .deployPlugin(pluginClass, this.system, ctorArgs)
  }
}

export { VirtualScripterEnvironment }
