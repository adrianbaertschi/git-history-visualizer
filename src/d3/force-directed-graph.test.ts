/**
 * @jest-environment jsdom
 */

import { Tree } from './tree-builder'
import { ForceDirectedGraph } from './force-directed-graph'

test('render root with one child', () => {
  const tree: Tree = {
    name: 'root',
    path: 'root',
    children: [{ name: 'a', path: 'root/a', children: [] }]
  }
  const graph = new ForceDirectedGraph(tree)

  expect(graph.nodes.length).toBe(2)
  expect(graph.nodes[0].data.name).toBe('root')
  expect(graph.nodes[1].data.name).toBe('a')

  expect(graph.links.length).toBe(1)
  expect(graph.links[0].source.data.name).toBe('root')
  expect(graph.links[0].target.data.name).toBe('a')
})

test('remove a leaf node', () => {
  const tree: Tree = {
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

  const graph = new ForceDirectedGraph(tree)
  expect(graph.nodes).toHaveLength(4)
  expect(graph.links).toHaveLength(3)

  graph.remove('root/a/b')

  expect(graph.nodes).toHaveLength(3)
  expect(graph.nodes[0].data.name).toBe('root')
  expect(graph.nodes[1].data.name).toBe('a')
  expect(graph.nodes[2].data.name).toBe('c')

  expect(graph.links).toHaveLength(2)
})

test('remove non-existing leaf throws error', () => {
  const tree: Tree = {
    name: 'root',
    path: 'root',
    children: [{ name: 'a', path: 'root/a' }]
  }

  const graph = new ForceDirectedGraph(tree)

  expect(() =>
    graph.remove('root/z')
  ).toThrow('Path root/z not found')
})

test('add node to root', () => {
  const tree: Tree = {
    name: 'root',
    path: 'root',
    children: [{ name: 'a', path: 'root/a', children: [] }]
  }
  const graph = new ForceDirectedGraph(tree)
  graph.addNode('root/a/b')

  expect(graph.nodes).toHaveLength(3)
  expect(graph.nodes[0].data.name).toBe('root')
  expect(graph.nodes[1].data.name).toBe('a')
  expect(graph.nodes[2].data.name).toBe('b')

  expect(graph.links).toHaveLength(2)
  expect(graph.links[0].source.data.name).toBe('root')
  expect(graph.links[0].target.data.name).toBe('a')
})

test('commit to existing file updates color', async () => {
  const tree: Tree = {
    name: 'root',
    path: 'root',
    children: [{ name: 'a', path: 'root/a', children: [] }]
  }
  const graph = new ForceDirectedGraph(tree)
  graph.modify('root/a')

  // wait fr transition to be completed
  await new Promise(r => setTimeout(r, 1000))

  const circles = graph.nodeContainer.selectChildren().nodes() as SVGAElement[]
  expect(circles).toHaveLength(2)

  expect(circles[0].getAttribute('fill')).toBe('#000')
  expect(circles[1].getAttribute('fill')).toBe('rgb(255, 0, 0)')
})

test('modify non-existing file throws error', async () => {
  const tree: Tree = {
    name: 'root',
    path: 'root',
    children: [{ name: 'a', path: 'root/a', children: [] }]
  }

  const graph = new ForceDirectedGraph(tree)
  expect(() => {
    graph.modify('root/b')
  }).toThrow('Node root/b not found')
})
