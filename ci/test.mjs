import github from "@actions/github";

const context = github.context;
const eventName = context.eventName;
console.log({ context: JSON.stringify(context, null, 2), eventName });
console.log({
    targetBranch,
    typeOfDeployment
})

const targetBranch = getTargetBranch();
const typeOfDeployment = getTypeOfDeployment();



function getTypeOfDeployment() {
    if (targetBranch === 'main') {
        return {
            dev: true,
            prod: false
        }
    }
    if (targetBranch.startsWith('release')) {
        return {
            dev: false,
            prod: true
        }
    }
    // UNKNOWN BRANCH
    console.error(`Unknown branch: ${targetBranch} - not sure how to tag this deployment`);
    return {
        dev: false,
        prod: false
    }
}


function getTargetBranch() {
    if (eventName === "pull_request") {
        return context.payload.pull_request?.base?.ref;
    }

    if (eventName === "push") {
        return context.ref?.replace('refs/heads/', '');
    }
    if (eventName === "merge_group") {
        return context.payload.merge_group.base_ref.replace('refs/heads/', '');
    }
    
    if (process.env.GITHUB_BASE_REF) {
        return process.env.GITHUB_BASE_REF;
    }

    throw new Error(`Unable to determine target branch for event type: ${eventName}`);
}