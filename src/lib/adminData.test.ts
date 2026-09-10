import { describe, it, expect, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// adminData resolves paths under <cwd>/public/data. Point cwd at a temp dir.
const realCwd = process.cwd();
let tmpRoot = '';

async function setup() {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'admindata-'));
    await fs.mkdir(path.join(tmpRoot, 'public', 'data'), { recursive: true });
    process.chdir(tmpRoot);
    // import fresh so process.cwd() is captured lazily inside the functions
    return await import('./adminData');
}

afterEach(async () => {
    process.chdir(realCwd);
    if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('adminData', () => {
    it('round-trips and writes with the per-file indent + trailing newline', async () => {
        const { readData, writeData } = await setup();
        await writeData('projects.json', [{ id: 'a' }]);
        const raw = await fs.readFile(path.join(tmpRoot, 'public/data/projects.json'), 'utf8');
        expect(raw).toBe('[\n  {\n    "id": "a"\n  }\n]\n'); // 2-space indent
        expect(await readData('projects.json')).toEqual([{ id: 'a' }]);

        await writeData('people.json', { Faculty: [] });
        const rawP = await fs.readFile(path.join(tmpRoot, 'public/data/people.json'), 'utf8');
        expect(rawP).toBe('{\n    "Faculty": []\n}\n'); // 4-space indent
    });

    it('creates a .bak of the previous contents and leaves no .tmp', async () => {
        const { writeData } = await setup();
        await writeData('blogs.json', [{ id: 1 }]);
        await writeData('blogs.json', [{ id: 2 }]);
        const bak = await fs.readFile(path.join(tmpRoot, 'public/data/blogs.json.bak'), 'utf8');
        expect(JSON.parse(bak)).toEqual([{ id: 1 }]);
        const entries = await fs.readdir(path.join(tmpRoot, 'public/data'));
        expect(entries.some((e) => e.includes('.tmp'))).toBe(false);
    });

    it('throws (does not return []) on missing or invalid JSON', async () => {
        const { readData } = await setup();
        await expect(readData('missing.json')).rejects.toThrow();
        await fs.writeFile(path.join(tmpRoot, 'public/data/bad.json'), '{ not json');
        await expect(readData('bad.json')).rejects.toThrow();
    });
});
