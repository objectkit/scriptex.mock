import { Scriptex } from "@objectkit/scriptex"

/**
 * @classDesc
 * DeployPluginHarness is a testing utility for deploying plugins in a structure way
 *
 * @example
 *  context(`Given BespokePlugin`, () => {
 *    describe(`When BespokePlugin is deployed`, () => {
 *      specify(`Then...`, () => {
 *        const { api, plugin, system }= DeployPluginHarness.deployPlugin(BespokePlugin)
 *        expect(system).propertyVal(`PluginParameters`, plugin.params)
 *        // etc
 *      })
 *    })
 *  })
 *
 * @see {@link DeployPluginHarness.deployPlugin}
 */
class DeployPluginHarness {

  /**
   * A short form convenience method that does not require explicit
   * instantiation of a DeployPluginHarness instance
   *
   * @param  {...*} rest Any arguments pertaining to the #deployPlugin method signature
   * @return {Object}    The return value of #deployPlugin
   * @see {@link #deployPlugin}
   */
  static deployPlugin (...rest) {
    return new this().deployPlugin(...rest)
  }

  /**
   * This method undertakes a faithful reproduction of the Plugin.deploy method,
   * returning references to the api, plugin and system in one move.
   *
   * Just as per Plugin#deploy, The deployment can be influenced by
   *
   *  pluginClass.SYSTEM
   *  pluginClass.API
   *  pluginClass.CONFIGURATION
   *
   * @param  {Function} [pluginClass=Plugin]
   *  Any class elected to be worthy of Plugin status
   * @param  {Array}  [ctorArgs=[]]
   *  Arguments to pass to the Plugin constructor
   * @param  {?Object} [system]
   *  The system to deploy to
   * @return {Object}               Reference captures from the deployment
   * @return {Object.plugin}        The plugin instance
   * @return {Object.system}        The system instance or global scope
   * @return {Object.api}           The deployments system integration keys
   * @see {@link Plugin.deploy}
   */
  deployPlugin(pluginClass, system=pluginClass.SYSTEM, ctorArgs=[]){
    const plugin= new pluginClass(...ctorArgs)
    const api= new Scriptex(system, pluginClass.API, pluginClass.CONFIGURABLE).deploy(plugin)
    return {
      api, plugin, system: plugin.system
    }
  }
}

export { DeployPluginHarness }
