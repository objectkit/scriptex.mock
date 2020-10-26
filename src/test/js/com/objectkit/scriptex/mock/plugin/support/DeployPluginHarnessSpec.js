import chai from "chai"
import sinon from "sinon"
import { DefaultPlugin, Scriptex } from "@objectkit/scriptex"
import { DeployPluginHarness, VirtualScripter } from "@objectkit/scriptex.mock"

describe(`DeployPluginHarness`, () => {

  const MOCK_SYSTEM= new VirtualScripter()
  class Fixture extends DefaultPlugin {
    static get SYSTEM () {
      return MOCK_SYSTEM
    }
    constructor (...rest) {
      super()
      this.ctorArgs= rest
    }
  }


  const sandbox= sinon.createSandbox()
  const { assert }= chai

  afterEach(() => {
    sandbox.restore()
  })

  context(`#deployPlugin(pluginClass,system,ctorArgs):Object`, () => {
    describe(`Given pluginClass is passed`, () => {
      context(`When pluginClass.SYSTEM is empty`, () => {
        specify(`Then plugin.system becomes Scriptex.SYSTEM [default=global]`, () => {
          const { system }= new DeployPluginHarness().deployPlugin(DefaultPlugin)
          assert.strictEqual(system, global)
          assert.strictEqual(Scriptex.SYSTEM, global)
        })
      })
      context(`When pluginClass.SYSTEM is defined`, () => {
        specify(`Then plugin.system becomes pluginClass.SYSTEM`, () => {
          const { system }= new DeployPluginHarness().deployPlugin(Fixture)
          assert.strictEqual(system, MOCK_SYSTEM)
        })
      })
    })
    describe(`Given bespoke system is passed`, () => {
      context(`When pluginClass.SYSTEM is object`, () => {
        specify(`Then bespoke system overrides pluginClass.SYSTEM and becomes plugin.system`,() => {
          const { system }= new DeployPluginHarness()
            .deployPlugin(Fixture, MOCK_SYSTEM)
          assert.strictEqual(system, MOCK_SYSTEM)
        })
      })
    })
    describe(`Given ctorArgs is passed [default=[]]`, () => {
      specify(`Then ctorArgs are passed to the deployed plugins constructor`, () => {
        const mockCtorArgs= [1,2,3,4,5]
        const { plugin }= new DeployPluginHarness()
          .deployPlugin(Fixture, {}, mockCtorArgs)
        assert.deepEqual(plugin.ctorArgs, mockCtorArgs)
      })
    })
    describe(`Given a BespokePlugin with api hooks`, () => {
      specify(`Then api, plugin and system references are returned `, () => {
        const { api, plugin, system } = DeployPluginHarness.deployPlugin(DefaultPlugin)
        assert.isArray(api)
        assert.instanceOf(plugin, DefaultPlugin)
        assert.strictEqual(system, Scriptex.SYSTEM)
      })
    })
  })
  context(`.deployPlugin(pluginClass,system,ctorArgs):Object`, () => {
    specify(`Is a convenience method that delegates to #deployPlugin`, () => {
      const args= [1,2,3]
      const stub= sandbox.stub(DeployPluginHarness.prototype, `deployPlugin`).callsFake(()=>{})
      DeployPluginHarness.deployPlugin(DefaultPlugin, MOCK_SYSTEM, args)
      sandbox.assert.calledWith(stub, DefaultPlugin, MOCK_SYSTEM, args)
    })
  })
})
