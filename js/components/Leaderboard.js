import { score } from '../score.js';

export default {
    props: ['list'],
    template: `<ul>
        <li v-for="score in scores">
            {{ score.user }}: {{ score.score }}
        </li>
    </ul>`,
    computed: {
        scores() {
            const scoreMap = {};
            this.list.forEach((level, rank) => {
                level.records.forEach((record) => {
                    scoreMap[record.user] ??= [];
                    scoreMap[record.user].push({
                        level: level.name,
                        percent: record.percent,
                        score: score(rank + 1, record.percent, level.percentToQualify),
                    });
                });
            });

            const res = Object.entries(scoreMap).map(([user, scores]) => {
                return {
                    user,
                    score: scores.reduce((s, t) => s + t.score, 0),
                    scores,
                };
            });

            return res.sort((a, b) => b.score - a.score);
        },
    },
};
