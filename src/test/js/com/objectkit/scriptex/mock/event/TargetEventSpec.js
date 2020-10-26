import chai from "chai"
import { TargetEvent } from "@objectkit/scriptex.mock"

describe(`TargetEvent`, ()=> {

  const { expect } = chai

  context("new TargetEvent()", () => {

    const event = new TargetEvent()

    specify("status= 80", () => {
      expect(event).property("status", TargetEvent.STATUS)
    })
  })
})
