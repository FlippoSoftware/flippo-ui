#!/usr/bin/env node

import {
    existsSync,
    readdirSync,
    readFileSync,
    writeFileSync
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');
const distDir = join(packageRoot, 'dist');
const packageJsonPath = join(packageRoot, 'package.json');

/**
 * Получает все компоненты из dist/components
 */
function getComponents() {
    const componentsDir = join(distDir, 'components');

    if (!existsSync(componentsDir)) {
        throw new Error('dist/components directory not found. Run build first.');
    }

    return readdirSync(componentsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort();
}

/**
 * Преобразует имя компонента в kebab-case для exports
 */
function toKebabCase(str) {
    return str
    // Разделяем по заглавным буквам
        .replace(/([A-Z])/g, '-$1')
    // Убираем первый дефис и переводим в нижний регистр
        .toLowerCase()
        .replace(/^-/, '');
}

/**
 * Проверяет существование файлов
 */
function checkFileExists(filePath) {
    return existsSync(join(packageRoot, filePath));
}

/**
 * Генерирует exports для компонента
 */
function generateComponentExport(componentName) {
    const kebabName = toKebabCase(componentName);
    const basePath = `./dist/components/${componentName}`;

    // Проверяем какие файлы существуют
    const cjsExists = checkFileExists(`${basePath}/index.cjs.js`);
    const esExists = checkFileExists(`${basePath}/index.es.js`);
    const typesExists = checkFileExists(`${basePath}/index.d.ts`);

    if (!cjsExists && !esExists) {
        console.warn(`Warning: No built files found for ${componentName}`);
        return null;
    }

    const exportEntry = {
        types: typesExists ? `${basePath}/index.d.ts` : undefined
    };

    if (esExists && cjsExists) {
        exportEntry.import = `${basePath}/index.es.js`;
        exportEntry.require = `${basePath}/index.cjs.js`;
    }
    else if (esExists) {
        exportEntry.default = `${basePath}/index.es.js`;
    }
    else if (cjsExists) {
        exportEntry.default = `${basePath}/index.cjs.js`;
    }

    // Удаляем undefined значения
    Object.keys(exportEntry).forEach((key) => {
        if (exportEntry[key] === undefined) {
            delete exportEntry[key];
        }
    });

    return {
        key: `./${kebabName}`,
        value: exportEntry
    };
}

/**
 * Генерирует основной export
 */
function generateMainExport() {
    const basePath = './dist';

    const cjsExists = checkFileExists(`${basePath}/index.cjs.js`);
    const esExists = checkFileExists(`${basePath}/index.es.js`);
    const typesExists = checkFileExists(`${basePath}/index.d.ts`);

    const exportEntry = {
        types: typesExists ? `${basePath}/index.d.ts` : undefined
    };

    if (esExists && cjsExists) {
        exportEntry.import = `${basePath}/index.es.js`;
        exportEntry.require = `${basePath}/index.cjs.js`;
    }
    else if (esExists) {
        exportEntry.default = `${basePath}/index.es.js`;
    }
    else if (cjsExists) {
        exportEntry.default = `${basePath}/index.cjs.js`;
    }

    // Удаляем undefined значения
    Object.keys(exportEntry).forEach((key) => {
        if (exportEntry[key] === undefined) {
            delete exportEntry[key];
        }
    });

    return exportEntry;
}

/**
 * Основная функция
 */
function generateExports() {
    console.log('🔄 Generating exports...');

    // Читаем текущий package.json
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    // Получаем список компонентов
    const components = getComponents();
    console.log(`📦 Found ${components.length} components:`, components.join(', '));

    // Генерируем новые exports
    const newExports = {};

    // Основной export
    console.log('📝 Generating main export...');
    newExports['.'] = generateMainExport();

    // Exports для каждого компонента
    console.log('📝 Generating component exports...');
    for (const component of components) {
        const exportData = generateComponentExport(component);
        if (exportData) {
            newExports[exportData.key] = exportData.value;
            console.log(`  ✅ ${exportData.key}`);
        }
    }

    // Добавляем дополнительные exports для утилит
    const utilExports = [{ key: './merge-props', path: './dist/lib/merge' }, { key: './direction-provider', path: './dist/lib/hooks/useDirection' }, { key: './createHeadlessUIEventDetails', path: './dist/lib/createHeadlessUIEventDetails' }];

    console.log('📝 Generating utility exports...');
    for (const util of utilExports) {
        const cjsExists = checkFileExists(`${util.path}.cjs.js`);
        const esExists = checkFileExists(`${util.path}.es.js`);
        const typesExists = checkFileExists(`${util.path}.d.ts`);

        if (cjsExists || esExists) {
            const exportEntry = {
                types: typesExists ? `${util.path}.d.ts` : undefined
            };

            if (esExists && cjsExists) {
                exportEntry.import = `${util.path}.es.js`;
                exportEntry.require = `${util.path}.cjs.js`;
            }
            else if (esExists) {
                exportEntry.default = `${util.path}.es.js`;
            }
            else if (cjsExists) {
                exportEntry.default = `${util.path}.cjs.js`;
            }

            // Удаляем undefined значения
            Object.keys(exportEntry).forEach((key) => {
                if (exportEntry[key] === undefined) {
                    delete exportEntry[key];
                }
            });

            newExports[util.key] = exportEntry;
            console.log(`  ✅ ${util.key}`);
        }
    }

    // Обновляем package.json
    packageJson.exports = newExports;

    // Обновляем main и module для продакшена
    const mainExport = newExports['.'];
    if (mainExport.require) {
        packageJson.main = mainExport.require;
    }
    if (mainExport.import) {
        packageJson.module = mainExport.import;
    }
    if (mainExport.types) {
        packageJson.types = mainExport.types;
    }

    // Записываем обновленный package.json
    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

    console.log('✅ Exports generated successfully!');
    console.log(`📄 Updated exports for ${Object.keys(newExports).length} entries`);
}

// Запуск скрипта
try {
    generateExports();
}
catch (error) {
    console.error('❌ Error generating exports:', error.message);
    process.exit(1);
}
