#!/usr/bin/env node

const puppeteer = require('puppeteer');
const parseUrl = require('url-parse');
const fileUrl = require('file-url');
const isUrl = require('is-url');

const argv = require('yargs')
    .command({
        command: 'print <input> <output>',
        desc: 'Print an HTML file or URL to PDF',
        builder: {
            background: {
                boolean: true,
                default: true
            },
            'margin-top': {
                default: '6.25mm'
            },
            'margin-right': {
                default: '6.25mm'
            },
            'margin-bottom': {
                default: '14.11mm'
            },
            'margin-left': {
                default: '6.25mm'
            },
            format: {
                default: 'Letter'
            },
            timeout: {
                default: 30 * 1000,
                number: true,
            },
            landscape: {
                boolean: true,
                default: false
            },
            'viewport-width': {
                default: 0,
                number: true
            },
            'viewport-height': {
                default: 0,
                number: true
            }
        },
        handler: async argv => {
            try {
                await print(argv);
            } catch (err) {
                console.error('Failed to generate pdf:', err);
                process.exit(1);
            }
        }
    }).command({
        command: 'screenshot <input> <output>',
        desc: 'Take screenshot of an HTML file or URL to PNG',
        builder: {
            'full-page': {
                boolean: true,
                default: true
            },
            'omit-background': {
                boolean: true,
                default: false
            }
        },
        handler: async argv => {
            try {
                await screenshot(argv);
            } catch (err) {
                console.error('Failed to take screenshot:', err);
                process.exit(1);
            }
        }
    })
    .demandCommand()
    .help()
    .argv;

async function _setViewPort(page, argv) {
    const w = argv.viewportWidth;
    const h = argv.viewportHeight;

    if ((w && !h) || (!w && h)) {
        console.error(`Config Error : viewportWidth and viewportHeight must be set or not set same-ly. viewportWidth=${w}|viewportHeight=${h}`);
        process.exit(1)
    }

    if (w && h) {
        console.log(`page.setViewport({width: ${w}, height: ${h}})`);
        await page.setViewport({width: w, height: h})
    }
}


async function print(argv) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await _setViewPort(page, argv);
    const url = isUrl(argv.input) ? parseUrl(argv.input).toString() : fileUrl(argv.input);

    console.log(`Loading ${url}`);
    await page.goto(url, {
        timeout: argv.timeout
    });

    console.log(`Writing ${argv.output}`);
    await page.pdf({
        path: argv.output,
        format: argv.format,
        landscape: argv.landscape,
        printBackground: argv.background,
        margin: {
            top: argv.marginTop,
            right: argv.marginRight,
            bottom: argv.marginBottom,
            left: argv.marginLeft
        }
    });

    console.log('Done');
    await browser.close();
}

async function screenshot(argv) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await _setViewPort(page, argv);

    const url = isUrl(argv.input) ? parseUrl(argv.input).toString() : fileUrl(argv.input);

    console.log(`Loading ${url}`);
    await page.goto(url);

    console.log(`Writing ${argv.output}`);
    await page.screenshot({
        path: argv.output,
        fullPage: argv.fullPage,
        omitBackground: argv.omitBackground
    });

    console.log('Done');
    await browser.close();
}
