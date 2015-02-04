## DDP Inspector

This is a __client-side__ DDP inspector that will capture all DDP activity in your browser console. You've heard the phrase "data over the wire", but have you seen what that data looks like? This will show you. __This package will not be compiled into production__.

## Installation

```
meteor add lai:ddp-inspector
```

## Usage

Open up your browser console and just see the logs pour through. Click Inspect DDP button (bottom left) to turn DDP logging on or off.

![alt tag](https://raw.github.com/rclai/meteor-ddp-inspector/master/screenshot.png)

## More Info

There's a toggle button (at the bottom left corner fixed by default), you can use CSS to make it display however/wherever you want. The button has an id of `ddp-inspector-button` and toggle classes of `active` and `inactive`.

This package was made using the code from this [StackOverflow post](http://stackoverflow.com/a/25373867/620010).

## Future

* [x] Persistent active/inactive state through manual reloads (it already keep state in hot code reloads).
* [ ] Filtering of DDP messages by subscriptions.

## Feedback welcome

## License

MIT
