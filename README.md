# puppeteer-cli

A general command-line wrapper for puppeteer. Currently only supports one command—`print`—to render a local/or remote HTML file to PDF. Aims to be a easy replacement for the deprecated wkhtmltopdf.

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
  --landscape                                         [boolean] [default: false]
```

## Example

``` shell
npm install -g puppeteer-cli
echo "<h1>Hello world!</h1>" > mypage.html
puppeteer print mypage.html myprint.pdf # local file
puppeteer print https://github.com/JarvusInnovations/puppeteer-cli puppeteer-cli.pdf # url
```

## Roadmap

- [X] Add `print` command
- [X] Add support for `http://` inputs in addition to local file paths
- [ ] Add compatibility with `wkhtmltopdf` parameters to provide a drop-in replacement?
- [ ] Add `screenshot` command
- [ ] Detect `.json` or `.js` files as input to `screenshot` command instead of a single HTML file or URL, specifying a set of screenshots to capture in series
