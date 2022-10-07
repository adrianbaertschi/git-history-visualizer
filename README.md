# Git History Visualizer

Pet project to improve my web development skills by re-creating something like [Gource](https://gource.io/) in the
browser.

Run it locally:

- `npm install`
- `npm run start`
- Go to http://localhost:8080

## Tasks

- [x] Create tree from directory struct
- [x] Create a visual graph from tree
- [x] Parse git commit to tree
- [x] Generate series of trees from git log
- [x] Create animation from tree changes
    - [x] Removal
    - [x] Add
    - [x] Modify
- [ ] UI
    - [x] Input for repo url
    - [ ] Timeline/progress bar
    - [x] Statistics (no. of files per type)
    - [x] Loading screen
    - [ ] General styling
    - [ ] Reset
    - [ ] Error handling input
- [ ] Graph
    - [ ] Blur effect
    - [ ] Color nodes by file type
    - [ ] Cool down faster
    - [ ] Zoom, fullscreen, etc.
- [x] Deployment
- [ ] Get rid of special handling of first commit


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
(Same as `git log --pretty=format:user:%aN%n%ct --reverse --raw` or ` git log --name-status --reverse`) using walk api
from isomorphic-git

Ported git code to run in the browser. Only tricky part was to find out how to make `Buffer` work. Luckily there is a
Webpack 5 plugin (`node-polyfill-webpack-plugin`).

#### 06.06.2021

Adding high-level tests for git operations. Injecting filesystem, http etc as dependencies and using node versions for
tests and browser versions for real application. Use first commit of git log to render the graph.

#### 12.06.2021

Started working on updating the graph with changes. Remove seems to work with demo repo. Adding is tricky because we
need to find where to insert, also a lot of the changes are renames which is treated as two changes (one for delete and
one for add).

Could be a problem that we only have the name of the file in the `Tree` struct, would be ideal to have the full path to
have unique identifiers.

#### 13.06.2021

Learned about classes in TS and refactored force-directed-graph. Now it's possible to test it using jest and jsdom.
Removed the filter from git log of directory creation. Now I have a separate "create a directory" event before the "
create a new file" event.

Implemented the add feature. Commits which add files should now reflect on the graph. Still have to check if the graph
is update correctly in call cases.

Added the full path to every `Tree` object to have a unique id.

##### 16.06.2021

Introduced enum to model file change operations (ADD, REMOVE, MODIFY). Played around with the modify events, idea is
to "flash" the nodes quickly. Learned about special characters in CSS selectors and `CSS.escape()`.

##### 26.06.2021

Added eslint config and started fixing issues. Will have to look into organizing jest test to make it more readable.

##### 26.06.2021

Replace enum with union type, refactor graph test and reuse setup code, refactor git client to class

#### 24.07.2021

Trying to add the log component and thought Vue.js is a good lib. Fiddled around with Webpack because Vue 3 would
abstract that away with Vue CLI. Got it working with hints
from [here](https://github.com/microsoft/TypeScript-Vue-Starter). Learned
about [Single File Components](https://v3.vuejs.org/guide/single-file-component.html#single-file-components) in Vue.js.
Adding replay logic from main.ts into Vue component. Adding another component to show the changes as text.

#### 28.10.2021

Adding input field to enter the url of the git repo. Got some errors when cloning the second repo, so will do a clean on
the LightningFs object before the run. Learned about `v-modal` of Vue.js. Still got lint errors
because `vue/no-mutating-props`, not sure how to fix. Added some logic and default values to make multiple runs
possible.

#### 05.01.2022
Add component that show progress of cloning and walking through commits (https://isomorphic-git.org/docs/en/onProgress)

#### 11.01.2022

Component testing. Created demo project witch Vue CLI. This would handle a lot of the config. Decided against it to have
fewer layers of abstraction. Use https://next.vue-test-utils.vuejs.org for Vue.js 3 compatibility.

### Links

- https://gource.io/
- https://github.com/d3/d3-hierarchy/blob/master/README.md#tree
- https://observablehq.com/tutorials
- https://observablehq.com/@d3/radial-tidy-tree?collection=@d3/d3-hierarchy
- https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
- https://observablehq.com/@d3/modifying-a-force-directed-graph?collection=@d3/d3-force
- https://jsfiddle.net/samollason/8m67uek3/
- https://github.com/kpj/GitViz
