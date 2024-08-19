const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const fs = require('fs-extra');
const path = require('path');

// Plugin to copy files
const copyPlugin = {
  name: 'copy',
  setup(build) {
    build.onEnd(() => {
      fs.copySync(
        path.join(__dirname, 'src', 'css'),
        path.join(__dirname, 'dist', 'css'),
        { overwrite: true }
      );
      console.log('CSS files copied to dist/css');
    });
  },
};

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

// Function to bundle a React app for each view
async function buildWebview(entryFile, outFile) {
	return esbuild.build({
	  entryPoints: [entryFile],
	  bundle: true,
	  format: 'iife',
	  minify: production,
	  sourcemap: !production,
	  outfile: outFile,
	  loader: {
		'.js': 'jsx',
		'.css': 'file',
	  },
	  define: {
		'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
	  },
	  plugins: [esbuildProblemMatcherPlugin
	  ],
	  treeShaking: true,
	});
  }
  
  async function main() {
	  // Build the backend extension
	  const ctx = await esbuild.context({
		  entryPoints: [
			  'src/extension.ts'
		  ],
		  bundle: true,
		  format: 'cjs',
		  minify: production,
		  sourcemap: !production,
		  sourcesContent: false,
		  platform: 'node',
		  outfile: 'dist/extension.js',
		  external: ['vscode'],
		  logLevel: 'silent',
		  plugins: [
			  esbuildProblemMatcherPlugin,
			  copyPlugin
		  ],
	  });
  
	  if (watch) {
		  await ctx.watch();
	  } else {
		  await ctx.rebuild();
		  await ctx.dispose();
	  }
  
	  // Build the webviews (React apps)
	  await buildWebview('src/webviews/projectView.js', 'dist/projectView.js');
	  await buildWebview('src/webviews/settingsView.js', 'dist/settingsView.js');
	  await buildWebview('src/webviews/chatView.js', 'dist/chatView.js');
	  await buildWebview('src/webviews/testView.js', 'dist/testView.js');
  }
  
  main().catch((e) => {
	  console.error(e);
	  process.exit(1);
  });