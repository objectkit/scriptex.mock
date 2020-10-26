import chai from "chai"
import { ControlChange } from "@objectkit/scriptex.mock"

describe(`ControlChange`, ()=> {
  
  const { expect } = chai

  context("new ControlChange()", () => {
    const event= new ControlChange()

    specify("status= 176", () => {
      expect(event).property("status", ControlChange.STATUS)
    })

    specify("value= 100", () => {
      expect(event).property("value", 100)
    })

    specify("number= 100", () => {
      expect(event).property("value", 100)
    })
  })
})
