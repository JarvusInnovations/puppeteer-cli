#!/usr/bin/env node

const puppeteer = require('puppeteer');
const parseUrl = require('url-parse');
const fileUrl = require('file-url');
const isUrl = require('is-url');

let headless = false;

const logger = {};
logger.log = function(message, ...optionalParams) { 
    if(!headless) {
        console.log.apply(null, arguments);
    }
}

const argv = require('yargs')
    .command({
        command: 'print <input> [<output>]',
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
            sandbox: {
                boolean: true,
                default: true
            },
            headless: {
                boolean: true,
                default: false
            }
        },
        handler: async argv => {
            try {
                // If output falsey make it null
                argv.output = argv.output || null;   
                headless = argv.headless;
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
            },
            sandbox: {
                boolean: true,
                default: true
            },
            headless: {
                boolean: true,
                default: false
            }
        },
        handler: async argv => {
            try {
                headless = argv.headless;
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

async function print(argv) {
    const launchArgs = buildLaunchArgs(argv);
    const browser = await puppeteer.launch(launchArgs);
    const page = await browser.newPage();
    const url = isUrl(argv.input) ? parseUrl(argv.input).toString() : fileUrl(argv.input);

    logger.log(`Loading ${url}`);
    await page.goto(url, {
        timeout: argv.timeout
    });

    logger.log(`Writing ${argv.output}`);
    const buffer = await page.pdf({
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

    if (argv.output == null) {
        await process.stdout.write(buffer)
    }

    logger.log('Done');
    await browser.close();
}

async function screenshot(argv) {
    const launchArgs = buildLaunchArgs(argv);
    const browser = await puppeteer.launch(launchArgs);
    const page = await browser.newPage();
    const url = isUrl(argv.input) ? parseUrl(argv.input).toString() : fileUrl(argv.input);

    logger.log(`Loading ${url}`);
    await page.goto(url);

    logger.log(`Writing ${argv.output}`);
    await page.screenshot({
        path: argv.output,
        fullPage: argv.fullPage,
        omitBackground: argv.omitBackground
    });

    logger.log('Done');
    await browser.close();
}

function buildLaunchArgs(argv) {
    const launchArgs = { args: [] };
    if(argv.sandbox === false) {
        launchArgs.args.push('--no-sandbox', '--disable-setuid-sandbox');
    }
    return launchArgs;
}
