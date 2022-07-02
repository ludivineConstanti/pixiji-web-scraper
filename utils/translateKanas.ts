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
  シ: "shi",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  ざ: "za",
  ジ: "ji",
  じ: "ji",
  ぜ: "ze",
  ぞ: "zo",
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
  へ: "he",
  ひ: "hi",
  ほ: "ho",
  ふ: "fu",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ベ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぺ: "pe",
  ぽ: "po",
  ぷ: "pu",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゃ: "ya",
  よ: "yo",
  ょ: "yo",
  ゆ: "yu",
  ゅ: "yu",
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
  え: "e",
  い: "i",
  お: "o",
  う: "u",
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
  チ: "chi",
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
  パ: "pa",
  ペ: "pe",
  ピ: "pi",
  ポ: "po",
  プ: "pu",
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
  ャ: "ya",
  ヨ: "yo",
  ョ: "yo",
  ユ: "yu",
  ュ: "yu",
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
  エ: "e",
  イ: "i",
  ィ: "i",
  オ: "o",
  ウ: "u",
  ン: "n",
};

const kanas = {
  ...hiraganas,
  ...katakanas,
};

const kanasWithoutIBefore = ["ゃ", "ャ", "ゅ", "ュ", "ょ", "ョ"];

const kanasWithoutYAfter = ["ひ", "シ", "ジ", "チ", "し", "じ"];

const canTriggerAccentForEveryLetter = ["ー"];

const combinableVowelsData = {
  a: {
    newLetter: "ā",
    canHaveAccent: ["ダ"],
    canTriggerAccent: [...canTriggerAccentForEveryLetter, "あ", "ア"],
  },
  i: {
    newLetter: "ī",
    canHaveAccent: ["し", "チ"],
    canTriggerAccent: [...canTriggerAccentForEveryLetter, "い", "イ"],
  },
  o: {
    newLetter: "ō",
    canHaveAccent: ["ポ", "よ", "ょ", "ヨ", "ョ"],
    canTriggerAccent: [...canTriggerAccentForEveryLetter, "お", "オ"],
  },
  u: {
    newLetter: "ū",
    canHaveAccent: ["ぷ", "ゆ", "ゅ", "ユ", "ュ"],
    canTriggerAccent: [...canTriggerAccentForEveryLetter, "う", "ウ"],
  },
};

const silentKanas = ["っ", "ー", "ッ"];

const kanasThatDoubleConsonant = ["ッ", "っ"];

const errorValue = "!!!!!!!!!!!!!!";

exports.translateKanas = (text: string) => {
  return text
    .replace(/ディ/, "di")
    .split("")
    .map((e, i) => {
      // Verify if it's a kana and not a latin character
      if (e.charCodeAt(0) < 1000) {
        return e;
      }

      if (silentKanas.includes(e)) {
        return "";
      }

      const kanasWithGenericType = kanas as { [key: string]: string };
      let result: string = kanasWithGenericType[e];

      if (kanasThatDoubleConsonant.includes(text[i - 1])) {
        result = result ? result[0] + result : errorValue;
      }

      if (kanasWithoutIBefore.includes(text[i + 1])) {
        result = result ? result.replace("i", "") : errorValue;
      }

      // Adds accent on vowels
      for (const key of Object.keys(combinableVowelsData)) {
        const currentKey = key as keyof typeof combinableVowelsData;
        const { canHaveAccent, canTriggerAccent, newLetter } =
          combinableVowelsData[currentKey];

        if (
          canHaveAccent.includes(e) &&
          canTriggerAccent.includes(text[i + 1])
        ) {
          result = result ? result.replace(currentKey, newLetter) : errorValue;
        }
        if (
          canHaveAccent.includes(text[i - 1]) &&
          canTriggerAccent.includes(e)
        ) {
          result = "";
        }
      }

      if (result !== "") {
        if (kanasWithoutYAfter.includes(text[i - 1])) {
          result = result ? result.replace("y", "") : errorValue;
        }
      }

      return result;
    })
    .join("");
};
