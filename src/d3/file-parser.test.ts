import {parseFiles, Tree} from "./file-parser";

test('empty list', () => {
    let s = parseFiles([]);
    const expected: Tree = {
        name: "root", children: []
    };
    expect(s).toStrictEqual(expected)
});

test('one file in root', () => {
    let s = parseFiles(['a']);
    const expected: Tree = {
        name: "root",
        children: [{name: 'a', "children": []}]
    };
    expect(s).toStrictEqual(expected)
});

test('parent a with two children b and c', () => {
    let s = parseFiles(['a/b', 'a/c']);
    const expected: Tree = {
        name: "root",
        children: [
            {
                name: "a",
                children: [
                    {name: "b", "children": []},
                    {name: "c", "children": []},
                ]
            }
        ]
    };
    expect(s).toStrictEqual(expected)
});

