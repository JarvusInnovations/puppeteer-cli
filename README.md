# puppeteer-v-cli

A general command-line wrapper for puppeteer. Currently only supports one command—`print`—to render a local/or remote HTML file to PDF. Aims to be a easy replacement for the deprecated wkhtmltopdf.

It is copycat of `puppeteer-cli`. Just support viewport option. (when original app support this feature, it will be deprecated.)

## Usage

```bash
puppeteer-v print <input> <output>

Print an HTML file or URL to PDF. If viewport-width > 0 and viewport-height > 0, then set viewport size.


Options:
  --version        Show version number                                 [boolean]
  --help           Show help                                           [boolean]
  --background                                         [boolean] [default: true]
  --margin-top                                               [default: "6.25mm"]
  --margin-right                                             [default: "6.25mm"]
  --margin-bottom                                           [default: "14.11mm"]
  --margin-left                                              [default: "6.25mm"]
  --format                                                   [default: "Letter"]
  --landscape                                         [boolean] [default: false]
  --viewport-width                                    [number] [default: 0]
  --viewport-height                                    [number] [default: 0]
```

```bash
puppeteer-v screenshot <input> <output>

Take screenshot of an HTML file or URL to PNG

Options:
  --version          Show version number                               [boolean]
  --help             Show help                                         [boolean]
  --full-page                                          [boolean] [default: true]
  --omit-background                                   [boolean] [default: false]
```

## Example

``` shell
npm install -g puppeteer-v-cli
echo "<h1>Hello world!</h1>" > mypage.html
puppeteer-v print mypage.html myprint.pdf # local file
puppeteer-v print https://github.com/JarvusInnovations/puppeteer-cli puppeteer-cli.pdf # url
puppeteer-v screenshot mypage.html myscreenshot.png # local file
puppeteer-v screenshot https://jarv.us myscreenshot.png # url
puppeteer-v screenshot https://jarv.us myscreenshot.png --viewport-width 100 --viewport-height 100 
```

## Roadmap

- [X] Add `print` command
- [X] Add support for `http://` inputs in addition to local file paths
- [X] Add `screenshot` command
- [ ] Add compatibility with `wkhtmltopdf` parameters to provide a drop-in replacement?
- [ ] Detect `.json` or `.js` files as input to `screenshot` command instead of a single HTML file or URL, specifying a set of screenshots to capture in series
