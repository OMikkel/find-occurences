const core = require('@actions/core');
const github = require('@actions/github');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const run = async () => {
    try {
        const before = core.getInput("before")
        const after = core.getInput("after")
        const search_term = core.getInput("search-term")
        const file_types = core.getInput("file-types")
        const should_fail = core.getInput("should-fail")
        var occurences = ""
        var occurences_count = 0

        try {
            const { stdout, stderr } = await exec(`git diff --name-only --diff-filter=ACMRT origin/${ before }...origin/${ after } | grep -E '${ file_types }' | xargs`);
            if (stderr) {
                core.setFailed(stderr);
                return
            }
            const files = stdout.split(" ").map(file => file.trim())
            core.debug(files)

            const mapFiles = files.map(async file => {
                try {
                    const { stdout, stderr } = await exec(`grep --color=always -H -n -E '${ search_term }' ./${ file }`);
                    if (stderr) {
                        return
                    }
                    core.debug("stdout: " + stdout)
                    occurences_count += stdout.split("\n").length - 1
                    occurences += stdout + "\n"
                } catch (error) {
                    return
                }
            })

            return Promise.all(mapFiles)
            .then(() => {
                if (occurences.length > 0) {
                    if (should_fail == "true") {
                        core.setFailed(`Found ${ occurences_count } occurences of ${ search_term }\n${ occurences }`);
                    }else{
                        core.warning(`Found ${ occurences_count } occurences of ${ search_term }\n${ occurences }`);
                    }
                }
            })
        } catch (error) {
            core.setFailed(error.message);
            return
        }

        
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()