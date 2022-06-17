const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const { readFileSync, writeFileSync } = require("fs");

const { translateKanas } = require("./utils/translateKanas.js");

const PORT = 8000;

const app = express();

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
      en: en.split(","),
    };
  }
};

const main = async () => {
  const data = await readFileSync("./data/raw-kanjis.json", "utf-8");
  const parsedData = JSON.parse(data);

  // const newData = parsedData.map((e, i) => {
  const URL = `https://jisho.org/search/${encodeURI("一")}%20%23kanji`;

  const response = await axios(URL);
  const html = response.data;
  const $ = cheerio.load(html);

  // const kanji = $(".character", html).text();
  // const en = ""
  // ? const kana = ""
  // ? const kanaEn = ""
  const onyomi = $(".on_yomi", html).find("a").text();
  // const onyomiEn = ""
  // const onyomiCompounds = [{kanji: "", kana: "", kanaEn: "", en: [""]}]
  const kunyomi = $(".kun_yomi", html).find("a").text();
  const compounds = $(".compounds", html).text().split("Kun reading compounds");
  // console.log(onyomi[0], kunyomi);
  // const kunyomiEn = ""
  // const kunyomiCompounds = [{kanji: "", kana: "", kanaEn: "", en: [""]}]

  const onyomiCompounds = compounds[0]
    .replace(/On reading compounds/, "")
    .split("\n\n\n")
    .map((e) => {
      return cleanUpCompounds(e);
    })
    .filter((e) => e);

  const kunyomiCompounds = compounds[1]
    .split("\n\n")
    .map((e) => {
      return cleanUpCompounds(e);
    })
    .filter((e) => e);

  console.log(onyomiCompounds, kunyomiCompounds);
  // return { ...e, onyomiCompounds, kunyomiCompounds };
  // });

  //writeFileSync("./data/kanjis.json", JSON.stringify(newData));
  console.log("done");
};

main();

/*  */

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
