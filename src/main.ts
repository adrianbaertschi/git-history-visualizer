import {ForceDirectedGraph} from "./d3/force-directed-graph";
import {getChanges} from "./git/git-client";
import * as LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import {parseCommit} from "./d3/tree-builder";

(async function () {
    const fs = new LightningFS('fs')
    const commits = await getChanges(fs, http);

    const initialTree = parseCommit(commits[0]);
    // @ts-ignore
    const graph = new ForceDirectedGraph(initialTree)
    for (let i = 1; i < commits.length; i++) {

        const commit = commits[i];
        console.log("Commit id ", commit.commit)

        for (const file of commit.files) {
            // console.log(file.type, file.path)
            await new Promise(r => setTimeout(r, 500));

            if (file.type === 'add') {
                // graph.addNode(file.path);
            } else if (file.type === 'delete') {
                graph.remove(file.path)
            }
        }
    }

})();