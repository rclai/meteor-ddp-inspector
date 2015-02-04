var DDP_INSPECTOR_PREFIX = 'lai:ddp-inspector';
var DDP_INSPECTOR_SESSION_ACTIVE_KEY = DDP_INSPECTOR_PREFIX.concat('.active');
var DDP_INSPECTOR_BUTTON_ID = '#ddp-inspector-button';

Session.setDefault(DDP_INSPECTOR_SESSION_ACTIVE_KEY, true);

// Unfortunately, a debugOnly package doesn't get to export vars
DDPInspector = {
  turnOn: function () {
    Session.set(DDP_INSPECTOR_SESSION_ACTIVE_KEY, true);
  },
  turnOff: function () {
    Session.set(DDP_INSPECTOR_SESSION_ACTIVE_KEY, false);
  },
  toggleActive: function () {
    Session.set(DDP_INSPECTOR_SESSION_ACTIVE_KEY, !Session.get(DDP_INSPECTOR_SESSION_ACTIVE_KEY));
  },
  show: function () {
    $(DDP_INSPECTOR_BUTTON_ID).show();
  },
  hide: function () {
    $(DDP_INSPECTOR_BUTTON_ID).hide();
  },
  toggleDisplay: function () {
    $(DDP_INSPECTOR_BUTTON_ID).toggle();
  },
  isVisible: function () {
    return $(DDP_INSPECTOR_BUTTON_ID).is(':visible');
  },
  isActive: function () {
    return Session.equals(DDP_INSPECTOR_SESSION_ACTIVE_KEY, true);
  }
};

var tpl = Template[DDP_INSPECTOR_PREFIX];

tpl.helpers({
  btnClass: function () {
    return DDPInspector.isActive() ? 'active' : 'inactive';
  }
});

tpl.events({
  'click button': function (event, template) {
    DDPInspector.toggleActive();
    event.stopImmediatePropagation();
  }
});

Meteor.startup(function () {
  Blaze.render(tpl, document.body);
});

var _send = Meteor.connection._send;

Meteor.connection._send = function (obj) {
  if (DDPInspector.isActive()) {
    console.log("Sent:\n", obj);
  }
  _send.call(this, obj);
};

Meteor.connection._stream.on('message', function (message) { 
  if (DDPInspector.isActive()) {
    console.log("Received:\n", JSON.parse(message)); 
  }
});