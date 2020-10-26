import chai from "chai"
import { Note } from "@objectkit/scriptex.mock"

describe(`Note`, ()=> {
  
  const { expect } = chai

  context("new Note()", () => {

    const event = new Note()

    specify("status= 144", () => {
      expect(event).property("status", Note.STATUS)
    })

    specify("pitch= 100", () => {
      expect(event).property("pitch", 100)
    })

    specify("velocity= 100", () => {
      expect(event).property("velocity", 100)
    })
  })
})
