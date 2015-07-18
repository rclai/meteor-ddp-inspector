Package.describe({
  name: 'lai:ddp-inspector',
  version: '1.1.5',
  // Brief, one-line summary of the package.
  summary: 'See all DDP activity in the client-side and full-text search them.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rclai/meteor-ddp-inspector.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'mongo',
    'tracker',
    'templating',
    'session',
    'u2622:persistent-session@0.3.3',
    'underscore',
    'mousetrap:mousetrap@1.4.6_1',
    'jquery',
	'reactive-dict'
  ]);
  api.use('constellation:console@1.1.5', {weak: true});

  api.addFiles([
    'console-log-polyfill.js',
    'lai-ddp-inspector.html',
    'lai-ddp-inspector.css',
    'lai-ddp-inspector.js'
  ], ['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('lai:ddp-inspector');
  api.addFiles('lai-ddp-inspector-tests.js');
});
