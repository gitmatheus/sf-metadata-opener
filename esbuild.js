// esbuild.js
const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function build() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'info',
  });

  if (watch) {
    await ctx.watch();
    console.log('[watch] esbuild is watching...');
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
