const hiraganas = {
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  さ: "sa",
  す: "su",
  せ: "se",
  そ: "so",
  ざ: "za",
  ず: "zu",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  だ: "da",
  づ: "dzu",
  で: "de",
  ど: "do",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ベ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  ゐ: "wi",
  ゑ: "we",
  を: "wo",
  あ: "a",
  い: "i",
  え: "e",
  ん: "n",
};

const katakanas = {
  カ: "ka",
  キ: "ki",
  ク: "ku",
  ケ: "ke",
  コ: "ko",
  ガ: "ga",
  ギ: "gi",
  グ: "gu",
  ゲ: "ge",
  ゴ: "go",
  サ: "sa",
  ス: "su",
  セ: "se",
  ソ: "so",
  ザ: "za",
  ヅ: "dzu",
  ズ: "zu",
  ゼ: "ze",
  ゾ: "zo",
  タ: "ta",
  ツ: "tsu",
  テ: "te",
  ト: "to",
  ナ: "na",
  ニ: "ni",
  ヌ: "nu",
  ネ: "ne",
  ノ: "no",
  ハ: "ha",
  ヒ: "hi",
  ダ: "da",
  デ: "de",
  ド: "do",
  フ: "fu",
  ヘ: "he",
  ホ: "ho",
  ポ: "po",
  バ: "ba",
  ビ: "bi",
  ブ: "bu",
  ボ: "bo",
  マ: "ma",
  ミ: "mi",
  ム: "mu",
  メ: "me",
  モ: "mo",
  ヤ: "ya",
  ラ: "ra",
  リ: "ri",
  ル: "ru",
  レ: "re",
  ロ: "ro",
  ワ: "wa",
  ヰ: "wi",
  ヱ: "we",
  ヲ: "wo",
  ア: "a",
  イ: "i",
  エ: "e",
  ン: "n",
};

const kanasThatCanHaveUWithAccent = {
  ゆ: "yu",
  ゅ: "yu",
  ユ: "yu",
  ュ: "yu",
};

const kanasThatCanTriggerUWithAccent = {
  う: "u",
  ウ: "u",
};

const kanasThatCanHaveOWithAccent = {
  よ: "yo",
  ょ: "yo",
  ヨ: "yo",
  ョ: "yo",
};

const kanasThatCanTriggerOWithAccent = {
  お: "o",
  オ: "o",
};

const kanasWithoutIBefore = {
  ゃ: "ya",
  ャ: "ya",
  ゅ: "yu",
  ュ: "yu",
  ょ: "yo",
  ョ: "yo",
};

const kanasWithoutYAfter = {
  ひ: "hi",
  シ: "shi",
  ジ: "ji",
  チ: "chi",
  し: "shi",
  じ: "ji",
};

const kanas = {
  ...hiraganas,
  ...katakanas,
  ...kanasWithoutIBefore,
  ...kanasWithoutYAfter,
  ...kanasThatCanHaveUWithAccent,
  ...kanasThatCanTriggerUWithAccent,
  ...kanasThatCanHaveOWithAccent,
  ...kanasThatCanTriggerOWithAccent,
};

const duplicateConsonant = (string, character) => {
  const indexCharacter = string.indexOf(character);
  const characterAfter = kanas[string[indexCharacter + 1]];

  if (characterAfter) {
    let regExp = new RegExp(character);
    return string.replace(regExp, characterAfter[0]);
  }

  return string;
};

const errorValue = "!!!!!!!!!!!!!!";

const translateKanas = (string) => {
  ["ッ", "っ"].forEach((character) => {
    string = duplicateConsonant(string, character);
  });

  return string
    .replace(/しい/, "shī")
    .replace(/チー/, "chī")
    .split("")
    .map((e, i) => {
      if (e.charCodeAt() < 1000) {
        return e;
      }
      if (kanasWithoutIBefore[string[i + 1]]) {
        return kanas[e] ? kanas[e].replace("i", "") : errorValue;
      }
      if (kanasWithoutYAfter[string[i - 1]]) {
        return kanas[e] ? kanas[e].replace("y", "") : errorValue;
      }
      // handles ū
      if (
        kanasThatCanHaveUWithAccent[e] &&
        kanasThatCanTriggerUWithAccent[string[i + 1]]
      ) {
        return kanas[e] ? kanas[e].replace("u", "ū") : errorValue;
      }
      if (
        kanasThatCanHaveUWithAccent[string[i - 1]] &&
        kanasThatCanTriggerUWithAccent[e]
      ) {
        return "";
      }
      // handles ō
      if (
        kanasThatCanHaveOWithAccent[e] &&
        kanasThatCanTriggerOWithAccent[string[i + 1]]
      ) {
        return kanas[e] ? kanas[e].replace("o", "ō") : errorValue;
      }
      if (
        kanasThatCanHaveOWithAccent[string[i - 1]] &&
        kanasThatCanTriggerOWithAccent[e]
      ) {
        return "";
      }
      // default
      return kanas[e] ? kanas[e] : errorValue;
    })
    .join("");
};

exports.translateKanas = translateKanas;
