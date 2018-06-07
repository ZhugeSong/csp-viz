# Content Security Policy Visualizer

## Description

This is a simple HTML- and JavaScript-based tool that allows you to input a [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) (CSP) header and see a table providing nicer view of its effects.

## Instructions

The tool is completely written in self-contained HTML and JavaScript, so no special hosting is required. You can run it locally by cloning this repository, or from [the version hosted on GitHub pages](https://zhugesong.github.io/csp-viz/csp-viz.html).

1. Open [`csp-viz.html`](./csp-viz.html) in a browser that supports ES2016 (I think)
2. Put your CSP into the text input field
3. Submit

The page should render a table describing the CSP.

## Rationale

I made this one day after having to read a CSP string several times and wishing I had an easier way to view it.
