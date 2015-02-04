## DDP Inspector

This is a client-side DDP inspector that will capture all DDP activity in your browser console. You've heard the phrase "data over the wire", but have you seen what that data looks like? This will show you. _This package will not be compiled into production_.

## Installation

```
meteor add lai:ddp-inspector
```

## Usage

Open up your browser console and just see the logs pour through. Click Inspect DDP button to turn DDP logging on or off.

## More Info

It comes with a handy toggle button to toggle it, in case you're tired of seeing your console get flooded with logs. If the button is in the way or not showing (it should show at the bottom left corner fixed by default), you can use CSS to make it show. The button has an id of `ddp-inspector-button` and toggle classes of `active` and `inactive`.

This package was made using the code from this [StackOverflow post](http://stackoverflow.com/a/25373867/620010)

## Future

Filtering of DDP messages to certain subscriptions.

## Feedback welcome

## License

MIT