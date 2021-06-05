import {getChanges} from "./explore-git";

test('mars-rover repo has 5 commits', () => {
    getChanges().then(value => {
            expect(value.length).toBe(5)
        }
    )
})