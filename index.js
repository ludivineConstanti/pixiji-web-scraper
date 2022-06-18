const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const { readFileSync, writeFileSync } = require("fs");

const { cleanUpCompounds } = require("./utils/cleanUp.js");
const { translateKanas } = require("./utils/translateKanas.js");
const PORT = 8000;

const app = express();

const main = async () => {
  const data = await readFileSync("./data/raw-kanjis.json", "utf-8");
  const parsedData = JSON.parse(data);

  let newData;
  try {
    newData = await Promise.all(
      parsedData.map(async (e) => {
        // return e;
        const URL = `https://jisho.org/search/${encodeURI(e.kanji)}%20%23kanji`;

        let response;
        try {
          response = await axios(URL);
        } catch (error) {
          console.log(error);
        }

        const html = response.data;
        const $ = cheerio.load(html);

        const onyomi = $(".on_yomi", html).find("a").text();
        // const onyomiEn = ""
        // const onyomiCompounds = [{kanji: "", kana: "", kanaEn: "", en: [""]}]
        const kunyomi = $(".kun_yomi", html).find("a").text();
        const compounds = $(".compounds", html)
          .text()
          .split("Kun reading compounds");
        // console.log(onyomi[0], kunyomi);
        // const kunyomiEn = ""

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

        return { ...e, onyomiCompounds, kunyomiCompounds };
      })
    );
  } catch (error) {
    console.log(error);
  }

  writeFileSync("./data/kanjis.json", JSON.stringify(newData));
  console.log("done");
};

main();

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
