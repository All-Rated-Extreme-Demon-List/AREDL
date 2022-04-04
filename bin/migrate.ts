import { d } from '../js/list.js';

type List = Level[];

interface Level {
    vids?: Video[];
    name: string;
    author: string;
    more: string;
    id: number;
    pass: string;
    percentToQualify: number;
    verficationVid: string;
}

interface Video {
    user: string;
    link: string;
    percent: number;
    hz: string;
}

interface People {
    author: string;
    creators: string[];
    verifier: string;
}

const regex = /^(\S+)(?:\s(?:(?:and|&)\s(more|\S+))?\s?\[(.+)\])?$/gm;
function people(level: Level): People {
    const res = level.author.matchAll(regex).next().value.slice(1);
    const [author, more, verifier] = res;

    // eval more
    const creators = [];
    if (more) {
        if (more === 'more') {
            level.more
                .split(',')
                .map((v) => v.trim())
                .forEach((v) => creators.push(v));
        } else {
            creators.push(more);
        }
    }

    return {
        author,
        creators,
        verifier: verifier || author,
    };
}

const list: any[] = d.list;

const piped = list.map((level: Level) => {
    const { author, creators, verifier } = people(level);

    return {
        id: level.id,
        name: level.name,
        author,
        creators,
        verifier,
        verfication: level.verficationVid,
        percentToQualify: level.percentToQualify,
        password: level.pass === 'Free to copy' ? undefined : level.pass,
        records: level.vids?.map((vid) => ({
            user: vid.user,
            link: vid.link,
            percent: vid.percent,
            hz: parseInt(vid.hz),
        })) || [],
    };
});

piped.forEach((elem) => {
    const json = JSON.stringify(elem);
    Deno.writeTextFile(`./data/${elem.name.substring(7)}.json`, json);
});
