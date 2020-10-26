import chai from "chai"
import { ChannelPressure } from "@objectkit/scriptex.mock"

describe(`ChannelPressure`, ()=> {

  const { expect } = chai

  context("new ChannelPressure()", () => {

    const event = new ChannelPressure()

    specify("status= 208", () => {
      expect(event).property("status", ChannelPressure.STATUS)
    })

    specify("value= 0", () => {
      expect(event).property("value", 0)
    })
  })
})
