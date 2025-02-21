import github from "@actions/github";

const context = github.context;
const eventName = context.eventName;

const targetBranch = getTargetBranch();
const typeOfDeployment = getTypeOfDeployment();
const artifactName = getArtifactname();

console.log({
    targetBranch,
    typeOfDeployment,
    artifactName
})


function getArtifactname() {
    if (eventName === "pull_request") {
        return `pr-${context.payload.pull_request.number}`;
    }
    if (eventName === "merge_group") {
        const sha = [
            context.payload.merge_group.head_sha,
            context.payload.merge_group.base_sha,
            context.sha,
        ]
        console.log(sha);
        return `hehe`;
    }

    throw new Error(`Unable to determine artifact name for event type: ${eventName}`);
}


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
    if (eventName === "merge_group") {
        return context.payload.merge_group.base_ref.replace('refs/heads/', '');
    }
    
    throw new Error(`Unable to determine target branch for event type: ${eventName}`);
}