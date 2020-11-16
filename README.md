# @objectkit/scriptex.mock
> A collection of test interfaces and helpers to mock the Scripter MIDI-FX Plugin environment.

## Installation
```bash
npm i @objectkit/scriptex.mock
```

## API

#### Global interface
- [Scripter](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/Scripter.js)

#### Data interfaces
- [TimingInfo](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/TimingInfo.js)
- [MIDI](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/MIDI.js)

#### Event interfaces
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

### Environmental Helpers
#### [VirtualScripter](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/support/VirtualScripter.js)
A bare bones Scripter emulation.
#### [DeployPluginHarness](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/plugin/support/DeployPluginHarness.js)
A convenience tool for capturing api, plugin and system references arising through deployment.
#### [VirtualScripterEnvironment](https://github.com/objectkit/scriptex.mock/blob/main/src/main/js/com/objectkit/scriptex/mock/system/support/VirtualScripterEnvironment.js)
A virtual Scripter environment assembled by VirtualScripter and DeployPluginHarness configurations.

### Use cases
Inspect the [Microtuner plugin demonstrator](https://github.com/objectkit/scriptex.plugin.microtuner/blob/main/src/test/js/com/objectkit/scriptex/plugin/microtuner/MicrotunerIntegrationSpec.js) for concrete applications or clone the [plugin project template](https://github.com/objectkit/scriptex.plugin.template) to use it in a development context.

## Example
The [#system](https://github.com/objectkit/scriptex/blob/master/src/main/js/com/objectkit/scriptex/plugin/Plugin.js#L86) property of scriptex plugin instances gives uniform instance level access to the global scope, but that is not useful to all test and deployment scenarios. There are times when access to a simulated gloabl Scripter scope in the test environment will be of better help, and VirtualScripterEnvironment provides the means for that to happen.
```js
import { PitchBend, VirtualScripterEnvironment } from "@objectkit/scriptex.mock"
import { Microtuner } from "scriptex.plugin.microtuner"

describe(`Microtuner Integration`, () => {

  /* link the virtual environemnet to the global scope */
  const virtual= new VirtualScripterEnvironment(global)
  const sandbox= sinon.createSandbox()

  beforeEach(() => {
    /* pre-test: decorate the virtual target, i.e. global scope in this test */
    virtual.applyEnvironment()  
  })

  afterEach(() => {
    /* post-test: undecorate and restore the global scope */
    virtual.unapplyEnvironment()
    sandbox.restore()
  })

  describe(`Given Microtuner has been deployed to Scripter`, () => {
    describe(`When SetParameter is invoked`, () => {
      specify(`Then a new PitchBend is sent.`, () => {

        /* make system properties modifiable for tests */
        Microtuner.CONFIGURABLE= true

        /* export Scripter methods and properties to the global scope */
        const { plugin, system } = virtual.deployPlugin(Microtuner)
        const { SendMIDIEventNow, ParameterChanged, Trace }= sandbox.spy(system)          
        const [ { minValue, maxValue, defaultValue } ]= plugin.parameters
        const { applyPitchBend, onParameter }= sandbox.spy(plugin)
        const { send } = sandbox.spy(Event.prototype )

        /* emulated `Run Script` to setup the parameter view */
        UpdatePluginParameters()

        const runScenario = (val) => {

          SetParameter(0, val)

          {
            assert.callOrder(
              ParameterChanged
              , onParameter
                , applyPitchBend
                  , send
                    , SendMIDIEventNow
            )

            const { lastCall: { firstArg:pitchBend } }= SendMIDIEventNow
            assert.instanceOf(pitchBend, PitchBend)
            assert.strictEqual(pitchBend.value, val)
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
```
## Donate
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/paypalme/objectkit)
