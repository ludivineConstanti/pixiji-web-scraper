const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const { readFileSync, writeFileSync } = require("fs");

const {
  cleanUpCompounds,
  cleanUpEnglishTranslations,
  cleanUpTranslateKanas,
} = require("./utils/cleanUp");

const PORT = 8000;

const app = express();

interface CommonProps {
  kanjiId: number;
  kanji: string;
  kana: string;
  kanaEn: string;
  quizId: number;
  en: string;
}

interface ParsedDataProps extends CommonProps {}

interface NewDataProps extends CommonProps {
  onyomiCompounds: {
    kanji: string;
    kana: string;
    kanaEn: string;
    en: string[];
  }[];
}

const executeRequest = async (data: ParsedDataProps) => {
  const URL = `https://jisho.org/search/${encodeURI(data.kanji)}%20%23kanji`;

  let response;
  try {
    response = await axios(URL);
  } catch (error) {
    console.log(error);
  }

  const html = response.data;
  const $ = cheerio.load(html);

  const en = $(".kanji-details__main-meanings", html).text();
  const onyomi = $(".kanji-details__main-readings", html)
    .find(".on_yomi")
    .find("a")
    .text();
  const kunyomi = $(".kanji-details__main-readings", html)
    .find(".kun_yomi")
    .find("a")
    .text();

  const compounds = $(".compounds", html).text().split("Kun reading compounds");

  const onyomiCompounds = compounds[0]
    .replace(/On reading compounds/, "")
    .split("\n\n\n")
    .map((text: string[]) => {
      return cleanUpCompounds(text);
    })
    .filter((text: string) => text)
    .slice(0, 5);

  return {
    ...data,
    en: cleanUpEnglishTranslations(en),
    onyomi,
    onyomiEn: cleanUpTranslateKanas(onyomi),
    kunyomi,
    kunyomiEn: cleanUpTranslateKanas(kunyomi),
    onyomiCompounds,
  };
};

const step = 50;
let counter = 0;

const loopThroughRequests = async (
  parsedData: ParsedDataProps[],
  newData: NewDataProps[]
) => {
  if (counter < step * Math.ceil(parsedData.length / step)) {
    for (let i = counter; i < step + counter && i < parsedData.length; i++) {
      let response: NewDataProps;
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

const testRequest = async (parsedData: ParsedDataProps) => {
  let response;
  try {
    response = await executeRequest(parsedData);
  } catch (error) {
    console.log(error);
  }
  console.log(response);
};

const main = async () => {
  const data = await readFileSync("./data/raw-kanjis.json", "utf-8");
  const parsedData = JSON.parse(data);

  // console.log the first request
  // testRequest(parsedData[0]);

  // creates Json file with all the kanjis (takes long)
  const newData: NewDataProps[] = [];
  loopThroughRequests(parsedData, newData);
};

main();

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
