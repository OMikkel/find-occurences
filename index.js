const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("node:child_process");

try {
    const before_sha = core.getInput("before-sha")
    const after_sha = core.getInput("after-sha")
    exec(`git diff --name-only --diff-filter=ACMRT ${ before_sha } ${ after_sha } | grep --include=*.{js,jsx,ts,tsx} | xargs`, (err, output) => {
        if (err) {
            core.setFailed(err.message);
            return
        }
        core.setOutput("all", output);
    })
} catch (error) {
    core.setFailed(error.message);
}