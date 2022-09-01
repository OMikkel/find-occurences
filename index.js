const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("node:child_process");

try {
    exec("ls ./", (err, output) => {
        if (err) {
            core.setFailed(err.message);
            return
        }
        core.setOutput("ls", output);
    })
} catch (error) {
    core.setFailed(error.message);
}

//git diff --name-only --diff-filter=ACMRT ${{ github.event.before }} ${{ github.sha }} | xargs