import chai from "chai"
import sinon from "sinon"
import { DefaultPlugin } from "@objectkit/scriptex"
import {
  ChannelPressure
, ControlChange
, Event
, Note
, NoteOn
, NoteOff
, PitchBend
, PolyPressure
, ProgramChange
, TargetEvent
, MIDI
, VirtualScripterEnvironment
, VirtualScripter
, DeployPluginHarness
} from "@objectkit/scriptex.mock"

describe(`VirtualScripterEnvironment`, () => {

  const { assert }= chai
  const sandbox= sinon.createSandbox()

  afterEach(() =>
    sandbox.restore()
  )

  describe(`new VirtualScripterEnvironment(target:Object)`, () => {
    context(`Given a non-object is passed to the "target" parameter`, () => {
      specify(`Then "TargetMustBeExtensible" is thrown`, () => {
        assert.throws(() => { new VirtualScripterEnvironment(undefined) }, `TargetMustBeExtensible` )
      })
    })
  })

  describe(`#target`, () => {

    context(`When #target is set to a non extensible object`, () => {
      context(`Then a "TargetMustBeExtensible" error is thrown`, () => {
        const target= new Object()

        assert.isExtensible(target)
        assert.doesNotThrow(() => new VirtualScripterEnvironment(target))

        Object.preventExtensions(target)
        assert.isNotExtensible(target)
        assert.throws(() => new VirtualScripterEnvironment(target), "TargetMustBeExtensible")
      })
    })

    context(`Given #target is set and #applied is true`, () => {
      context(`When #target is set again`, () => {
        specify(`Then a "TargetAlreadyApplied" error is thrown`, () => {

          const newTarget= () => Object.create(null)
          const virtual= new VirtualScripterEnvironment(newTarget())
          const runScenario= () => virtual.target= newTarget()

          assert.isFalse(virtual.applied)

          assert.doesNotThrow( runScenario )

          {
            virtual.applyEnvironment()
          }

          assert.isTrue(virtual.applied)
          assert.throws( runScenario, `TargetAlreadyApplied`)

          {
            virtual.unapplyEnvironment()
          }

          assert.isFalse(virtual.applied)
          assert.doesNotThrow( runScenario )

          {
            virtual.applyEnvironment()
          }

          assert.isTrue(virtual.applied)
          assert.throws( runScenario, `TargetAlreadyApplied`)
        })
      })
    })
  })

  describe(`#applyEnvironment():void throws Error`, () => {
    context(`Given #applyEnvironment is invoked `, () => {
      context(`When #target is defined`, () => {
        describe(`Then #target is decorated with an emulated Scripter API`, () => {

          /* events */

          specify(`#ChannelPressure`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.ChannelPressure, ChannelPressure)
          })
          specify(`#ControlChange`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.ControlChange, ControlChange)
          })
          specify(`#Event`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.Event, Event)
          })
          specify(`#NoteOff`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.NoteOff, NoteOff)
          })
          specify(`#NoteOn`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.NoteOn, NoteOn)
          })
          specify(`#Note`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.Note, Note)
          })
          specify(`#PitchBend`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.PitchBend, PitchBend)
          })
          specify(`#PolyPressure`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.PolyPressure, PolyPressure)
          })
          specify(`#ProgramChange`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.ProgramChange, ProgramChange)
          })
          specify(`#TargetEvent`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.strictEqual(obj.TargetEvent, TargetEvent)
          })

          /* objects */

          specify(`#MIDI`, () => {
            const obj= Object.create(null)
            {
              new VirtualScripterEnvironment(obj).applyEnvironment()
            }
            assert.instanceOf(obj.MIDI, MIDI)
          })

          /* methods */

          specify(`#UpdatePluginParameters`, () => {
            const uppSpy= sandbox.spy(VirtualScripter.prototype, `UpdatePluginParameters`)
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            obj.UpdatePluginParameters()
            sandbox.assert.calledOnce(uppSpy)
            obj.UpdatePluginParameters()
            sandbox.assert.calledTwice(uppSpy)
            obj.UpdatePluginParameters()
            sandbox.assert.calledThrice(uppSpy)
          })
          specify(`#SetParameter`, () => {
            const setSpy= sandbox.spy(VirtualScripter.prototype, `SetParameter`)
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            obj.SetParameter(0, 0)
            sandbox.assert.calledOnce(setSpy)
            obj.SetParameter(0, 0)
            sandbox.assert.calledTwice(setSpy)
            obj.SetParameter(0, 0)
            sandbox.assert.calledThrice(setSpy)
          })
          specify(`#GetParameter`, () => {
            const getSpy= sandbox.spy(VirtualScripter.prototype, `GetParameter`)
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            obj.GetParameter(0, 0)
            sandbox.assert.calledOnce(getSpy)
            obj.GetParameter(0, 0)
            sandbox.assert.calledTwice(getSpy)
            obj.GetParameter(0, 0)
            sandbox.assert.calledThrice(getSpy)
          })
          specify(`#Trace`, () => {
            const traceSpy= sandbox.spy(VirtualScripter.prototype, `Trace`)
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            obj.Trace(0)
            sandbox.assert.calledOnce(traceSpy)
            obj.Trace(0)
            sandbox.assert.calledTwice(traceSpy)
            obj.Trace(0)
            sandbox.assert.calledThrice(traceSpy)
          })
          specify(`#SendMIDIEventNow`, () => {
            const evt= new Event()
            const spy= sandbox.spy(VirtualScripter.prototype, `SendMIDIEventNow`)
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            obj.SendMIDIEventNow(evt)
            sandbox.assert.calledOnce(spy)
            obj.SendMIDIEventNow(evt)
            sandbox.assert.calledTwice(spy)
            obj.SendMIDIEventNow(evt)
            sandbox.assert.calledThrice(spy)
          })
          specify(`#SendMIDIEventAtBeat`, () => {
            const evt= new Event()
            const spy= sandbox.spy(VirtualScripter.prototype, `SendMIDIEventAtBeat`)
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            obj.SendMIDIEventAtBeat(evt, 0)
            sandbox.assert.calledOnce(spy)
            obj.SendMIDIEventAtBeat(evt, 0)
            sandbox.assert.calledTwice(spy)
            obj.SendMIDIEventAtBeat(evt, 0)
            sandbox.assert.calledThrice(spy)
          })
          specify(`#SendMIDIEventAfterBeats`, () => {
            const evt= new Event()
            const spy= sandbox.spy(VirtualScripter.prototype, `SendMIDIEventAfterBeats`)
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            obj.SendMIDIEventAfterBeats(evt, 0)
            sandbox.assert.calledOnce(spy)
            obj.SendMIDIEventAfterBeats(evt, 0)
            sandbox.assert.calledTwice(spy)
            obj.SendMIDIEventAfterBeats(evt, 0)
            sandbox.assert.calledThrice(spy)
          })
          specify(`#SendMIDIEventAfterMilliseconds`, () => {
            const evt= new Event()
            const spy= sandbox.spy(VirtualScripter.prototype, `SendMIDIEventAfterMilliseconds`)
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            obj.SendMIDIEventAfterMilliseconds(evt, 0)
            sandbox.assert.calledOnce(spy)
            obj.SendMIDIEventAfterMilliseconds(evt, 0)
            sandbox.assert.calledTwice(spy)
            obj.SendMIDIEventAfterMilliseconds(evt, 0)
            sandbox.assert.calledThrice(spy)
          })

          /* interceptors */

          specify(`#PluginParameters`, () => {
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            const sys= env.system // virtualScripter instance

            assert.isUndefined(sys.PluginParameters)

            /* adding PluginParameters to obj adds the same to the virtualScripter */
            /* instance which in turn enables parameter emulation */
            obj.PluginParameters= [
              {
                name: "Checkbox"
              , type: "checkbox"
              , defaultValue: 1
              }
            ]
            assert.strictEqual(obj.PluginParameters, sys.PluginParameters)
          })
          specify(`#NeedsTimingInfo`, () => {
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            const sys= env.system

            assert.isUndefined(sys.NeedsTimingInfo)

            obj.NeedsTimingInfo= 1
            assert.strictEqual(sys.NeedsTimingInfo, 1)
            obj.NeedsTimingInfo= 2
            assert.strictEqual(sys.NeedsTimingInfo, 2)
            obj.NeedsTimingInfo= 3
            assert.strictEqual(sys.NeedsTimingInfo, 3)
          })
          specify(`#ResetParameterDefaults`, () => {
            const obj= Object.create(null)
            const env= new VirtualScripterEnvironment(obj)
            {
              env.applyEnvironment()
            }
            const sys= env.system

            assert.isUndefined(sys.ResetParameterDefaults)

            obj.ResetParameterDefaults=1
            assert.strictEqual(sys.ResetParameterDefaults, 1)
            obj.ResetParameterDefaults= 2
            assert.strictEqual(sys.ResetParameterDefaults, 2)
            obj.ResetParameterDefaults= 3
            assert.strictEqual(sys.ResetParameterDefaults, 3)
          })
        })
      })
      context(`When #PluginParameters is defined on #target`, () => {
        specify(`Then #GetParameter,#SetParameter,#UpdatePluginParameters can be emulated`, () => {
          const target= Object.create(null)
          const env= new VirtualScripterEnvironment(target)
          {
            env.applyEnvironment()
          }
          const sys= env.system

          const traceSpy= sandbox.spy(sys, `Trace`)

          target.PluginParameters= [
            {
              name: `Checkbox`
            , type: `checkbox`
            , defaultValue: 1
            }
          ]
          /* NOTE: this hides an error whereby Trace is not called at the outset as it should be */
          /* this must always be called before accessing Get|Set|Update to emulate startup */
          assert.isUndefined(sys.GetParameter(0))
          target.UpdatePluginParameters()
          sys.GetParameter(1) // causes trace
          sandbox.assert.calledOnce(traceSpy)
          assert.strictEqual(target.GetParameter(0), 1)
        })
      })
    })
  })

  describe(`#unapplyEnvironment():void`, () => {
    context(`Given #applyEnvironment has decorated the environment with Scripter`, () => {
      specify(`Then #unapplyEnvironment removes all decorated properties`, () => {
        const fixture= Object.create(null)
        const virtual= new VirtualScripterEnvironment(fixture)

        {
          virtual.applyEnvironment()
        }

        for (const key of VirtualScripterEnvironment.KEYS)
          assert.property(fixture, key)

        {
          virtual.unapplyEnvironment()
        }

        for (const key of VirtualScripterEnvironment.KEYS)
          assert.notProperty(fixture, key)
      })
    })
  })

  describe(`#deployPlugin(pluginClass, ctorArgs):Object`, () => {
    context(`When #deployPlugin is invoked`, () => {
      specify(`Then plugin.system is VirtualScripter`, () => {
        const obj= Object.create(null)
        const spy= sandbox.spy(DeployPluginHarness.prototype, `deployPlugin`)
        const env= new VirtualScripterEnvironment(obj)
        {
          env.applyEnvironment()
        }
        const { system }= env.deployPlugin(DefaultPlugin)
        sandbox.assert.calledOnce(spy)
        assert.strictEqual(system, env.system)
        for (const key of VirtualScripterEnvironment.KEYS) {
          assert.property(system, key)
          assert.property(obj, key)
        }
        {
          env.unapplyEnvironment()
        }
      })
    })
  })
})
