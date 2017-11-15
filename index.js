#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fileUrl = require('file-url');

const argv = require('yargs')
    .command({
        command: 'print <input> <output>',
        desc: 'Print an html file to pdf',
        builder: {
            background: {
                default: true
            },
            marginTop: {
                default: '6.25mm'
            },
            marginRight: {
                default: '6.25mm'
            },
            marginBottom: {
                default: '14.11mm'
            },
            marginLeft: {
                default: '6.25mm'
            },
            format: {
                default: 'Letter'
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
    })
    .demandCommand()
    .help()
    .argv;

async function print(argv) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = fileUrl(argv.input);

    console.log(`Loading ${url}`);
    await page.goto(fileUrl(argv.input));

    console.log(`Writing ${argv.output}`);
    await page.pdf({
        path: argv.output,
        format: argv.format,
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