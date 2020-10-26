import chai from "chai"
import { ProgramChange } from "@objectkit/scriptex.mock"

describe(`ProgramChange`, ()=> {

  const { expect } = chai

  context("new ProgramChange()", () => {

    const event = new ProgramChange()

    specify("status= 192", () => {
      expect(event).property("status", ProgramChange.STATUS)
    })

    specify("number= 1", () => {
      expect(event).property("number", 1)
    })
  })
})
