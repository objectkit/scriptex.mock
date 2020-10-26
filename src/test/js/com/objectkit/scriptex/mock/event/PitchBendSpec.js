import chai from "chai"
import { PitchBend } from "@objectkit/scriptex.mock"

describe(`PitchBend`, ()=> {

  const { expect } = chai

  context("new PitchBend()", () => {

    const event = new PitchBend()

    specify("status= 128", () => {
      expect(event).property("status", PitchBend.STATUS)
    })

    specify("value= 0", () => {
      expect(event).property("value", 0)
    })
  })
})
