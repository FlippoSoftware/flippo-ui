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
 * Получает все хуки из dist/hooks
 */
function getHooks() {
    const hooksDir = join(distDir, 'hooks');

    if (!existsSync(hooksDir)) {
        throw new Error('dist/hooks directory not found. Run build first.');
    }

    return readdirSync(hooksDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort();
}

/**
 * Преобразует имя хука в kebab-case для exports
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
function generateHookExport(hookName) {
    const kebabName = toKebabCase(hookName);
    const basePath = `./dist/hooks/${hookName}`;

    // Проверяем какие файлы существуют
    const cjsExists = checkFileExists(`${basePath}/index.cjs.js`);
    const esExists = checkFileExists(`${basePath}/index.es.js`);
    const typesExists = checkFileExists(`${basePath}/index.d.ts`);

    if (!cjsExists && !esExists) {
        console.warn(`Warning: No built files found for ${hookName}`);
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
    const basePath = './dist/hooks';

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
    const hooks = getHooks();
    console.log(`📦 Found ${hooks.length} hooks:`, hooks.join(', '));

    // Генерируем новые exports
    const newExports = {};

    // Основной export
    console.log('📝 Generating main export...');
    newExports['.'] = generateMainExport();

    // Exports для каждого компонента
    console.log('📝 Generating component exports...');
    for (const hook of hooks) {
        const exportData = generateHookExport(hook);
        if (exportData) {
            newExports[exportData.key] = exportData.value;
            console.log(`  ✅ ${exportData.key}`);
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
    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 4)}\n`);

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
