/**
 * Patches Next.js generate-build-id so build succeeds when config.generateBuildId
 * is not a function (e.g. in some ESM/Windows environments).
 * Never fails npm install: catch errors and exit 0.
 */
const fs = require("fs");
const path = require("path");

function main() {
  const file = path.join(
    __dirname,
    "../node_modules/next/dist/build/generate-build-id.js",
  );

  if (!fs.existsSync(file)) return;

  let code = fs.readFileSync(file, "utf8");
  if (code.includes('typeof generate === "function"')) return;

  const patched = code
    .replace(
      /let buildId = await generate\(\);/,
      'let buildId = typeof generate === "function" ? await generate() : null;',
    )
    .replace(
      /if \(buildId === null\) \{/,
      "if (buildId === null || buildId === undefined) {",
    );
  if (patched !== code) fs.writeFileSync(file, patched);
}

try {
  main();
} catch (_) {}
process.exit(0);
