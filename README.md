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
implement a new plugin
```js
import { DefaultPlugin } from "@objectkit/scriptex"

const UNITS_PER_CENT= ( ( 16384 / 4 ) / 100 ) /* 40.96 */

class Microtuner extends DefaultPlugin {

  get parameters () {
    return [{
      ID: `microtuning`
      , name: ` m i c r o t u n e r `
      , type: `lin`
      , unit: `\u00A2`
      , minValue: -100
      , maxValue: 100
      , numberOfSteps: 200
      , defaultValue: 0
    }]
  }

  set microtuning (cents) {
    const units= ~~( cents * UNITS_PER_CENT )
    this.applyPitchBend(units)
    return
  }

  applyPitchBend (val) {
    const bend= new PitchBend()
    bend.value= val
    bend.send()
    return
  }
}

export { Microtuner }
```
Then run your tests it in an emulated Scripter staging environment:
```js
import { PitchBend, VirtualScripterEnvironment } from "@objectkit/scriptex.mock"
import { Microtune } from "scriptex.plugin.microtuner"

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
    describe(`When SetParameter sets the value of #microtuning`, () => {
      describe(`Then #microtuning sets the value of PitchBend#value`, () => {
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
## Resources
- Review the [Microtuner plugin project](https://github.com/objectkit/scriptex.plugin.microtuner) for a concrete example of the above.
- Clone the [Scriptex plugin project template](https://github.com/objectkit/scriptex.plugin.template) to develop and test your own plugins with the same workflow.

## Donation
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/paypalme/objectkit)
