import chai from "chai"
import { NoteOff } from "@objectkit/scriptex.mock"

describe(`NoteOff`, ()=> {

  const { expect }= chai

  context("new NoteOff()", () => {

    const event = new NoteOff()

    specify("status= 128", () => {
      expect(event).property("status", NoteOff.STATUS)
    })
  })
})
