# Git History Visualizer

Pet project to improve my web development skills by re-creating something like [Gource](https://gource.io/) in the browser.


Run it:
- `npm run start`
- http://localhost:8080


## Tasks
- [x] Create tree from directory struct
- [x] Create a visual graph from tree
- [x] Parse git commit to tree
- [ ] Generate series of trees from git log
- [ ] Create animation from tree changes

### Journal
#### 30.05.2021
Problem: can only add elements to links and nodes when the simulation is not running, otherwise values are NaN
- https://stackoverflow.com/questions/9539294/adding-new-nodes-to-force-directed-layout
- https://stackoverflow.com/questions/46467114/d3-v3-force-layout-gracefully-add-remove-nodes-without-refresh
- https://jsfiddle.net/samollason/z3rwpcxp/27/

#### 05.06.2021
Found solution for update problem
- Extract simulation creation out of `update()`
- Set the nodes of simulation inside `update()`
- Restart the simulation with some `targetAlpha`

Trying to parse git logs to see what files have been added/modified/deleted in each commit.
(Same as `git log --pretty=format:user:%aN%n%ct  --reverse --raw` or ` git log --name-status --reverse`) using walk api from isomorphic-git

Ported git code to run in the browser. Only tricky part was to find out how to make `Buffer` work. Luckily there is a 
Webpack 5 plugin (`node-polyfill-webpack-plugin`). 

#### 06.06.2021
Adding high-level tests for git operations. Injecting filesystem, http etc as dependencies and using node versions for
tests and browser versions for real application.
Use first commit of git log to render the graph.

#### 12.06.2021
Started working on updating the graph with changes. Remove seems to work with demo repo.
Adding is tricky because we need to find where to insert, also a lot of the changes are
renames which is treated as two changes (one for delete and one for add).

Could be a problem that we only have the name of the file in the `Tree` struct, would be ideal to have the full path to 
have unique identifiers.

### Links
https://gource.io/

https://github.com/d3/d3-hierarchy/blob/master/README.md#tree

https://observablehq.com/tutorials

https://observablehq.com/@d3/radial-tidy-tree?collection=@d3/d3-hierarchy
https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
https://observablehq.com/@d3/modifying-a-force-directed-graph?collection=@d3/d3-force
https://jsfiddle.net/samollason/8m67uek3/

https://github.com/kpj/GitViz