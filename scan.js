const fs = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const { execSync } = require('child_process');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const IGNORED_DIRS = ['.git', 'node_modules'];

async function findFilesWithImports(dirPath) {
    const files = await readdir(dirPath);
    const jsFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    let npmPackages = new Set();

    for (const file of jsFiles) {
        const fullPath = join(dirPath, file);
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
            if (IGNORED_DIRS.includes(file)) {
                continue;
            }

            const nestedPackages = await findFilesWithImports(fullPath);
            nestedPackages.forEach(pkg => npmPackages.add(pkg));
        } else {
            const content = await fs.promises.readFile(fullPath, 'utf8');
            const importRegex = /(import|require)\s+\w+\s+from\s+['"](@?\w+[-\w\/]+)['"]/g;

            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const pkgName = match[2];

                // Проверяем, что пакет уже не был добавлен в npmPackages и не присутствует в package.json
                if (!npmPackages.has(pkgName) && !pkgExists(pkgName)) {
                    npmPackages.add(pkgName);
                }
            }
        }
    }

    return Array.from(npmPackages);
}

// Функция проверки существования пакета в package.json
function pkgExists(pkgName) {
    try {
        const packageJson = fs.readFileSync('./package.json', 'utf8');
        const dependencies = JSON.parse(packageJson).dependencies;
        return dependencies && dependencies[pkgName] != null;
    } catch (err) {
        console.error(err);
        return false;
    }
}

(async () => {
    const packages = await findFilesWithImports('.');
    const installCommands = packages.map(pkg => `npm i ${pkg}`).join('\n');
    await fs.promises.writeFile('install-all.sh', installCommands);

    console.log(`Установлено ${packages.length} пакетов:`);
    console.log(packages.join('\n'));

})();
