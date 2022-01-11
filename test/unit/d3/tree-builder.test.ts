import { parseFiles, Tree } from '../../../src/d3/tree-builder'

test('empty list', () => {
  const s = parseFiles([])
  const expected: Tree = {
    name: 'root', path: 'root', children: []
  }
  expect(s).toStrictEqual(expected)
})

test('one file in root', () => {
  const s = parseFiles(['a'])
  const expected: Tree = {
    name: 'root',
    path: 'root',
    children: [{ name: 'a', path: 'root/a', children: [] }]
  }
  expect(s).toStrictEqual(expected)
})

test('parent a with two children b and c', () => {
  const s = parseFiles(['a/b', 'a/c'])
  const expected: Tree = {
    name: 'root',
    path: 'root',
    children: [
      {
        name: 'a',
        path: 'root/a',
        children: [
          { name: 'b', path: 'root/a/b', children: [] },
          { name: 'c', path: 'root/a/c', children: [] }
        ]
      }
    ]
  }
  expect(s).toStrictEqual(expected)
})
