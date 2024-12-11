import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testsDir = join(__dirname, 'tests');
const comparerPath = `"` +join(testsDir, "TextComparer.bat")+`"`;
const analyzerPath = `"` +join(__dirname, "JackAnalyzer.js")+`"`;

let totalTests = 0;
let successTests = 0;

function runJackAnalyzer(filePath) {
    return new Promise((resolve, reject) => {
        execFile('node', [analyzerPath, filePath],{shell:true}, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running JackAnalyzer on ${filePath}: ${stderr}`);
                return reject(error);
            }
            resolve(stdout);
        });
    });
}

function runTextComparer(xmlFile, tokensFile) {
    return new Promise((resolve, reject) => {
        execFile(comparerPath, [xmlFile, tokensFile],{shell:true}, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running TextComparer on ${xmlFile} and ${tokensFile}: ${stderr}`);
                return reject(error);
            }
            resolve(stdout);
        });
    });
}

async function processFolder(folderPath) {
    const files = readdirSync(folderPath);

    for (const file of files) {
        if (file.endsWith('.jack')) {
            totalTests++;
            const jackFile = join(folderPath, file);
            const baseName = basename(file, '.jack');
            const xmlFile = join(folderPath, `${baseName}.xml`);
            const tokensFile = join(folderPath, `${baseName}.jack.comments_removed.tokens`);
            const tXmlFile = join(folderPath, `${baseName}T.xml`);

            try {
                await runJackAnalyzer(jackFile);
                const result1 = await runTextComparer(tXmlFile, tokensFile);
                const result2 = await runTextComparer(xmlFile, join(folderPath, `${baseName}.jack.tree.xml`));
                console.log({result1, result2});
                
                if (result2.includes('success') && result2.includes('Comparison')) {
                    successTests++;
                }
            } catch (error) {
                console.error(`Test failed for ${file}: ${error.message}`);
            }
        }
    }
}

async function main() {
    const folders = readdirSync(testsDir);

    for (const folder of folders) {
        const folderPath = join(testsDir, folder);
        if (statSync(folderPath).isDirectory()) {
            await processFolder(folderPath);
        }
    }

    console.log(`[${successTests}] out of [${totalTests}] succeeded`);
}

main().catch(err => console.error(err));