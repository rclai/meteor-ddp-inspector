var ddpThrottleUpdate = _.throttle(function () {
  UpdatePanelTracker.changed();
}, 300);
var _send = Meteor.connection._send;
var counter = 0;

Meteor.connection._send = function (obj) {
  if (obj.msg !== 'ping' && obj.msg !== 'pong') {
    ddpThrottleUpdate();
  }
  DDPMessages.insert({
    out: true,
    message: obj,
    messageStr: JSON.stringify(obj, null, '  '),
    __order: counter++
  }, function () {});
  if (Session.equals(DDP_INSPECTOR_CONSOLE_ENABLED, true)) {
    console.log("Sent:\n", obj);
  }
  _send.call(this, obj);
};

Meteor.connection._stream.on('message', function (message) {
  var obj = JSON.parse(message);
  if (obj.msg !== 'ping' && obj.msg !== 'pong') {
    ddpThrottleUpdate();
  }
  DDPMessages.insert({
    message: obj,
    messageStr: JSON.stringify(obj, null, '  '),
    __order: counter++
  }, function () {});
  if (Session.equals(DDP_INSPECTOR_CONSOLE_ENABLED, true)) {
    console.log("Received:\n", obj);
  }
});

Meteor.startup(function () {
  Session.setDefaultPersistent(DDP_INSPECTOR_SESSION_ACTIVE, true);
  Session.setDefaultPersistent(DDP_INSPECTOR_SUPPRESS_PING, true);
  Session.setDefaultPersistent(DDP_INSPECTOR_CONSOLE_ENABLED, false);
  Blaze.render(Template[DDP_INSPECTOR_PREFIX], document.body);
  // Initialize hot-key
  Mousetrap.bind(['command+d', 'ctrl+d'], function () {
    $(DDP_INSPECTOR_PANEL_ID).toggle();
    return false;
  });
});
