import * as git from 'isomorphic-git'
import {
  CallbackFsClient,
  HttpClient,
  ProgressCallback,
  PromiseFsClient,
  ReadCommitResult,
  WalkerEntry
} from 'isomorphic-git'

export interface Commit {
  commit: string
  files: FileChange[]
}

export interface FileChange {
  path: string
  operation: FileOperation
  isDirectory: boolean
}

export type FileOperation = 'ADD' | 'REMOVE' | 'MODIFY'

export class GitRepo {
  private readonly fs: CallbackFsClient | PromiseFsClient
  private readonly http: HttpClient
  private readonly dir: string
  private readonly onProgress: ProgressCallback | undefined

  constructor (fs: CallbackFsClient | PromiseFsClient, http: HttpClient, cloneDir?: string, onProgress?: ProgressCallback) {
    this.fs = fs
    this.http = http
    this.dir = cloneDir ?? '/'
    this.onProgress = onProgress
  }

  async clone (url: string): Promise<GitRepo> {
    await git.clone({
      fs: this.fs,
      http: this.http,
      dir: this.dir,
      url: url,
      corsProxy: 'https://cors.isomorphic-git.org',
      onProgress: this.onProgress,
      singleBranch: true
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
      operation: 'ADD',
      isDirectory: false
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
          operation: 'ADD',
          isDirectory: await B.type() === 'tree'
        }
      }

      if (B == null) {
        return {
          path: filepath,
          operation: 'REMOVE',
          isDirectory: await A.type() === 'tree'
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
          operation: 'MODIFY',
          isDirectory: false
        }
      }
      if (oidA === undefined) {
        return {
          path: filepath,
          operation: 'ADD',
          isDirectory: false
        }
      }
      if (oidB === undefined) {
        return {
          path: filepath,
          operation: 'REMOVE',
          isDirectory: false
        }
      }
    }
  })
}
