# Process

This is my first attempt at building a web scraper, and I originally did not know how it works at all, so I decided to follow [this tutorial](https://www.youtube.com/watch?v=-3lqUHeZs_0&t=2s), which gives a starting point. After successfully reproducing it, I started adapting it to my needs.

## Converting english translations to an array

I wanted to have the english translation, as an array of strings, which is why I used the following code:

```Javascript
englishTranslation.split(",").trim()
```

The problem is that some translations contain additional informations surrounded by parenthesis, like so: `"one, start, a (single), bottom string (on a shamisen, etc.)"`. In this case, the final translation would be splitted where it should not be `["bottom string (on a shamisen", "etc.)"]`. I therefore needed to split the string everywhere where there is a comma, except between parentheses.

I first tried replacing the commas that are inside parenthesis, by an other symbol and then splitting, and then replacing the symbol back to a comma again:

```Javascript
"first, bottom string (on a shamisen, etc, etc.), second".replace(
    /(\([\w\s.]+)(,)([\w\s.]+\))/g,
    "$1%$3"
  ).split(",")
   .map((e) => e.replace(/%/g, ","))
```

That worked fine, but only if there was only one comma inside of the parenthesis. I then tried an other approach, which was to split the string on the parenthesis. This way, I create an array of strings with the pair indexed string needing to be split on commas, and the others need to be kept intact (since they have parenthesis).

```Javascript
"first, bottom string (on a shamisen, etc, etc.), second".split(/\(|\)/g)
   .map((e, i) => {
        if (i % 2 === 0) {
          return e.split(",").filter((s) => s);
        }
        return `(${e})`;
      })
```

The result was a bit messy, since I started having arrays inside of arrays, but an other problem was that the string should actually not be split on parenthesis. Indeed, for the following string `"first, bottom string (on a shamisen, etc, etc.), second"` I wanted `["first", "bottom string (on a shamisen, etc, etc.)", "second"]` as a result, not `["first", "bottom string", "(on a shamisen, etc, etc.)", "second"]`. I therefore decided to use 2 for loops, one to split the strings that should be split on comma and the second to add the string that contains parenthesis to the last member of the preceding array.

```Javascript
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
```
