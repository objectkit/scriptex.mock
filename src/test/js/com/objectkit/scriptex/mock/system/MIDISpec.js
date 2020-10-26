import chai from "chai"
import { MIDI } from "@objectkit/scriptex.mock"

describe(`MIDI`, () => {

  const { expect } = chai

  describe(`new MIDI()`, () => {
    const midi= new MIDI()
    context(`noteNumber(noteName:string):number`, () => {
      specify("Is an interface method", () => {
        expect(midi).property("noteNumber").instanceof(Function)
      })
    })
    context(`noteName(noteNumber:number):string`, () => {
      specify("Is an interface method", () => {
        expect(midi).property("noteName").instanceof(Function)
      })
    })
    context(`ccName(ccNumber:number):string`, () => {
      specify("Is an interface method", () => {
        expect(midi).property("ccName").instanceof(Function)
      })
    })
    context(`normalizeStatus(statusNumber:number):string`, () => {
      specify("Is an interface method", () => {
        expect(midi).property("normalizeStatus").instanceof(Function)
      })
    })
    context(`normalizeChannel(channelNumber:number):string`, () => {
      specify("Is an interface method", () => {
        expect(midi).property("normalizeChannel").instanceof(Function)
      })
    })
    context(`normalizeData(number:number):number`, () => {
      specify("Is an interface method", () => {
        expect(midi).property("normalizeData").instanceof(Function)
      })
    })
    context(`allNotesOff():void`, () => {
      specify("Is an interface method", () => {
        expect(midi).property("normalizeData").instanceof(Function)
      })
    })
  })
})
