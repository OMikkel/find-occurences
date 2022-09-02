const core = require('@actions/core');
const github = require('@actions/github');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const run = async () => {
    try {
        const before_sha = core.getInput("before-sha")
        const after_sha = core.getInput("after-sha")
        const { stdout, stderr } = await exec(`git diff --name-only --diff-filter=ACMRT ${ before_sha } ${ after_sha } | grep -E '(.ts|.js|.tsx|.jsx)$' | xargs`);
        if (stderr) {
            core.setFailed(stderr);
            return
        }
        core.setOutput("all", stdout);
        const files = stdout.split(" ").map(file => file.trim())
        core.debug(files)
        files.map(async file => {
            const { stdout, stderr } = await exec("grep -E 'console.log|console.error' ./" + file);
            if (stderr) {
                core.setFailed(stderr);
                return
            }
            core.debug("stdout: " + stdout)
        })
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()