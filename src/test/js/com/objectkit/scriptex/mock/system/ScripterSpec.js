import chai from "chai"
import { Scripter } from "@objectkit/scriptex.mock"


describe(`Scripter`, function () {

  const { expect }= chai

  context(`GetTimingInfo():void`, () => {
    specify(`Is an interface method`, () => {
      expect(Scripter.prototype.GetTimingInfo).instanceof(Function)
    })
  })
  context(`UpdatePluginParameters():void`, () => {
    specify(`Is an interface method`, () => {
      expect(Scripter.prototype.UpdatePluginParameters).instanceof(Function)
    })
  })
  context(`GetParameter(key:(string|number)):?number`, () => {
    specify(`Is an interface method`, () => {
      expect(Scripter.prototype.GetParameter).instanceof(Function)
    })
  })
  context(`SetParameter(key:(string|number),val:number):void`, () => {
    specify(`Is an interface method`, () => {
      expect(Scripter.prototype.SetParameter).instanceof(Function)
    })
  })
  context(`SendMIDIEventNow(event:Event):void`, () => {
    specify(`Is an interface method`, () => {
      expect(Scripter.prototype.SendMIDIEventNow).instanceof(Function)
    })
  })
  context(`SendMIDIEventAtBeat(event:Event, beatPos:number):void`, () => {
    specify(`Is an interface method`, () => {
      expect(Scripter.prototype.SendMIDIEventAtBeat).instanceof(Function)
    })
  })
  context(`SendMIDIEventAfterBeats(event:Event, beats:number):void`, () => {
    specify(`Is an interface method`, () => {
      expect(Scripter.prototype.SendMIDIEventAfterBeats).instanceof(Function)
    })
  })
  context(`SendMIDIEventAfterMilliseconds(event:Event, milliseconds:number):void`, () => {
    specify(`Is an interface method`, () => {
      expect(Scripter.prototype.SendMIDIEventAfterMilliseconds).instanceof(Function)
    })
  })
})
