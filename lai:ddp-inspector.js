var DDP_INSPECTOR_PREFIX = 'lai:ddp-inspector';
var DDP_INSPECTOR_SESSION_ACTIVE_KEY = DDP_INSPECTOR_PREFIX.concat('.active');
var DDP_INSPECTOR_PANEL_ID = '#ddp-inspector-panel';

Template[DDP_INSPECTOR_PREFIX].helpers({
  searchInput: function () {
    return Session.get(DDP_INSPECTOR_PREFIX + '.search');
  },
  ddpMessages: function () {
    var criteria = {};
    var search = Session.get(DDP_INSPECTOR_PREFIX + '.search');
    if (search) {
      try {
        criteria.messageStr = {
          $regex: new RegExp(search, 'i')
        };
      } catch (e) {
        // If for some reason the regex is messed up just fall back to this
        criteria.messageStr = search;
      }
    }
    if (Session.equals(DDP_INSPECTOR_PREFIX + '.suppressPing', true)) {
      criteria['message.msg'] = {
        $nin: ['ping', 'pong']
      };
    }
    var sessionLimit = Session.get(DDP_INSPECTOR_PREFIX + '.limit');
    var limit = typeof sessionLimit === 'number' ? sessionLimit : 50;
    return DDPMessages.find(criteria, { sort: { __order: -1 }, limit: limit });
  },
  whichDDPTemplate: function () {
    var message = this.message;
    if (typeof message.collection !== 'undefined') {
      return Template[DDP_INSPECTOR_PREFIX.concat(':collection')];
    } else if (message.msg === 'sub' || (message.msg === 'ready' && message.subs)) {
      return Template[DDP_INSPECTOR_PREFIX.concat(':subscription')];
    } else if (typeof message.method !== 'undefined' || (message.msg === 'updated' && message.methods) || (message.msg === 'result')) {
      return Template[DDP_INSPECTOR_PREFIX.concat(':method')];
    } else {
      return Template[DDP_INSPECTOR_PREFIX.concat(':unknown')];
    }
  }
});

var throttleHandle = null;

Template[DDP_INSPECTOR_PREFIX].events({
  'keyup #ddp-inspector-search': function (event, template) {
    if (throttleHandle) {
      clearTimeout(throttleHandle);
    }
    throttleHandle = setTimeout(function () {
      Session.setPersistent(DDP_INSPECTOR_PREFIX + '.search', event.target.value);
    }, 300);
  }
});

Template[DDP_INSPECTOR_PREFIX + ':subscription'].helpers({
  subscriptionName: function () {
    var message = this.message;
    if (message.name) {
      return message.name;
    } else if (message.subs) {
      return DDPMessages.find({ 'message.msg': 'sub', 'message.id': { $in: message.subs } }, { limit: message.subs.length }).map(function (msg) {
        return msg.message.name;
      });
    }
  }
});

Template[DDP_INSPECTOR_PREFIX + ':method'].helpers({
  methodName: function () {
    var message = this.message;
    if (message.method) {
      return message.method;
    } else if (message.methods) {
      return DDPMessages.find({ 'message.msg': 'method', 'message.id': { $in: message.methods } }, { limit: message.methods.length }).map(function (msg) {
        return msg.message.method;
      });
    } else if (message.msg === 'result' && message.id) {
      return DDPMessages.find({ 'message.msg': 'method', 'message.id': message.id }).map(function (msg) {
        return msg.message.method;
      });
    }
  }
});

DDPMessages = new Mongo.Collection(null);

Meteor.startup(function () {
  Session.setDefaultPersistent(DDP_INSPECTOR_SESSION_ACTIVE_KEY, true);
  Session.setDefaultPersistent(DDP_INSPECTOR_PREFIX + '.suppressPing', true);
  Session.setDefaultPersistent(DDP_INSPECTOR_PREFIX + '.console', false);
  Blaze.render(Template[DDP_INSPECTOR_PREFIX], document.body);
  // Initialize hot-key
  Mousetrap.bind(['command+d', 'ctrl+d'], function () {
    $(DDP_INSPECTOR_PANEL_ID).toggle();
    return false;
  });
});

var _send = Meteor.connection._send;
var counter = 0;

Meteor.connection._send = function (obj) {
  DDPMessages.insert({
    message: obj,
    messageStr: JSON.stringify(obj, null, '  '),
    __type: 'sent',
    __order: counter++
  }, function () {});
  if (Session.equals(DDP_INSPECTOR_PREFIX + '.console', true)) {
    console.log("Sent:\n", obj);
  }
_send.call(this, obj);
};

Meteor.connection._stream.on('message', function (message) { 
  var obj = JSON.parse(message);
  DDPMessages.insert({
    message: obj,
    messageStr: JSON.stringify(obj, null, '  '),
    __type: 'receive',
    __order: counter++
  }, function () {});
  if (Session.equals(DDP_INSPECTOR_PREFIX + '.console', true)) {
    console.log("Received:\n", obj); 
  }
});