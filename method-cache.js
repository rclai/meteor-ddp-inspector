/**
 * This method fills the method name cache.
 * The package is loaded after some messages were sent, and possibly some method calls among them.
 * If a result is received after the package was loaded, we cannot retrieve its name from the
 * message collection.
 * Ir the method has an outstanding callback, it also includes the method name, so we can use it
 * to create a partial cache of such method names.
 */
function fillMethodCache() {
  var blocks = Meteor.connection._outstandingMethodBlocks;
  if (!_.isEmpty(blocks)) {

    var currentMethodBlock = blocks[0].methods;
    var m;
    for (var i = 0; i < currentMethodBlock.length; i++) {
      m = currentMethodBlock[i];
      if (m._message && m._message.method) {
        MethodNameCache[m.methodId] = m._message.method;
      }
    }
  }
}

fillMethodCache();
