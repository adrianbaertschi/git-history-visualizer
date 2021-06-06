import forceDirectedGraph from "./d3/force-directed-graph";
import {getChanges} from "./git/explore-git";
import * as LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import {dummyData} from "./d3/file-parser";

forceDirectedGraph(dummyData)

const fs = new LightningFS('fs')
getChanges(fs, http).then(value => console.log(value))