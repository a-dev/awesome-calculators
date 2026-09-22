import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const filenames = ['README.md', 'emerging.md', 'unmaintained.md'];
const documents = new Map(await Promise.all(filenames.map(async filename => [
	filename, await readFile(filename, 'utf8'),
])));
const slug = heading => heading.toLowerCase().replace(/[^\w\s-]/g, '').replace(/ /g, '-');
const categories = document => [...document.matchAll(/^(#{2,3}) (.+)$/gm)]
	.filter(([, , title]) => !['Contents', 'Contributing', 'Footnotes'].includes(title))
	.map(([, depth, title]) => `${depth} ${title}`);

assert.deepEqual(categories(documents.get('emerging.md')), categories(documents.get('README.md')),
	'Emerging must mirror the README category headings and order.');

const names = new Set();
const urls = new Set();
const sections = new Map();

for (const [filename, document] of documents) {
	let section;
	const entries = new Map();
	sections.set(filename, entries);
	for (const [index, line] of document.split('\n').entries()) {
		const heading = /^#{2,3} (.+)$/.exec(line);
		if (heading) {
			section = slug(heading[1]);
			entries.set(section, []);
		}
		if (!line.startsWith('- [') || !line.includes(' · **Price:**')) continue;
		const location = `${filename}:${index + 1}`;
		const entry = /^- \[(.+?)\]\((https?:\/\/\S+)\) - (.+) · \*\*Price:\*\* (.+) · \*\*License:\*\* (.+)\.$/.exec(line);
		assert.ok(entry, `${location}: use the documented entry format.`);
		const [, name, url] = entry;
		const plain = line.replace(/^- \[.+?\]\(https?:\/\/\S+\) - /, '')
			.replace(/ · \*\*Source:\*\* \[[^\]]+\]\(https?:\/\/\S+\)/, '');
		assert.ok(!/\[[^\]]*\](?:\(|\[)|<\/?a\b|https?:\/\//i.test(plain),
			`${location}: link only the application name and optional Source field.`);
		const key = name.toLowerCase();
		assert.ok(!names.has(key) && !urls.has(url), `${location}: duplicate application across lists.`);
		names.add(key);
		urls.add(url);
		if (section) entries.get(section).push(name);
	}
	for (const [category, categoryNames] of entries) {
		assert.deepEqual(categoryNames, [...categoryNames].sort((a, b) => a.localeCompare(b, 'en', {sensitivity: 'base'})),
			`${filename}#${category}: sort applications alphabetically.`);
	}

	// Verify local navigation, including table-of-contents anchors.
	for (const [, target, anchor] of document.matchAll(/\]\((README\.md|emerging\.md|unmaintained\.md)?#([^\s)]+)\)/g)) {
		const destination = documents.get(target || filename);
		const anchors = [...destination.matchAll(/^#{1,6} (.+)$/gm)].map(([, title]) => slug(title));
		assert.ok(anchors.includes(anchor), `${filename}: missing anchor ${target || filename}#${anchor}.`);
	}
}

const readme = documents.get('README.md');
const emerging = sections.get('emerging.md');
let section;
const linked = new Set();
for (const line of readme.split('\n')) {
	const heading = /^#{2,3} (.+)$/.exec(line);
	if (heading) section = slug(heading[1]);
	for (const [, anchor] of line.matchAll(/\]\(emerging\.md#([^)]+)\)/g)) {
		assert.equal(anchor, section, 'Place the Emerging link in its matching README category.');
		assert.ok(emerging.get(anchor)?.length, 'Do not link to an empty Emerging category.');
		assert.ok(!linked.has(anchor), 'Use one Emerging link per category.');
		linked.add(anchor);
	}
}
for (const [anchor, entries] of emerging) {
	if (entries.length) assert.ok(linked.has(anchor), `README is missing the Emerging link for ${anchor}.`);
}

console.log(`Checked ${names.size} entries across ${filenames.length} lists and their category links.`);
