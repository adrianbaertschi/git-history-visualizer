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

export type FileOperation = 'ADD' | 'REMOVE' | 'MODIFY'

export class GitRepo {
  private readonly fs: CallbackFsClient | PromiseFsClient
  private readonly http: HttpClient
  private readonly dir: string

  constructor (fs: CallbackFsClient | PromiseFsClient, http: HttpClient, cloneDir?: string) {
    this.fs = fs
    this.http = http
    this.dir = cloneDir ?? '/'
  }

  async clone (url: string): Promise<GitRepo> {
    await git.clone({
      fs: this.fs,
      http: this.http,
      dir: this.dir,
      url: url,
      corsProxy: 'https://cors.isomorphic-git.org'
    })
    return this
  }

  async log (): Promise<Commit[]> {
    const commits: ReadCommitResult[] = await git.log({
      fs: this.fs,
      dir: this.dir
    })
    commits.reverse()

    const firstCommit = commits[0]
    const filesOfFirstCommit: FileChange[] = (await git.listFiles({
      fs: this.fs,
      dir: this.dir,
      ref: firstCommit.oid
    })).map((filepath: string) => ({
      path: filepath,
      operation: 'ADD'
    }))

    const result: Commit[] = []
    result.push({
      commit: firstCommit.oid,
      files: filesOfFirstCommit
    })

    for (let i = 0; i < commits.length - 1; i++) {
      const currentCommit = commits[i]
      const nextCommit = commits[i + 1]
      const files = await getFileStateChanges(currentCommit.oid, nextCommit.oid, this.dir, this.fs)
      result.push({
        commit: nextCommit.oid,
        files: files
      })
    }
    return result
  }
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
          operation: 'ADD'
        }
      }

      if (B == null) {
        return {
          path: filepath,
          operation: 'REMOVE'
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
          operation: 'MODIFY'
        }
      }
      if (oidA === undefined) {
        return {
          path: filepath,
          operation: 'ADD'
        }
      }
      if (oidB === undefined) {
        return {
          path: filepath,
          operation: 'REMOVE'
        }
      }
    }
  })
}
