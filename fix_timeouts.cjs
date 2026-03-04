const fs = require('fs');

for (let i = 1; i <= 19; i++) {
    const filename = `tests/web-dev/ch${i.toString().padStart(2, '0')}.spec.ts`;
    if (!fs.existsSync(filename)) continue;
    let content = fs.readFileSync(filename, "utf-8");
    if (!content.includes('test.setTimeout(')) {
        content = content.replace(/test\('.*?', async \(\{ page \}\) => \{/, (match) => match + '\n        test.setTimeout(90000);');
        fs.writeFileSync(filename, content);
    } else {
        content = content.replace(/test\.setTimeout\(\d+\);/g, 'test.setTimeout(90000);');
        fs.writeFileSync(filename, content);
    }
}
console.log("Updated test timeouts for all 19 files.");
