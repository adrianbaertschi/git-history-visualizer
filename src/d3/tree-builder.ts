import { Commit } from '../git/git-client'

export const parseCommit = (commit: Commit): Tree => {
  const paths = commit.files.map(file => file.path)
  return parseFiles(paths)
}

export const parseFiles = (paths: string[]): Tree => {
  // Life-mission: try to understand this
  const children = paths.reduce((r: Tree[], path: string) => {
    path.split('/')
      .reduce((acc: Tree[] | undefined, currentName, i, pathSegments) => {
        let temp = acc?.find(t => t.name === currentName)
        if (temp == null) {
          const fullPath = pathSegments.slice(0, i + 1).join('/')
          acc?.push(temp = { name: currentName, path: `root/${fullPath}`, children: [] })
        }
        return temp?.children
      }, r)
    return r
  }, [])
  return { name: 'root', path: 'root', children }
}

export interface Tree {
  name: string
  path: string
  children?: Tree[]
}
