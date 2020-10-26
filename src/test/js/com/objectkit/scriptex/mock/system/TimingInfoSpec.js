import chai from "chai"
import { TimingInfo } from "@objectkit/scriptex.mock"

describe(`TimingInfo`, () => {

  const { expect } = chai

  context(`new TimingInfo()`, () => {
    const info= new TimingInfo()

    specify(`blockStartBeat= 0`, () => {
      expect(info).property(`blockStartBeat`, 0)
    })
    specify(`blockEndBeat= 0`, () => {
      expect(info).property(`blockEndBeat`, 0)
    })
    specify(`blockLength= 0`, () => {
      expect(info).property(`blockLength`, 0)
    })
    specify(`tempo= 120`, () => {
      expect(info).property(`tempo`, 120)
    })
    specify(`playing= false`, () => {
      expect(info).property(`playing`, false)
    })
    specify(`cycling= false`, () => {
      expect(info).property(`cycling`, false)
    })
    specify(`leftCycleBeat= 0`, () => {
      expect(info).property(`leftCycleBeat`, 0)
    })
    specify(`rightCycleBeat= 0`, () => {
      expect(info).property(`rightCycleBeat`, 0)
    })
    specify(`meterDenominator= 4`, () => {
      expect(info).property(`meterDenominator`, 4)
    })
    specify(`meterNumerator 4`, () => {
      expect(info).property(`meterDenominator`, 4)
    })
  })
})
