## DDP Inspector

This is a __client-side__ DDP inspector that will capture all DDP activity. You've heard the phrase "data over the wire", but have you seen what that data looks like? This will show you. __This package will not be compiled into production__.

## Installation

```
meteor add lai:ddp-inspector
```

## Usage

Press (Ctrl/Cmd) + D to toggle panel on the left.
Search for any DDP message (uses regex searching of a local collection).

## More Info

The panel will only show you 50 DDP messages at a time, the most recent ones first. 

If you want to see more DDP messages, simply call `Session.setPersistent('lai:ddp-inspector.limit', YouDesiredNumber);`.

If you reload, your search will remain in the search box. However, your DDP messages will be gone.

By default, the DDP messages are not logged to the console, if you still would like to see them in the console, simply call `Session.setPersistent('lai:ddp-inspector.console', true)`.

If you want the old school version that only outputs to the console, `meteor add lai:ddp-inspector@0.6.0`.

## Credit

This package was made using the code from this [StackOverflow post](http://stackoverflow.com/a/25373867/620010).

## Future

* [x] Persistent active/inactive state through manual reloads (it already keep state in hot code reloads).
* [x] Full text search the DDP messages
* [x] UI Panel
* [x] Hot key toggle
* [ ] Use tokens to have more granular search
* [ ] Limit changing ability

## Feedback welcome

## License

MIT
