import * as git from "isomorphic-git";
import {CallbackFsClient, HttpClient, PromiseFsClient, ReadCommitResult, WalkerEntry} from "isomorphic-git";

export interface Commit {
    commit: string
    files: FileChange[]
}

export interface FileChange {
    path: string
    type: string
}

export const getChanges = async (fs: CallbackFsClient | PromiseFsClient, http: HttpClient, cloneDir?: string): Promise<Commit[]> => {
    const dir = cloneDir ? cloneDir : '/'
    await git.clone({
        fs, http, dir, url: 'https://github.com/adrianbaertschi/mars-rover',
        corsProxy: 'https://cors.isomorphic-git.org',
    })
    let commits: ReadCommitResult[] = await git.log({fs, dir});
    commits.reverse();

    let firstCommit = commits[0];
    const filesOfFirsCommit = (await git.listFiles({fs, dir: dir, ref: firstCommit.oid}
    )).map((filepath: string) => ({
        path: filepath,
        type: 'add',
    }));

    const result: Commit[] = [];
    result.push({
        commit: firstCommit.oid,
        files: filesOfFirsCommit
    })

    for (let i = 0; i < commits.length - 1; i++) {
        const currentCommit = commits[i];
        const nextCommit = commits[i + 1];
        const files = await getFileStateChanges(currentCommit.oid, nextCommit.oid, dir, fs);
        result.push({commit: nextCommit.oid, files: files})
    }
    return result;
}

// https://isomorphic-git.org/docs/en/snippets
async function getFileStateChanges(commitHash1: string, commitHash2: string, dir: any, fs: CallbackFsClient | PromiseFsClient) {
    return git.walk({
        fs,
        dir,
        trees: [git.TREE({ref: commitHash1}), git.TREE({ref: commitHash2})],
        map: async function (filepath: string, [A, B]: WalkerEntry[] | any) {
            // ignore directories
            if (filepath === '.') {
                return
            }
            if (A == null) {
                // console.log('A is null')
                return
            }

            if (B == null) {
                // console.log('A is null')
                return
            }

            if ((await A.type()) === 'tree' || (await B.type()) === 'tree') {
                return
            }

            // generate ids
            const Aoid = await A.oid()
            const Boid = await B.oid()

            // determine modification type
            if (Aoid === Boid) {
                return // No change in file
            }
            let type
            if (Aoid !== Boid) {
                type = 'modify'
            }
            if (Aoid === undefined) {
                type = 'add'
            }
            if (Boid === undefined) {
                type = 'remove'
            }
            if (Aoid === undefined && Boid === undefined) {
                console.log('Something weird happened:')
                console.log(A)
                console.log(B)
            }

            return {
                path: filepath,
                type: type,
            }
        },
    })
}