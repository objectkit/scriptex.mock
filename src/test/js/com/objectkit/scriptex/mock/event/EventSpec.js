import chai from "chai"
import { Event } from "@objectkit/scriptex.mock"

describe(`Event`, () => {

  const { expect } = chai

  context("new Event()", () => {
    const event = new Event()

    specify("status= 0", () => {
      expect(event).property("status", Event.STATUS)
    })

    specify("channel= 1", () => {
      expect(event).property("channel", 1)
    })

    specify("port= 1", () => {
      expect(event).property("port", 1)
    })

    specify("isRealtime= 1", () => {
      expect(event).property("isRealtime", false)
    })

    specify("articulationID= 0", () => {
      expect(event).property("articulationID", 0)
    })

    specify("beatPos= 0", () => {
      expect(event).property("beatPos", 0)
    })

    specify("data1= 0", () => {
      expect(event).property("data1", 0)
    })

    specify("data2= 0", () => {
      expect(event).property("data2", 0)
    })

    specify("data3= 0", () => {
      expect(event).property("data3", 0)
    })
  })

  context(`send():void`, () => {
    specify(`is an interface method`, () => {
      expect(Event.prototype.send).instanceof(Function)
    })
  })

  context(`sendAtBeat(beatPos:number):void`, () => {
    specify(`is an interface method`, () => {
      expect(Event.prototype.sendAtBeat).instanceof(Function)
    })
  })

  context(`sendAfterBeats(beats:number):void`, () => {
    specify(`is an interface method`, () => {
      expect(Event.prototype.sendAfterBeats).instanceof(Function)
    })
  })

  context(`sendAfterMilliseconds():void`, () => {
    specify(`is an interface method`, () => {
      expect(Event.prototype.sendAfterMilliseconds).instanceof(Function)
    })
  })
})
