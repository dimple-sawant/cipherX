const slt = document.getElementById("cipher-select");
const inp = document.getElementById("text-inp");
const out = document.getElementById("text-out");

slt.addEventListener("input", handleInput);
inp.addEventListener("input", handleInput);
out.addEventListener("input", handleInput);

const elements = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
const morseKeys = [
	".- ",
	"-... ",
	"-.-. ",
	"-.. ",
	". ",
	"..-. ",
	"--. ",
	".... ",
	".. ",
	".--- ",
	"-.- ",
	".-.. ",
	"-- ",
	"-. ",
	"--- ",
	".--. ",
	"--.- ",
	".-. ",
	"... ",
	"- ",
	"..- ",
	"...- ",
	".-- ",
	"-..- ",
	"-.-- ",
	"--.. ",
	"----- ",
	".---- ",
	"..--- ",
	"...-- ",
	"....- ",
	"..... ",
	"-.... ",
	"--... ",
	"---.. ",
	"----. ",
];
const caesarKeys = Array.from(
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);
const caesarValues = Array.from(
	"DEFGHIJKLMNOPQRSTUVWXYZABCdefghijklmnopqrstuvwxyzabc"
);
const rot13Keys = Array.from(
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);
const rot13Values = Array.from(
	"NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm"
);

const morseMap = new Map(elements.map((_, i) => [elements[i], morseKeys[i]]));
const morseMapDecode = new Map(
	Array.from(morseMap, (item) => [item[1].trim(), item[0].trim()])
);

const caesarMap = new Map(caesarKeys.map((c, i) => [c, caesarValues[i]]));
const caesarMapDecode = new Map(
	Array.from(caesarMap, (item) => item.reverse())
);

const rot13Map = new Map(rot13Keys.map((c, i) => [c, rot13Values[i]]));
const rot13MapDecode = new Map(Array.from(rot13Map, (item) => item.reverse()));

function handleInput(e) {
	if (e.target === slt) {
		document.querySelector(".info-card.active")?.classList.remove("active");
		document.getElementById(`info-card-${slt.value}`)?.classList.add("active");
	}

	const toDecode = e.target === out;

	let val = toDecode ? out.value.trim() : inp.value.trim();

	if (val === "") {
		if (toDecode) {
			inp.value = "";
		} else {
			out.value = "";
		}
		return;
	}

	let outVal = "";

	switch (slt.value) {
		case "morse":
			outVal = toDecode
				? decode(val.split(/\//), "morse", morseMapDecode, "#")
				: encode(val.toUpperCase().split(/\s+/), morseMap, "#", "/");
			break;
		case "caesar":
			val = val.split(/\s+/);
			outVal = toDecode
				? decode(val, "caesar", caesarMapDecode)
				: encode(val, caesarMap);
			break;
		case "rot13":
			val = val.split(/\s+/);
			outVal = toDecode
				? decode(val, "rot13", rot13MapDecode)
				: encode(val, rot13Map);
			break;
		default:
			break;
	}

	if (toDecode) {
		inp.value = outVal;
	} else {
		out.value = outVal;
	}
}

function encode(words, map, defaultChr, sep = " ") {
	return words
		.map((word) =>
			Array.from(word.trim())
				.map((c) => map.get(c) ?? defaultChr ?? c)
				.join("")
		)
		.join(sep);
}

function decode(words, type, map, defaultChr) {
	if (type === "morse") {
		words = words.map((word) => word.trim().split(/\s+/));
	} else {
		words = words.map((word) => Array.from(word.trim()));
	}

	return words
		.map((word) => word.map((c) => map.get(c) ?? defaultChr ?? c).join(""))
		.join(" ");
}
