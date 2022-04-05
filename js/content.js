import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/data';

export async function fetchList() {
    const listResult = await fetch(`${dir}/_list.json`);
    const list = await listResult.json();
    return await Promise.all(
        list.map(async (path) => {
            const levelResult = await fetch(`${dir}/${path}.json`);
            const level = await levelResult.json();
            return {
                path,
                ...level,
            };
        })
    );
}

export async function fetchLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    list.forEach((level, rank) => {
        // Verification
        scoreMap[level.verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
        };
        const { verified } = scoreMap[level.verifier];
        verified.push({
            level: level.name,
            score: score(rank + 1, 100, level.percentToQualify),
        });

        // Records
        level.records.forEach((record) => {
            scoreMap[record.user] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };
            const { completed, progressed } = scoreMap[record.user];
            if (record.percent === 100) {
                completed.push({
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                });
                return;
            }

            progressed.push({
                level: level.name,
                score: score(rank + 1, record.percent, level.percentToQualify),
            });
        });
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return res.sort((a, b) => b.total - a.total);
}
