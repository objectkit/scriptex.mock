# @objectkit/scriptex.mock
> A mocking library for testing [Scriptex MIDI plugins](https://github.com/objectkit/scriptex).

## Purpose
A bare bones set of interfaces and actors to mock the Scripter MIDI-FX Plugin environment.

### Interfaces
- [Scripter](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/Scripter.js)
- [TimingInfo](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/TimingInfo.js)
- [MIDI](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/MIDI.js)
- [Event](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/Event.js)
- [ChannelPressure](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/ChannelPressure.js)
- [ControlChange](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/ControlChange.js)
- [Note](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/Note.js)
- [NoteOn](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/NoteOn.js)
- [NoteOff](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/NoteOff.js)
- [PitchBend](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/PitchBend.js)
- [PolyPressure](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/PolyPressure.js)
- [ProgramChange](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/ProgramChange.js)
- [TargetEvent](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/event/TargetEvent.js)

### Actors
#### [VirtualScripter](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/support/VirtualScripter.js)
A bare bones Scripter emulation.
#### [VirtualScripterEnvironment](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/support/VirtualScripterEnvironment.js)
A bare bones virtual Scripter environment
#### [DeployPluginHarness](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/plugin/support/DeployPluginHarness.js)
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

Checkout the [Microtune](https://github.com/objectkit/scriptex.plugin.microtune) project for a conrete example of the above, or checkout a copy of the [Scriptex plugin project template](https://github.com/objectkit/scriptex.plugin.template) to apply similar use cases to your own plugin development workflow.
