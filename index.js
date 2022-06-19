const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const { readFileSync, writeFileSync } = require("fs");

const { cleanUpCompounds } = require("./utils/cleanUp.js");
const { translateKanas } = require("./utils/translateKanas.js");
const PORT = 8000;

const app = express();

const executeRequest = async (e) => {
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
  const compounds = $(".compounds", html).text().split("Kun reading compounds");
  // console.log(onyomi[0], kunyomi);
  // const kunyomiEn = ""

  const onyomiCompounds = compounds[0]
    .replace(/On reading compounds/, "")
    .split("\n\n\n")
    .map((e) => {
      return cleanUpCompounds(e);
    })
    .filter((e) => e);

  let kunyomiCompounds = [];

  if (compounds[1]) {
    kunyomiCompounds = compounds[1]
      .split("\n\n")
      .map((e) => {
        return cleanUpCompounds(e);
      })
      .filter((e) => e);
  }

  return { ...e, onyomiCompounds, kunyomiCompounds };
};

const step = 50;
let counter = 0;

const loopThroughRequests = async (parsedData, newData) => {
  if (counter < step * Math.ceil(parsedData.length / step)) {
    for (let i = counter; i < step + counter && i < parsedData.length; i++) {
      let response;
      try {
        response = await executeRequest(parsedData[i]);
      } catch (error) {
        console.log(error);
      }
      newData.push(response);
      console.log(i);
    }
    counter += step;
    setTimeout(() => {
      loopThroughRequests(parsedData, newData);
    }, 60000);
  } else {
    writeFileSync("./data/kanjis.json", JSON.stringify(newData));
    console.log("done");
  }
};

const main = async () => {
  const data = await readFileSync("./data/raw-kanjis.json", "utf-8");
  const parsedData = JSON.parse(data);

  const newData = [];

  loopThroughRequests(parsedData, newData);
};

main();

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
