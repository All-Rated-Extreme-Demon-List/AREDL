/**
 * Numbers of decimal digits to round to
 *400 / Math.sqrt((rank - 1) / 50 + 0.444444) - 100
 * Formula for 800 levels
 */
const scale = 1;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
	if (rank > 999) {
		return 0;
	}

	let score =
		(400 / Math.sqrt((rank - 1) / 50 + 0.444444) - 100) *
		((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

	score = Math.max(0, score);

	if (percent != 100) {
		return round(score - score / 3);
	}

	return round(score);
}

export function round(num) {
	if (!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + scale) + "e-" + scale);
	} else {
		var arr = ("" + num).split("e");
		var sig = "";
		if (+arr[1] + scale > 0) {
			sig = "+";
		}
		return +(
			Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) +
			"e-" +
			scale
		);
	}
}
