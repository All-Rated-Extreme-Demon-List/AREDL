import { round, calculateScores } from "./score.js";

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = "/data";

export async function fetchList() {
    const listResult = await fetch(`${dir}/_list.json`);
    const packResult = await fetch(`${dir}/_packlist.json`);
    try {
        const list = await listResult.json();
        const packsList = await packResult.json();
        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    let packs = packsList.filter((x) =>
                        x.levels.includes(path)
                    );
                    return [
                        {
                            ...level,
                            packs,
                            path,
                            records: level.records.sort(
                                (a, b) => b.percent - a.percent
                            ),
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            })
        );
    } catch {
        console.error(`Failed to load list.`);
        return null;
    }
}

export async function fetchEditors() {
    try {
        const editorsResults = await fetch(`${dir}/_editors.json`);
        const editors = await editorsResults.json();
        return editors;
    } catch {
        return null;
    }
}

export async function fetchSupporters() {
    try {
        const supportersResults = await fetch(`${dir}/_supporters.json`);
        const supporters = await supportersResults.json();
        return supporters;
    } catch {
        return null;
    }
}

export async function fetchLeaderboard() {
    const list = await fetchList();
    const packResult = await (await fetch(`${dir}/_packlist.json`)).json();
    const scoreMap = {};
    const errs = [];
    const packMultiplier = 1.5;
    const scoreLookup = calculateScores(list.length)
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Verification
        const verifier =
            Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === level.verifier.toLowerCase()
            ) || level.verifier;
        scoreMap[verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
            packs: [],
        };
        const { verified } = scoreMap[verifier];
        verified.push({
            rank: rank + 1,
            level: level.name,
            score: scoreLookup[rank],
            link: level.verification,
            path: level.path,
        });
        // Records
        level.records.forEach((record) => {
            const user =
                Object.keys(scoreMap).find(
                    (u) => u.toLowerCase() === record.user.toLowerCase()
                ) || record.user;
            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
                packs: [],
            };

            const { completed, progressed } = scoreMap[user];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: scoreLookup[rank],
                    link: record.link,
                    path: level.path,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: scoreLookup[rank],
                link: record.link,
                path: level.path,
            });
        });
    });
    for (let user of Object.entries(scoreMap)) {
        let levels = [...user[1]["verified"], ...user[1]["completed"]].map(
            (x) => x["path"]
        );
        for (let pack of packResult) {
            if (pack.levels.every((e1) => levels.includes(e1))) {
                user[1]["packs"].push(pack);
            }
        }
        // for (let pack of user[1]["packs"]) {
        //     const packLevelScores = [];
        //     const allUserLevels = [
        //         ...user[1]["verified"],
        //         ...user[1]["completed"],
        //     ];
        //     for (let level of pack["levels"]) {
        //         let userLevel = allUserLevels.find((lvl) => lvl.path == level);
        //         packLevelScores.push(userLevel.score);
        //     }
        //     let packScore = 0;
        //     packLevelScores.forEach((score) => (packScore += score));
        //     packScore = packScore * 1.5;
        // }
    }

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;

        let packScore = 0;
        let packScoreMultiplied = 0;
        for (let pack of scores["packs"]) {
            const packLevelScores = [];
            const allUserLevels = [
                ...scores["verified"],
                ...scores["completed"],
            ];
            for (let level of pack["levels"]) {
                let userLevel = allUserLevels.find((lvl) => lvl.path == level);
                packLevelScores.push(userLevel.score);
            }
            packLevelScores.forEach((score) => (packScore += score));
            packScoreMultiplied = packScore * packMultiplier;
        }

        let totalWithoutBonus = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);
        const total = totalWithoutBonus - packScore + packScoreMultiplied

        return {
            user,
            total: round(total),
            packBonus: round(total - totalWithoutBonus),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}

export async function fetchPacks() {
    try {
        const packResult = await fetch(`${dir}/_packlist.json`);
        const packsList = await packResult.json();
        return packsList;
    } catch {
        return null;
    }
}

export async function fetchPackLevels(packname) {
    const packResult = await fetch(`${dir}/_packlist.json`);
    const packsList = await packResult.json();
    const selectedPack = await packsList.find((pack) => pack.name == packname);
    try {
        return await Promise.all(
            selectedPack.levels.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    return [
                        {
                            level,
                            path,
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            })
        );
    } catch (e) {
        console.error(`Failed to load packs.`, e);
        return null;
    }
}
