import {readFile} from 'node:fs/promises';

// Get target markdown files from CLI arguments or fall back to default files
const files = process.argv.slice(2);
const targets = files.length > 0 ? files : ['README.md', 'emerging.md', 'unmaintained.md'];

// Regular expression to extract HTTP/HTTPS hyperlinks from Markdown links: [text](http://...)
const markdownLink = /\]\((https?:\/\/[^()\s]+(?:\([^()\s]*\)[^()\s]*)*)\)/g;
const urls = new Set();

// Extract all unique URLs from the target files
for (const target of targets) {
	const content = await readFile(target, 'utf8');

	for (const match of content.matchAll(markdownLink)) {
		urls.add(match[1]);
	}
}

// Convert unique URLs set to a sorted list/queue
const queue = [...urls].sort();
const results = [];
let nextIndex = 0;

/**
 * Checks a single URL's status by sending a fetch request with a timeout.
 * 
 * @param {string} url - The URL to check.
 * @returns {Promise<{kind: string, status: number|string, url: string}>} The check result details.
 */
const check = async url => {
	try {
		const response = await fetch(url, {
			headers: {
				'user-agent': 'awesome-calculators-link-check/1.0',
			},
			redirect: 'follow',
			signal: AbortSignal.timeout(15_000), // Timeout the request after 15 seconds
		});

		// 404 (Not Found) or 410 (Gone) explicitly indicate broken links
		if (response.status === 404 || response.status === 410) {
			return {kind: 'broken', status: response.status, url};
		}

		// response.ok (2xx) means it’s fully reachable.
		// Certain status codes (401, 403, 405, 429) can occasionally represent normal
		// protected endpoints, rate limits, or anti-bot blocks, so we count them as reachable.
		if (response.ok || [401, 403, 405, 429].includes(response.status)) {
			return {kind: 'reachable', status: response.status, url};
		}

		// Other non-ok statuses (e.g., 500, 502) are flagged as warnings
		return {kind: 'warning', status: response.status, url};
	} catch (error) {
		// Capture and warn on system exceptions (e.g., DNS lookup failures or request timeouts)
		return {kind: 'warning', status: error.name, url};
	}
};

/**
 * An asynchronous worker loop that processes URLs from the shared queue sequentially.
 */
const worker = async () => {
	while (nextIndex < queue.length) {
		const index = nextIndex;
		nextIndex += 1;
		const res = await check(queue[index]);
		results[index] = res;
		console.log(`${res.kind.toUpperCase()} ${res.status} ${res.url}`);
	}
};

// Spawn up to 8 concurrent workers to process the queue in parallel
await Promise.all(Array.from({length: Math.min(8, queue.length)}, worker));

const broken = results.filter(result => result.kind === 'broken');
const warnings = results.filter(result => result.kind === 'warning');

// Log any broken links and warnings found at the end
if (broken.length > 0 || warnings.length > 0) {
	console.log('\n--- Broken & Warning Links Summary ---');
	for (const result of [...broken, ...warnings]) {
		console.log(`${result.kind.toUpperCase()} ${result.status} ${result.url}`);
	}
}

// Log a summary of the checked links
console.log(`\nChecked ${results.length} links: ${results.length - broken.length - warnings.length} reachable, ${warnings.length} warnings, ${broken.length} broken.`);

// Set process exit code to 1 if any broken links were found, triggering test/CI failure
if (broken.length > 0) {
	process.exitCode = 1;
}
