/**
 * The overview page of every package (`<package>/index`), from its README: the README stays the one source of the
 * package's guide (npm and GitHub show it too). The page drops the title (the frontmatter has it), the table of
 * contents (the site builds one) and the sections for contributors; links to the other packages point to their pages,
 * links to files of the repository to GitHub.
 *
 * The overviews are in English; a translation is a page of its own next to it (`index.ru.mdx`, versioned), and the
 * site shows the English one while it is missing.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { content, mdx, root, summary, writeMeta, writePage } from './lib.ts';

const REPOSITORY = 'https://github.com/FlippoSoftware/flippo-ui/blob/main';

/** The packages of the site, in the order of the sidebar, with the title of their folder. */
export const PACKAGES: { name: string; title: string; ru?: string }[] = [
    { name: 'store', title: 'Store' },
    { name: 'core-components', title: 'Core components', ru: 'Ядро компонентов' },
    { name: 'react-store', title: 'React store', ru: 'Стор в React' },
    { name: 'react-components', title: 'React components', ru: 'React-компоненты' },
    { name: 'web-components', title: 'Web components', ru: 'Веб-компоненты' },
    { name: 'component-styles', title: 'Component styles', ru: 'Стили компонентов' },
    { name: 'ui-kit-react', title: 'UI kit for React', ru: 'UI-кит для React' },
    { name: 'ui-kit-web', title: 'UI kit for web components', ru: 'UI-кит на веб-компонентах' }
];

/** Sections for the contributors of the package, not for its users. */
const DEVELOPMENT = /^(Development|Scripts|Source layout)$/;
const SECTION = /^## (.+)$/;
const TOC_LINE = /^- \[[^\]]+\]\(#[^)]+\)$/;
const LINK = /\]\((\.{1,2}\/[^)#\s]*)(#[^)]*)?\)/g;

function withoutSections(markdown: string): string {
    const lines = markdown.split('\n');
    const kept: string[] = [];
    let skipping = false;
    let fence = false;
    for (const line of lines) {
        if (line.startsWith('```')) {
            fence = !fence;
        }
        const section = fence ? null : line.match(SECTION);
        if (section) {
            skipping = DEVELOPMENT.test(section[1]);
        }
        if (!(skipping || (!fence && TOC_LINE.test(line)))) {
            kept.push(line);
        }
    }
    return kept.join('\n');
}

/** `../store` → the page of the package; `./src/x.ts`, `../../README.md` → the file on GitHub. */
function rewriteLinks(markdown: string, folder: string): string {
    return markdown.replace(LINK, (_, path: string, hash = '') => {
        const target = join('packages', folder, path).replace(/\\/g, '/');
        const sibling = target.match(/^packages\/([\w-]+)\/?(README\.md)?$/)?.[1];
        if (sibling && PACKAGES.some((item) => item.name === sibling)) {
            return `](../${sibling}/index.mdx${hash})`;
        }
        return `](${REPOSITORY}/${target}${hash})`;
    });
}

export function generateOverviews(): number {
    for (const item of PACKAGES) {
        const readme = readFileSync(join(root, 'packages', item.name, 'README.md'), 'utf8');
        const body = rewriteLinks(withoutSections(readme.replace(/^# .+\n+/, '')), item.name);
        const description = summary(body.split('\n\n').find((paragraph) => !paragraph.startsWith('>') && !paragraph.startsWith('-')));
        writePage(join(content, item.name, 'index.mdx'), {
            title: `@flippo-software/${item.name}`,
            description: description?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
            body: mdx(body)
        });
        // The overview, the guides of the folder (the kits' themes), the generated API reference.
        const pages = existsSync(join(content, item.name, 'api')) ? ['index', '...', 'api'] : ['index', '...'];
        writeMeta(join(content, item.name, 'meta.json'), { title: item.title, pages });
        writeMeta(join(content, item.name, 'meta.ru.json'), { title: item.ru ?? item.title, pages });
    }
    return PACKAGES.length;
}
