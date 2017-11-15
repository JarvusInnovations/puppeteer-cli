# puppeteer-cli

A general command-line wrapper for [puppeteer](https://github.com/GoogleChrome/puppeteer). Currently only supports one command—`print`—to render a local HTML file to PDF.

## Usage

```
puppeteer print <input> <output>

Print an html file to pdf

Options:
  --version       Show version number                                  [boolean]
  --help          Show help                                            [boolean]
  --background                                                   [default: true]
  --marginTop                                                [default: "6.25mm"]
  --marginRight                                              [default: "6.25mm"]
  --marginBottom                                            [default: "14.11mm"]
  --marginLeft                                               [default: "6.25mm"]
  --format                                                   [default: "Letter"]
```

## Example

```
npm install -g puppeteer-cli
echo "<h1>Hello world!</h1>" > mypage.html
puppeteer print mypage.html myprint.pdf
```

## Roadmap

- [X] Add `print` command
- [ ] Add support for `http://` inputs in addition to local file paths
- [ ] Add `screenshot` command
- [ ] Detect `.json` or `.js` files as input to `screenshot` command instead of a single HTML file or URL, specifying a set of screenshots to capture in series