import {parseFiles, Tree} from "./tree-builder";

test("empty list", () => {
    let s = parseFiles([]);
    const expected: Tree = {
        name: "root", path: "root", children: []
    };
    expect(s).toStrictEqual(expected)
});

test("one file in root", () => {
    let s = parseFiles(["a"]);
    const expected: Tree = {
        name: "root",
        path: "root",
        children: [{name: "a", path: "root/a", "children": []}]
    };
    expect(s).toStrictEqual(expected)
});

test("parent a with two children b and c", () => {
    let s = parseFiles(["a/b", "a/c"]);
    const expected: Tree = {
        name: "root",
        path: "root",
        children: [
            {
                name: "a",
                path: "root/a",
                children: [
                    {name: "b", path: "root/a/b", "children": []},
                    {name: "c", path: "root/a/c", "children": []},
                ]
            }
        ]
    };
    expect(s).toStrictEqual(expected)
});