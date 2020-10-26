# @objectkit/scriptex.mock
> A mocking library for testing [Scriptex MIDI plugins](https://github.com/objectkit/scriptex).

## Purpose
A bare bones set of interfaces and actors to mock the Scripter MIDI-FX Plugin environment.

### Interfaces
- [Scripter](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/Scripter.js)
- [TimingInfo](#)
- [MIDI](#)
- [Event](#)
- [ChannelPressure](#)
- [ControlChange](#)
- [Note](#)
- [NoteOn](#)
- [NoteOff](#)
- [PitchBend](#)
- [PolyPressure](#)
- [ProgramChange](#)
- [TargetEvent](#)

### Actors
#### VirtualScripter
A bare bones Scripter emulation.
#### VirtualScripterEnvironment
A bare bones virtual Scripter environment
#### DeployPluginHarness
A convenience tool for capturing api, plugin and system references arising through deployment.

## Example
Given a new scriptex project with a bespoke plugin source file
```js
import { DefaultPlugin } from "@objectkit/scriptex"

class Microtune extends DefaultPlugin {

  get params () {
    return [
      {
        ID: `microtune`
      , name: ` `
      , minValue: -8192
      , maxValue: 8191
      , numberOfSteps: 16383
      , defaultValue: 0
      }
    ]
  }

  set microtune (val) {
    this.applyPitchBend(val)
  }

  applyPitchBend (val) {
    const bend= new PitchBend()
    bend.value= val
    bend.send()
  }
}

export { Microtune }
```
Then test it in an emulated global Scripter environment
```js
import { PitchBend, VirtualScripterEnvironment } from "@objectkit/scriptex.mock"
import { Microtune } from "path/to/Microtune"

describe(`Microtune Integration`, () => {

  const virtual= new VirtualScripterEnvironment(global)
  const sandbox= sinon.createSandbox()

  beforeEach(() => {
    virtual.install()
  })

  afterEach(() => {
    virtual.restore()
    sandbox.restore()
  })

  describe(`Given MicrotunePlugin is integrated with Scripter`, () => {
    describe(`When SetParameter sets the value of #microtune`, () => {
      describe(`Then #microtune sets the value of PitchBend#value`, () => {
        specify(`And the PitchBend is immediately sent.`, () => {

          MicrotunePlugin.CONFIGURABLE= true

          const { plugin, system } = virtual.deployPlugin(MicrotunePlugin)
          const { SendMIDIEventNow, ParameterChanged, Trace }= sandbox.spy(system)          
          const [ { minValue, maxValue, defaultValue } ]= plugin.params
          const { applyPitchBend, onParam }= sandbox.spy(plugin)
          const { send } = sandbox.spy(Event.prototype )

          UpdatePluginParameters()

          const runScenario = (val) => {

            SetParameter(0, val)

            {
              assert.callOrder(
                ParameterChanged
                , onParam
                  , applyPitchBend
                    , send
                      , SendMIDIEventNow
              )

              const { lastCall: { firstArg } }= SendMIDIEventNow
              assert.instanceOf(firstArg, PitchBend)
              assert.strictEqual(firstArg.value, val)
              assert.strictEqual(GetParameter(0), val)
            }
          }

          runScenario(minValue)
          runScenario(maxValue)
          runScenario(defaultValue)
        })
      })
    })
  })
})
```

Checkout the [Microtune](#) scriptex demonstrator project for a concreate example of the above, or checkout the [Scriptex project template](#) to apply similar use cases to your own plugin development workflow.
