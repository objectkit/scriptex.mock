import chai from "chai"
import { PolyPressure } from "@objectkit/scriptex.mock"

describe(`PolyPressure`, ()=> {

  const { expect } = chai

  context("new PolyPressure()", () => {

    const event = new PolyPressure()

    specify("status= 160", () => {
      expect(event).property("status", PolyPressure.STATUS)
    })

    specify("value= 0", () => {
      expect(event).property("value", 0)
    })

    specify("pitch= 0", () => {
      expect(event).property("pitch", 0)
    })
  })
})
