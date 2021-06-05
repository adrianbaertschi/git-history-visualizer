Git
`node run explore-git.js`
https://isomorphic-git.org/en/

D3.js
- `npm run start`
- http://localhost:8080


TODO
- [ ] create tree from directory struct
- [ ] create animation from dir changes
- [ ] Parse git log to dir struct

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

### Links
https://gource.io/

https://github.com/d3/d3-hierarchy/blob/master/README.md#tree

https://observablehq.com/tutorials

https://observablehq.com/@d3/radial-tidy-tree?collection=@d3/d3-hierarchy
https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
https://observablehq.com/@d3/modifying-a-force-directed-graph?collection=@d3/d3-force
https://jsfiddle.net/samollason/8m67uek3/