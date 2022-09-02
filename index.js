const core = require('@actions/core');
const github = require('@actions/github');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const run = async () => {
    try {
        const before_sha = core.getInput("before-sha")
        const after_sha = core.getInput("after-sha")
        const search_term = core.getInput("search-term")
        var occurences = ""
        const { stdout, stderr } = await exec(`git diff --name-only --diff-filter=ACMRT ${ before_sha } ${ after_sha } | grep -E '(.ts|.js|.tsx|.jsx)$' | xargs`);
        if (stderr) {
            core.setFailed(stderr);
            return
        }
        core.setOutput("all", stdout);
        const files = stdout.split(" ").map(file => file.trim())
        core.debug(files)
        const mapFiles = files.map(async file => {
            try {
                const { stdout, stderr } = await exec(`grep --color=always -H -n -E '${ search_term }' ./${ file }`);
                if (stderr) {
                    return
                }
                core.debug("stdout: " + stdout)
                occurences += stdout
            } catch (error) {
                return
            }
        })

        return Promise.all(mapFiles)
        .then(() => {
            core.setOutput("occurences", occurences);
        })
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()