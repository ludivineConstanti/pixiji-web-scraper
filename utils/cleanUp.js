const { translateKanas } = require("./translateKanas.js");

const cleanUpEnglishTranslations = (translation) => {
  const translationDivided = translation.split(/\(|\)/g);

  const translationCleanedUp = [];

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

  return translationCleanedUp.filter((v) => v);
};

const cleanUpCompounds = (compound) => {
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
      en: cleanUpEnglishTranslations(en),
    };
  }
};

exports.cleanUpCompounds = cleanUpCompounds;
