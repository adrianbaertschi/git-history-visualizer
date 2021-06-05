import forceDirectedGraph from "./d3/force-directed-graph";
import {getChanges} from "./git/explore-git";

forceDirectedGraph()
getChanges().then(value => console.log(value))