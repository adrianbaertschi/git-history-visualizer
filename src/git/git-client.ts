import * as git from 'isomorphic-git'
import { CallbackFsClient, HttpClient, PromiseFsClient, ReadCommitResult, WalkerEntry } from 'isomorphic-git'

export interface Commit {
  commit: string
  files: FileChange[]
}

export interface FileChange {
  path: string
  operation: FileOperation
}

export enum FileOperation {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  MODIFY = 'MODIFY'
}

export const getChanges = async (fs: CallbackFsClient | PromiseFsClient, http: HttpClient, cloneDir?: string): Promise<Commit[]> => {
  const dir = cloneDir ?? '/'
  await git.clone({
    fs,
    http,
    dir,
    url: 'https://github.com/adrianbaertschi/mars-rover',
    corsProxy: 'https://cors.isomorphic-git.org'
  })
  const commits: ReadCommitResult[] = await git.log({
    fs,
    dir
  })
  commits.reverse()

  const firstCommit = commits[0]
  const filesOfFirsCommit = (await git.listFiles({
    fs,
    dir: dir,
    ref: firstCommit.oid
  }))
    .map((filepath: string) => ({
      path: filepath,
      operation: FileOperation.ADD
    }))

  const result: Commit[] = []
  result.push({
    commit: firstCommit.oid,
    files: filesOfFirsCommit
  })

  for (let i = 0; i < commits.length - 1; i++) {
    const currentCommit = commits[i]
    const nextCommit = commits[i + 1]
    const files = await getFileStateChanges(currentCommit.oid, nextCommit.oid, dir, fs)
    result.push({
      commit: nextCommit.oid,
      files: files
    })
  }
  return result
}

// https://isomorphic-git.org/docs/en/snippets
async function getFileStateChanges (commitHash1: string, commitHash2: string, dir: any, fs: CallbackFsClient | PromiseFsClient): Promise<FileChange[]> {
  return await git.walk({
    fs,
    dir,
    trees: [git.TREE({ ref: commitHash1 }), git.TREE({ ref: commitHash2 })],
    map: async (filepath: string, [A, B]: WalkerEntry[] | any): Promise<FileChange | undefined> => {
      // ignore directories
      if (filepath === '.') {
        return
      }
      if (A == null) {
        return {
          path: filepath,
          operation: FileOperation.ADD
        }
      }

      if (B == null) {
        return {
          path: filepath,
          operation: FileOperation.REMOVE
        }
      }

      if ((await A.type()) === 'tree' || (await B.type()) === 'tree') {
        return
      }

      // generate ids
      const oidA = await A.oid()
      const oidB = await B.oid()

      // determine modification type
      if (oidA === oidB) {
        return // No change in file
      }
      if (oidA !== oidB) {
        return {
          path: filepath,
          operation: FileOperation.MODIFY
        }
      }
      if (oidA === undefined) {
        return {
          path: filepath,
          operation: FileOperation.ADD
        }
      }
      if (oidB === undefined) {
        return {
          path: filepath,
          operation: FileOperation.REMOVE
        }
      }
    }
  })
}
