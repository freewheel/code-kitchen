// Note: this file will be used in getStaticProps and must use CJS
const fsp = require("fs/promises");
const path = require("path");
const fs = require("fs");

const entryFilePattern = /^index\..*\.[tj]sx?/;
const demosBaseDir = path.resolve(
  process.cwd(),
  "./lib/remote-source-examples"
);
// const demosBaseDir = path.resolve(process.cwd(), './pages/demos');

/**
 *
 * @param {string} pathOrDir
 * @returns {Promise<string[]>}
 */
async function getRemoteEntries(pathOrDir) {
  // check if dir is a directory
  const stat = await fsp.stat(pathOrDir);
  if (!stat.isDirectory()) {
    if (entryFilePattern.test(path.basename(pathOrDir))) {
      return [pathOrDir];
    }
    return [];
  }
  // build directory structure recursively
  const paths = await fsp.readdir(pathOrDir);
  const results = await Promise.all(
    paths.map(async (p) => {
      const fullPath = path.join(pathOrDir, p);
      return getRemoteEntries(fullPath);
    })
  );
  return results.flat();
}

async function getRemoteSourceExamples() {
  const paths = await getRemoteEntries(demosBaseDir);
  return paths.map((p) => {
    const entry = path.relative(demosBaseDir, p);
    return entry.substring(0, entry.lastIndexOf("/"));
  });
}

/**
 *
 * @param {string} entryDir
 * @returns {Promise<string[]>}
 */
async function getRemoteSourceFiles(entryDir) {
  const filenames = await fsp.readdir(path.join(demosBaseDir, entryDir));

  filenames.sort((a, b) => {
    // makes sure entry is at the top
    return entryFilePattern.test(a) ? -1 : 1;
  });

  const inputFiles = await Promise.all(
    filenames.map(async (filename) => {
      const content = await fsp.readFile(
        path.join(demosBaseDir, entryDir, filename),
        "utf8"
      );
      // Strip off page extension
      const newFilename = filename.replace(".page", "");
      return {
        code: content,
        filename: newFilename,
      };
    })
  );

  return inputFiles;
}

module.exports = {
  getDemos: getRemoteSourceExamples,
  getDemoFiles: getRemoteSourceFiles,
  getDemoEntries: getRemoteEntries,
};
