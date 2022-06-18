# Bug list 🐛🪲

## Asynchronicity ⌚

I originally did not set up the request in a correct asynchronous way, so the data file was getting written before the new data was fetched. I then added more `await` to make sure `writeFileSync("./data/kanjis.json", JSON.stringify(newData));` was not getting executed before the new data was added to the existing one. I then ran into an other problem, which was to wait for the execution of mapping the old data. I learned that using an `await` was not sufficient, since multiple promises are getting executed `Promise.all()` was also necessary.

```Javascript
const parsedData = JSON.parse(data);

  let newData;
  try {
    newData = await Promise.all(
      parsedData.map(async (e) => {
        ...
  } catch (error) {
    console.log(error);
  }
```

## Incorrect "data" argument 💾

```
UnhandledPromiseRejectionWarning: TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined
```

The `newData` value was undefined in the line of code `writeFileSync("./data/kanjis.json", JSON.stringify(newData));`

## Too Many Requests ✉️

```
response: {
    status: 429,
    statusText: 'Too Many Requests',
}`
```

Too many requests were sent at once. I had more than 400 executed in one go, I did various try and settled on doing 25 requests at a time, and wait between them.
