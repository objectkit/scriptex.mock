import chai from "chai"
import sinon from "sinon"
import { v4 as uuidv4 } from "uuid"
import {
  Scripter
, VirtualScripter
, TimingInfo
, MIDI
, ChannelPressure
, ControlChange
, Event
, NoteOff
, NoteOn
, PitchBend
, PolyPressure
, ProgramChange
, TargetEvent
} from "@objectkit/scriptex.mock"

describe(`VirtualScripter`, function () {

  const sandbox= sinon.createSandbox()
  const { expect, assert }= chai

  const PARAMETERS = [
    {
      name: "Momentary"
    , type: "momentary"
    }
  , {
      name: "Text"
    , type: `text`
    }
  , {
      name: "Lin"
    , type: "lin"
    , minValue: 0
    , maxValue: 127
    , numberOfSteps: 128
    , defaultValue: 100
    }
  , {
      name: "Log"
    , type: "log"
    , minValue: 1
    , maxValue: 100
    , numberOfSteps: 99
    , defaultValue: 75
    }
  , {
      name: "Menu"
    , type: "menu"
    , defaultValue: 0
    , valueStrings: [
        "A", "B", "C"
      ]
    }
  ]

  context(`VirtualScripter`, () => {
    specify(`extends Scripter`, () => {
      assert.instanceOf(new VirtualScripter(), Scripter)
    })
  })

  specify("#ChannelPressure is a reference to the mock ChannelPressure class", () =>{
    expect(new VirtualScripter().ChannelPressure).eql(ChannelPressure)
  })

  specify("#ControlChange is a reference to the mock ControlChange class", () =>{
    expect(new VirtualScripter().ControlChange).eql(ControlChange)
  })

  specify("#Event is a reference to the mock Event class", () =>{
    expect(new VirtualScripter().Event).eql(Event)
  })

  specify("#NoteOff is a reference to the mock NoteOff class", () =>{
    expect(new VirtualScripter().NoteOff).eql(NoteOff)
  })

  specify("#NoteOn is a reference to the mock NoteOn class", () =>{
    expect(new VirtualScripter().NoteOn).eql(NoteOn)
  })

  specify("#PitchBend is a reference to the mock PitchBend class", () =>{
    expect(new VirtualScripter().PitchBend).eql(PitchBend)
  })

  specify("#PolyPressure is a reference to the mock PolyPressure class", () =>{
    expect(new VirtualScripter().PolyPressure).eql(PolyPressure)
  })

  specify("#ProgramChange is a reference to the mock ProgramChange class", () =>{
    expect(new VirtualScripter().ProgramChange).eql(ProgramChange)
  })

  specify("#TargetEvent is a reference to the mock TargetEvent class", () =>{
    expect(new VirtualScripter().TargetEvent).eql(TargetEvent)
  })

  describe(`#MIDI:MIDI`, () => {
    context(`When the MIDI property is accessed`, function () {
      specify(`Then a static MIDI instance is returned`, function () {
        expect(new VirtualScripter()).property(`MIDI`).instanceof(MIDI)
      })
    })
  })

  // @todo emulate:
  // > TypeError: Cannot read property 'name' of undefined
  // thrown when param name is bad
  describe(`#SetParameter(key:(string|number), val:number):void`, () => {
    context(`Given #PluginParameters is undefined`, () => {
      specify(`Then #SetParameter operates as a no-op`, () => {
        const fixture= new VirtualScripter()
        const dataMap= VirtualScripter.getViewModel(fixture)
        expect(dataMap).property(`size`, 0)
        fixture.SetParameter(0, 0)
        expect(dataMap).to.be.empty
      })
    })
    context(`Given #PluginParameters is defined`, () => {
      describe(`When key is a parameter index`, () => {
        specify(`Then the parameter state is saved`, () => {
          const fixture= new VirtualScripter()
          fixture.PluginParameters= Array.from(PARAMETERS)
          const { name } = fixture.PluginParameters[2]
          const dataMap= VirtualScripter.getViewModel(fixture)

          expect(dataMap).property(`size`, 0)

          fixture.SetParameter(2, 1)

          expect(dataMap).property(`size`, 1)
          expect(dataMap.get(name)).eql(1)
          fixture.SetParameter(2, 2)
          expect(dataMap.get(name)).eql(2)
          fixture.SetParameter(2, 3)
          expect(dataMap.get(name)).eql(3)
        })
      })
      describe(`When key is a parameter name`, () => {
        specify(`Then the parameter data is internally stored`, () => {
          const fixture= new VirtualScripter()
          fixture.PluginParameters= Array.from(PARAMETERS)
          const { name } = fixture.PluginParameters[2]
          const dataMap= VirtualScripter.getViewModel(fixture)

          expect(dataMap).property(`size`, 0)

          fixture.SetParameter(name, 1)

          expect(dataMap).property(`size`, 1)
          expect(dataMap.get(name)).eql(1)
          fixture.SetParameter(name, 2)
          expect(dataMap.get(name)).eql(2)
          fixture.SetParameter(name, 3)
          expect(dataMap.get(name)).eql(3)
        })
      })
    })
    context(`Given #PluginParameters and #ParameterChanged are defined`, () => {
      describe(`When key is an index of a parameter`, () => {
        specify(`Then #ParameterChanged is invoked with index and val`, () => {
          const fixture= new VirtualScripter()
          fixture.ParameterChanged= sandbox.stub()
          fixture.PluginParameters= Array.from(PARAMETERS)
          sinon.assert.notCalled(fixture.ParameterChanged)
          fixture.SetParameter(2, 1)
          sinon.assert.calledWith(fixture.ParameterChanged, 2, 1)
          fixture.SetParameter(2, 2)
          sinon.assert.calledWith(fixture.ParameterChanged, 2, 2)
          fixture.SetParameter(2, 3)
          sinon.assert.calledWith(fixture.ParameterChanged, 2, 3)

        })
      })
      describe(`When key is the name of a parameter`, () => {
        specify(`Then #ParameterChanged is invoked with index and val`, () => {
          const fixture= new VirtualScripter()
          fixture.ParameterChanged= sandbox.stub()
          fixture.PluginParameters= Array.from(PARAMETERS)
          const { name } = fixture.PluginParameters[2]
          expect(name).eql("Lin")
          sinon.assert.notCalled(fixture.ParameterChanged)
          fixture.SetParameter(name, 1)
          sinon.assert.calledWith(fixture.ParameterChanged, 2, 1)
          fixture.SetParameter(name, 2)
          sinon.assert.calledWith(fixture.ParameterChanged, 2, 2)
          fixture.SetParameter(name, 3)
          sinon.assert.calledWith(fixture.ParameterChanged, 2, 3)
        })
      })
      describe(`When key is not a valid index`, () => {
        specify(`Then Trace("SetParameter()... neither a string... nor a number")`, () => {
          const { assert } = sandbox
          const fixture= sandbox.spy(new VirtualScripter())
          const { Trace } = fixture
          assert.notCalled(Trace)
          fixture.SetParameter(0, 0)
          assert.calledOnce(Trace)
          const warning= Trace.lastCall.firstArg
          expect(warning).includes(`SetParameter()`)
          expect(warning).includes("neither a string")
          expect(warning).includes("nor a number")
        })
      })
      describe(`When key is not a valid name`, () => {
        specify(`Then Trace("SetParameter()...not ...registered parameter name")`, () => {
          const mockKey= `${uuidv4()}`
          const fixture= sandbox.spy(new VirtualScripter())
          const { Trace }= fixture
          fixture.SetParameter(mockKey, 0)
          sandbox.assert.calledOnce(Trace)
          const warning= Trace.lastCall.firstArg
          expect(warning).includes(`SetParameter()`)
          expect(warning).includes(`(${mockKey})`)
          expect(warning).includes(`not`)
          expect(warning).includes(`registered parameter name`)
        })
      })
    })
  })

  describe(`#GetParameter(key:(string|number)):?number`, () => {
    context(`Given #PluginParameters is not defined`, () => {
      specify(`Then #GetParameter operates as a no-op`, () => {
        const fixture= new VirtualScripter()
        const dataMap= VirtualScripter.getViewModel(fixture)
        expect(fixture.PluginParameters).is.undefined
        expect(dataMap).to.be.empty
        fixture.SetParameter(0, 0)
        expect(dataMap).to.be.empty
        fixture.SetParameter(1, 1)
        expect(dataMap).to.be.empty
        fixture.SetParameter(2, 2)
        expect(dataMap).to.be.empty
      })
      specify(`And BAD_PARAM_KEY is traced to console`, () => {
        const fixture= new VirtualScripter()
        const traceSpy= sandbox.spy(fixture, `Trace`)
        assert.notProperty(fixture, `PluginParameters`)
        fixture.GetParameter(0)
        sandbox.assert.calledWith(traceSpy, `Get${VirtualScripter.BAD_PARAM_KEY}`)
      })
    })
    context(`Given #PluginParameters is an Array`, () => {
      describe(`When key is the index of a parameter`, () => {
        specify(`Then the data value of that parameter is returned`, () => {
          const fixture= new VirtualScripter()
          const dataMap= VirtualScripter.getViewModel(fixture)
          fixture.PluginParameters= Array.from(PARAMETERS)
          expect(dataMap).is.empty
          /* UpdatePluginParameters has not yet been called */
          expect(fixture.GetParameter(4)).to.be.undefined
          /* begin */
          fixture.SetParameter(4, 1)
          expect(fixture.GetParameter(4)).to.equal(1)
          fixture.SetParameter(4, 2)
          expect(fixture.GetParameter(4)).to.equal(2)
          fixture.SetParameter(4, 3)
          expect(fixture.GetParameter(4)).to.equal(3)
        })
      })
    })
  })

  describe(`#GetTimingInfo():TimingInfo`, function () {
    context(`When NeedsTimingInfo === true`, function () {
      specify("Then a new TimingInfo instance is returned", function () {
        const scripter = new VirtualScripter()
        scripter.NeedsTimingInfo = true
        expect(scripter.GetTimingInfo()).to.be.instanceof(TimingInfo)
      })
    })
    context(`When #NeedsTimingInfo !== true`, function () {
      specify("Then Trace(\"hint: add `var NeedsTimingInfo... at the global scope.\")", function () {
        const scripter= new VirtualScripter()
        const traceSpy= sandbox.spy(scripter, `Trace`)
        const returned= scripter.GetTimingInfo()
        expect(returned).to.be.undefined
        sandbox.assert.calledOnce(traceSpy)
        const warning= traceSpy.lastCall.firstArg
        expect(warning).includes("hint: add 'var NeedsTimingInfo")
        expect(warning).includes("at the global scope.")
      })
      specify("And undefined is returned", function () {
        const scripter = new VirtualScripter()
        expect(scripter).not.property(`NeedsTimingInfo`)
        const returned = scripter.GetTimingInfo()
        expect(returned).to.be.undefined
      })
    })
  })

  describe(`#UpdatePluginParameters():void`, function () {
    context(`When #PluginParameters is an Array`, function () {
      specify(`Then each parameter is inspected for a defaultValue`, function () {
        const scripter= new VirtualScripter()
        const data= VirtualScripter.getViewModel(scripter)
        /*const stub=*/ scripter.PluginParameters= Array.from(PARAMETERS)
        const [,, lin, log, menu ] = scripter.PluginParameters
        expect(data).is.empty
        scripter.UpdatePluginParameters()
        expect(data.size).eql(3)
        expect(data.get(lin.name)).eql(lin.defaultValue)
        expect(data.get(log.name)).eql(log.defaultValue)
        expect(data.get(menu.name)).eql(menu.defaultValue)
      })
      context(`When #ParameterChanged is a Function`, function () {
        specify("Then #ParameterChanged is invoked for each non-static parameter", function () {
          const scripter= new VirtualScripter

          const stub= scripter.ParameterChanged= sinon.stub()
          scripter.PluginParameters= Array.from(PARAMETERS)

          scripter.UpdatePluginParameters()
          const calls= stub.getCalls()
          /* excluding text and momentary params... */
          expect(calls).lengthOf(3)
          const [ lin, log, menu ] = calls
          expect(lin.args).eql([2, 100])
          expect(log.args).eql([3, 75])
          expect(menu.args).eql([4, 0])
        })
      })
    })
  })

  describe(`#Event.prototype.send,...AtBeat,...AfterBeats,...AfterMilliseconds`, () => {
    context(`Given VirtualScripter injects method delegates on Event.prototype`, () => {
      context(`When Event#send is invoked`, () => {
        specify(`Then VirtualScripter#SendMIDIEventNow is invoked`, () => {
          const virtual= new VirtualScripter()
          const sendSpy= sandbox.spy(virtual, `SendMIDIEventNow`)
          const event= new virtual.ControlChange()
          event.send()
          const [ eventRef ]= sendSpy.lastCall.args
          assert.strictEqual(eventRef, event)
        })
      })
      context(`When Event#sendAtBeat is invoked`, () => {
        specify(`Then VirtualScripter#SendMIDIEventAtBeat is invoked`, () => {
          const virtual= new VirtualScripter()
          const sendSpy= sandbox.spy(virtual, `SendMIDIEventAtBeat`)
          const event= new virtual.ControlChange()
          event.sendAtBeat(1)
          const [ eventRef, beatRef ]= sendSpy.lastCall.args
          assert.strictEqual(eventRef, event)
          assert.strictEqual(beatRef, 1)
        })
      })
      context(`When Event#sendAfterBeats is invoked`, () => {
        specify(`Then VirtualScripter#SendMIDIEventAfterBeats is invoked`, () => {
          const virtual= new VirtualScripter()
          const sendSpy= sandbox.spy(virtual, `SendMIDIEventAfterBeats`)
          const event= new virtual.ControlChange()
          event.sendAfterBeats(2)
          const [ eventRef, beatRef ]= sendSpy.lastCall.args
          assert.strictEqual(eventRef, event)
          assert.strictEqual(beatRef, 2)
        })
      })
      context(`When Event#sendAfterMilliseconds is invoked`, () => {
        specify(`Then VirtualScripter#SendMIDIEventAfterMilliseconds is invoked`, () => {
          const virtual= new VirtualScripter()
          const sendSpy= sandbox.spy(virtual, `SendMIDIEventAfterMilliseconds`)
          const event= new virtual.ControlChange()
          event.sendAfterMilliseconds(2)
          const [ eventRef, beatRef ]= sendSpy.lastCall.args
          assert.strictEqual(eventRef, event)
          assert.strictEqual(beatRef, 2)
        })
      })
    })
  })
})
