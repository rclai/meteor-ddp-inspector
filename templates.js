function colorize(str) {
  return !!Constellation && Package["constellation:console"].Constellation.colorize(str) || str;
}

Template.registerHelper('ddpInspectorMessageStr', function () {
  return (Template.parentData(1) === 'constellation_plugin_ddp-inspector') ? colorize(this.messageStr) : this.messageStr;
});

Template[DDP_INSPECTOR_PREFIX].created = function () {
  var self = this;
  self.messages = [];
  self.autorun(function () {
    UpdatePanelTracker.depend();
    var criteria = {};
    var search = Session.get(DDP_INSPECTOR_SEARCH_INPUT);
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
    if (Session.equals(DDP_INSPECTOR_SUPPRESS_PING, true)) {
      criteria['message.msg'] = {
        $nin: ['ping', 'pong']
      };
    }
    var sessionLimit = Session.get(DDP_INSPECTOR_SEARCH_LIMIT);
    var limit = typeof sessionLimit === 'number' ? sessionLimit : 50;
    self.messages = DDPMessages.find(criteria, {
      sort: {
        __order: -1
      },
      limit: limit,
      reactive: false
    }).fetch();
  });
};

Template[DDP_INSPECTOR_PREFIX].rendered = function () {
  this.find(DDP_INSPECTOR_PANEL_ID)._uihooks = {
    insertElement: function (node, next) {
      $(node).addClass('inserted').insertBefore(next);

      Meteor.setTimeout(function () {
        $(node).removeClass('inserted');
      }, 20);
    },
  }
};

Template[DDP_INSPECTOR_PREFIX].helpers({
  ddpMessages: function () {
    UpdatePanelTracker.depend();
    // No other way to trigger reactivity for the other session vars
    Session.get(DDP_INSPECTOR_SEARCH_LIMIT);
    Session.get(DDP_INSPECTOR_SUPPRESS_PING);
    return Template.instance().messages;
  },
  whichDDPTemplate: function () {
    var message = this.message;
    if (typeof message.collection !== 'undefined') {
      return Template[DDP_INSPECTOR_COLLECTIONS_TEMPLATE];
    } else if (message.msg === 'sub' || (message.msg === 'ready' && message.subs)) {
      return Template[DDP_INSPECTOR_SUBS_TEMPLATE];
    } else if (typeof message.method !== 'undefined' || (message.msg === 'updated' && message.methods) || (message.msg === 'result')) {
      return Template[DDP_INSPECTOR_METHODS_TEMPLATE];
    } else {
      return Template[DDP_INSPECTOR_UNKNOWN_TEMPLATE];
    }
  },
  searchTemplate: function () {
    return Template[DDP_INSPECTOR_SEARCH_TEMPLATE];
  },
  constellation: function () {
    // Widget needs to know whether it's standalone or in Constellation context
    // So it can shift the search and reset inputs off to the Constellation menu bar
    return !!Constellation && _.isString(this) && String(this) === 'constellation_plugin_ddp-inspector';
  }
});

Template[DDP_INSPECTOR_SEARCH_TEMPLATE].helpers({
  searchInput: function () {
    return Session.get(DDP_INSPECTOR_SEARCH_INPUT);
  }
});

Template[DDP_INSPECTOR_SEARCH_TEMPLATE].events({
  'keyup .ddp-inspector-search': _.throttle(function (event, template) {
    Session.setPersistent(DDP_INSPECTOR_SEARCH_INPUT, event.target.value);
    UpdatePanelTracker.changed();
  }, 300),
  'click .ddp-inspector-reset': function () {
    DDPMessages.remove({});
    UpdatePanelTracker.changed();
    // Clear search field
    // otherwise user who has a current search term may be confused when they press reset
    // then take a few actions and don't see any messages appearing in their ddp inspector
    // Balancing this against the possibility of a user wanting to keep a search term in play
    // after resetting and performing some specific actions that might produce that
    // same search term in the DDP messages
    $('.ddp-inspector-search').val('');
    Session.setPersistent(DDP_INSPECTOR_SEARCH_INPUT, '');
  }
});

Template[DDP_INSPECTOR_SUBS_TEMPLATE].helpers({
  subscriptionName: function () {
    var message = this.message;
    if (message.name) {
      return message.name;
    } else if (message.subs) {
      return DDPMessages.find({
        'message.msg': 'sub',
        'message.id': {
          $in: message.subs
        }
      }, {
        limit: message.subs.length,
        reactive: false
      }).map(function (msg) {
        return msg.message.name;
      });
    }
  }
});

Template[DDP_INSPECTOR_METHODS_TEMPLATE].helpers({
  methodName: function () {
    var message = this.message;
    if (message.method) {
      return message.method;
    } else if (message.methods) {
      return DDPMessages.find({
        'message.msg': 'method',
        'message.id': {
          $in: message.methods
        }
      }, {
        limit: message.methods.length,
        reactive: false
      }).map(function (msg) {
        return msg.message.method;
      });
    } else if (message.msg === 'result' && message.id) {
      var ddpMessage = DDPMessages.findOne({
        'message.msg': 'method',
        'message.id': message.id
      }, {
        reactive: false
      });
      if (ddpMessage) {
        return ddpMessage.message.method;
      } else if (MethodNameCache.hasOwnProperty(message.id)) {
        // it is possible that the method call was not registered by ddp-inspector.
        // this happens when the method was called berofe ddp-inspector had the chance to wrap _send().
        // if the method had a callback, we cached the method name earlier...
        return MethodNameCache[message.id];
      } else {
        // ...otherwise, we don't know the method name based on the id.
        return '(unknown method)';
      }
    }
  }
});
