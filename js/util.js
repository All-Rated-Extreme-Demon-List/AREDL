// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export function getYoutubeIdFromUrl(url) {
    return url.match(
        /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
    )?.[1] ?? '';
}

export function embed(video) {
    return `https://www.youtube.com/embed/${getYoutubeIdFromUrl(video)}`;
}

export function localize(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 3 });
}

export function getThumbnailFromId(id) {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

// https://stackoverflow.com/a/44615197
export function getFontColour(hex){
    function getRGB(c) {
        return parseInt(c, 16) || c;
    }
      
      function getsRGB(c) {
        return getRGB(c) / 255 <= 0.03928
          ? getRGB(c) / 255 / 12.92
          : Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4);
    }
      
      function getLuminance(hexColor) {
        return (
          0.2126 * getsRGB(hexColor.substr(1, 2)) +
          0.7152 * getsRGB(hexColor.substr(3, 2)) +
          0.0722 * getsRGB(hexColor.substr(-2))
        );
    }
      
      function getContrast(f, b) {
        const L1 = getLuminance(f);
        const L2 = getLuminance(b);
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    }

    const whiteContrast = getContrast(hex, "#ffffff");
    const blackContrast = getContrast(hex, "#000000");
    
    return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}