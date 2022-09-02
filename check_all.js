const core = require('@actions/core');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const check_all_fnc = async (check_all_exclude, file_types, search_term, should_fail) => {
    var occurences = ""
    var occurences_count = 0
    const { stdout, stderr } = await exec(`git ls-files -- '${check_all_exclude}' | grep -E '${ file_types }' | xargs`);
    if (stderr) {
        core.setFailed(stderr);
        return;
    }

    const files = stdout.split(" ").map(file => file.trim())
    core.setOutput("checked-files", files)
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
                core.setOutput("occurences", occurences)
                core.setOutput("occurences_count", occurences_count)
                core.setFailed(`Found ${ occurences_count } occurences of ${ search_term }\n${ occurences }`);
            }else{
                core.setOutput("occurences", occurences)
                core.setOutput("occurences_count", occurences_count)
                core.warning(`Found ${ occurences_count } occurences of ${ search_term }\n${ occurences }`);
            }
        }else{
            core.setOutput("occurences", occurences)
            core.setOutput("occurences_count", occurences_count)
            core.notice(`Found ${ occurences_count } occurences of ${ search_term }`);
        }
    })
}

module.exports = check_all_fnc
