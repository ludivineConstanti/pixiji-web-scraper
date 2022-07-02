const { translateKanas } = require("./translateKanas");

exports.cleanUpEnglishTranslations = (translation: string) => {
  const translationDivided = translation.split(/\(|\)/g);

  const translationCleanedUp: string[] = [];

  for (let i = 0; i < translationDivided.length; i++) {
    if (i % 2 === 0) {
      const translationSubarray = translationDivided[i].split(",");
      for (let j = 0; j < translationSubarray.length; j++) {
        if (
          j === translationSubarray.length - 1 &&
          i !== translationDivided.length - 1
        ) {
          translationCleanedUp.push(
            translationSubarray[j].trimStart() +
              `(${translationDivided[i + 1]})`
          );
        } else {
          translationCleanedUp.push(translationSubarray[j].trim());
        }
      }
    }
  }

  return translationCleanedUp.filter((v) => v).slice(0, 5);
};

exports.cleanUpCompounds = (compound: string) => {
  const data = compound.replace(/\n/g, "").replace(/\s+/g, " ");
  const dataWithSeparatedKanji = data.split("【");
  if (dataWithSeparatedKanji[1]) {
    const kanji = dataWithSeparatedKanji[0];
    const dataWithSeparatedTranslation = dataWithSeparatedKanji[1].split("】");
    const kana = dataWithSeparatedTranslation[0];
    const en = dataWithSeparatedTranslation[1].trim();

    return {
      kanji,
      kana,
      kanaEn: translateKanas(kana),
      en: exports.cleanUpEnglishTranslations(en),
    };
  }
};

exports.cleanUpTranslateKanas = translateKanas;
