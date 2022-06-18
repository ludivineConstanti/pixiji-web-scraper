# Custom translating function 📖

There was no data displaying the kanji pronounciation using the latin writing system, I therefore wrote the `translateKanas` function to be able to have this data anyway, if I wanted to (ex: it returns "hitotsu" if you pass in "ひとつ"). My first approach was to collect all hiraganas and katakanas I could find and use them as object keys, that would have their latin translations as value:

```Javascript
const hiraganas = {
  あ: "a",
  ...
}

const katakanas = {
  ア: "a",
  ...
}

const kanas = { ...hiraganas, ...katakanas };

console.log("いち"
    .map((e) => kanas[e] ? kanas[e] : "!!!!!!!!!!!!!!")
    .join(""));
```

I used `"!!!!!!!!!!!!!!"` as a warning for when the characters were not defined.

That worked pretty well, the problem being that even if katakanas and hiraganas can most of the time be translated one to one, there is some characters combinations that are not as straightforward: the `ッ` character is used to signify a small pause and the latin equivalent is usually written by doubling the next consonant, so this: `ッソ` becomes this: ``sso` (`ソ` alone would have been translated to `so`).

## Double consonant 👬🏻

I could have used the same technique, and covered all the cases where the consonant cases one by one, like so: `サッソク.replace(/ッソ/, "sso").replace(/ッシ/, "sshi").replace(/ッキ/, "kki")...`, instead, I decided to do it dynamically by identifying the character that comes after `ッ` and doubling the first letter of its translation.

```Javascript
const string = "サッソク"
const indexッ = string.indexOf("ッ");
const characterAfterッ = kanas[string[indexッ + 1]];

  if (characterAfterッ) {
    string.replace(/ッ/, characterAfterッ[0]);
  }
```

## Letter combinations 🧩

Some sound combinations also combine some letters, or make them disappear. For example `"ジュウロク"` becomes `"jyūroku"` instead of `"jiyuuroku"` (the accent on the u showing that the sound should be pronounced during a bit longer). I therefore tried to think of how to formulate a proper condition to treat this case.

1. 2 characters should be identified in the string, for this special case to apply (in the example above `ジ` and `ュ`).
2. Those 2 characters should be in the right order (next to each other and first `ジ` and then `ュ` afterward).
3. If those conditions are met the translation of `ジ` should be ``j` instead of `ji`

I used indexOf to find out those informations:

```Javascript
const kanas = {
  ジ: "ji",
  ...
  };

const string = "ジュウロク";
const character = "ジ";
const characterWithoutIBefore = "ュ";
const indexCharacter = string.indexOf(character);
const indexCharacterWithoutIBefore = string.indexOf(characterWithoutIBefore);

 if (indexCharacter > -1 && indexCharacterWithoutIBefore === indexCharacter + 1) {
  let regExp = new RegExp(character);
  console.log(string.replace(regExp, kanas[character].replace("i", "")));
}
```

The problem with this method, is that I do not see any obvious way to scale it, so that the characters do not have to be individual strings (`"ジ"` and `ュ`) but could be multiple characters, and ```indexOf()````also only return one index, so it would be a problem if the characters that I am interested in are present multiple times in the string.

I then remembered that I was currently already mapping the characters, in the existing `translateKanas` function and that this method easily solves the condition mentionned above.

```Javascript
const kanasWithoutYAfter = {
  ジ: "ji",
  ...
};

const kanasWithoutIBefore = {
  ュ: "yu",
  ...
};

const kanas = {
  ...kanasWithoutIBefore,
  ...kanasWithoutYAfter,
  ...
};

const translateKanas = (string) => {
  return string
    .split("")
    .map((e, i) => {
      if (i < string.length - 1 && kanasWithoutIBefore[string[i + 1]]) {
        return kanas[e] ? kanas[e].replace("i", "") : errorValue;
      }
      if (i !== 0 && kanasWithoutYAfter[string[i - 1]]) {
        return kanas[e] ? kanas[e].replace("y", "") : errorValue;
      }
      // default
      return kanas[e] ? kanas[e] : errorValue;
    })
    .join("");
};
```

It goes through the entire string and can verify the conditions (if the mentionned characters are next to each other using `index + 1` and `index - 1`). It also checks multiple characters at the same time (if the current character is part of the group that interest us, it will be a property of the object we're using and return a value, otherwise, it will return `undefined`).
