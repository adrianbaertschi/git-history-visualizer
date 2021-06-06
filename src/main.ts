import forceDirectedGraph from "./d3/force-directed-graph";
import {getChanges} from "./git/git-client";
import * as LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import {parseCommit} from "./d3/tree-builder";

(async function () {
    const fs = new LightningFS('fs')
    const commits = await getChanges(fs, http);
    const tree = parseCommit(commits[0]);
    forceDirectedGraph(tree)
})();