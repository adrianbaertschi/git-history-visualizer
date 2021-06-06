import forceDirectedGraph from "./d3/force-directed-graph";
import {getChanges} from "./git/explore-git";
import * as LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import {parseCommit} from "./d3/file-parser";

(async function () {
    const fs = new LightningFS('fs')
    const commits = await getChanges(fs, http);
    const tree = parseCommit(commits[0]);
    forceDirectedGraph(tree)
})();