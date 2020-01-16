#!/usr/bin/env node

const puppeteer = require('puppeteer');
const parseUrl = require('url-parse');
const fileUrl = require('file-url');
const isUrl = require('is-url');

// common options for both print and screenshot commands
const commonOptions = {
    'sandbox': {
        boolean: true,
        default: true
    },
    'timeout': {
        default: 30 * 1000,
        number: true,
    },
    'wait-until': {
        string: true,
        default: 'load'
    }
};

const argv = require('yargs')
    .command({
        command: 'print <input> [output]',
        desc: 'Print an HTML file or URL to PDF',
        builder: {
            ...commonOptions,
            'background': {
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
            'format': {
                default: 'Letter'
            },
            'landscape': {
                boolean: true,
                default: false
            },
            'display-header-footer': {
                boolean: true,
                default: false
            },
            'header-template': {
                string: true,
                default: ''
            },
            'footer-template': {
                string: true,
                default: ''
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
        command: 'screenshot <input> [output]',
        desc: 'Take screenshot of an HTML file or URL to PNG',
        builder: {
            ...commonOptions,
            'full-page': {
                boolean: true,
                default: true
            },
            'omit-background': {
                boolean: true,
                default: false
            },
            'viewport': {
                describe: 'Set viewport to a given size, e.g. 800x600',
                type: 'string'
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

async function print(argv) {
    const browser = await puppeteer.launch(buildLaunchOptions(argv));
    const page = await browser.newPage();
    const url = isUrl(argv.input) ? parseUrl(argv.input).toString() : fileUrl(argv.input);

    console.error(`Loading ${url}`);
    await page.goto(url, buildNavigationOptions(argv));

    console.error(`Writing ${argv.output || 'STDOUT'}`);
    const buffer = await page.pdf({
        path: argv.output || null,
        format: argv.format,
        landscape: argv.landscape,
        printBackground: argv.background,
        margin: {
            top: argv.marginTop,
            right: argv.marginRight,
            bottom: argv.marginBottom,
            left: argv.marginLeft
        },
        displayHeaderFooter: argv.displayHeaderFooter,
        headerTemplate: argv.headerTemplate,
        footerTemplate: argv.footerTemplate
    });

    if (!argv.output) {
        await process.stdout.write(buffer);
    }

    console.error('Done');
    await browser.close();
}

async function screenshot(argv) {
    const browser = await puppeteer.launch(buildLaunchOptions(argv));
    const page = await browser.newPage();
    const url = isUrl(argv.input) ? parseUrl(argv.input).toString() : fileUrl(argv.input);

    if (argv.viewport) {
        const formatMatch = argv.viewport.match(/^(?<width>\d+)[xX](?<height>\d+)$/);

        if (!formatMatch) {
            console.error('Option --viewport must be in the format ###x### e.g. 800x600');
            process.exit(1);
        }

        const { width, height } = formatMatch.groups;
        console.error(`Setting viewport to ${width}x${height}`);
        await page.setViewport({
            width: parseInt(width),
            height: parseInt(height)
        });
    }

    console.error(`Loading ${url}`);
    await page.goto(url, buildNavigationOptions(argv));

    console.error(`Writing ${argv.output || 'STDOUT'}`);
    const buffer = await page.screenshot({
        path: argv.output || null,
        fullPage: argv.fullPage,
        omitBackground: argv.omitBackground
    });

    if (!argv.output) {
        await process.stdout.write(buffer);
    }

    console.error('Done');
    await browser.close();
}

function buildLaunchOptions({ sandbox }) {
    const args = [];

    if (sandbox === false) {
        args.push('--no-sandbox', '--disable-setuid-sandbox');
    }

    return {
        args
    };
}

function buildNavigationOptions({ timeout, waitUntil }) {
    return {
        timeout,
        waitUntil
    };
}
