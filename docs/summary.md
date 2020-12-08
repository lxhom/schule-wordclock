[](Hey_there!)
[](If_you're_not_here_to_modify_the_markdown_source_code:)
[](This_should_be_displayed_as_markdown,)
[](so_please_open_it_in_a_markdown_compatible_program)
[](to_view_this_document!)
[](Made_with_<3_by_lxhhh)



<h1 align="center">Word Clock Project Summary</h1>


Hey there! This is the Project Summary of my Word Clock Project!

Before we get started, i'd like to mention three things: 
1. This whole summary, and the code, are all written in English, because almost everything code-related is also in English. For Example: It would be weird to call a integer a `integer` in the declaration and then a `Ganzzahl` in the variable name, so I just chose to make this in English instead of German, even though the clock itself is in German.
2. If you're looking for a shorter version without the full documentation: [Here's the quick summary](quicksummary.md).
3. I use a lot of links, and not just for fun, but to show references or informations. I highly reccomend to cheack out every link, and if you get tired of clicking every single link, try hovering over it to see where its destination is, or to be precise, which paragraph is linked. [You can try it here](#Here-are-destinations-or-paragraphs-displayed). A good example for the additional infos are two quotes at the beginning of [the first chapter](#making-the-letter-matrix), try hovering over the words at the two quotes.

So to start off, here's an example to give you the gist:

```js
E S h I S T g f ü n f
z e h n Z W A N Z I G
v i e r t e l e V O R
n a c h ä h a l b x i
z w e i n S I E B E N
e l f ü n f z w ö l f
z e h n e u n d r e i
a c h t p l s e c h s
v i e r u h r s y n c
```

If you look at all the letters, you can see how this clock works. It has all words that are required to spell out every time of the day with 5 minutes accuracy on it, allowing you to display the time by highlighting some of the words (see the [example](#(note:-ignore-the-quotation-marks,-they-are-used-to-highlight-words))). And that's basically it.

But making it a real thing isnt that easy, because you need to do these things:
1. [Make a letter matrix with all words on it, with the least possible amount of letters.](#1-making-the-letter-matrix)
2. [Make a program that gives you the time in words.](#2-making-a-time-to-word-program)
3. [Make a program that displays the words on the matrix.](#3-making-a-word-to-matrix-program)
4. [Display the matrix on a real LED Matrix](#4-making-the-real-clock)
5. [Displaying the current time on the clock](#5-displaying-the-current-time)
6. [Getting the materials and building the clock](#6-building-the-clock)

---
## 1. Making the letter matrix

To start off, we need to analyze how time is spoken in German. Here are two examples: (notice the underlines showing each segment)

> #### [<u>Es ist</u>](#the-start) [<u>fünf</u>](#the-time-in-minutes) [<u>vor</u>](#the-indicator-if-the-relative-time-is-positive-or-negative) [<u>halb</u>](#the-indicator-if-half-an-hour-earlier-is-meant) [<u>zwei</u>](#the-time-in-hours).

> #### [<u>Es ist</u>](#the-start) [<u>drei</u>](#the-time-in-hours) [<u>Uhr</u>](#the-indicator-if-it-is-a-full-hour).

There are a few elements in those sentences, each with a few rules:

1. #### The start 
    - Example: ["***Es ist*** fünf vor halb zwei"](#es-ist-fünf-vor-halb-zwei.)
    - Every sentence has to start with "Es ist".
    - All possibilities: "Es ist"

2. #### The time in minutes 
    - Example: ["Es ist ***fünf*** vor halb zwei"](#es-ist-fünf-vor-halb-zwei.)
    - There are words for 5, 10, 15 and 20.
    - It is left out if it would be zero.
    - Relative to [the full hour](#the-time-in-hours) or [to 30 minutes](#the-indicator-if-half-an-hour-earlier-is-meant).
    - All possibilities: "Fünf", "Zehn", "Viertel", "Zwanzig"

3. #### The indicator if the relative time is positive or negative 
    - Example: ["Es ist fünf ***vor*** halb zwei"](#es-ist-fünf-vor-halb-zwei.)
    - There are indicators for positive and negative, and they have to be used, if [the time in minutes](#the-time-in-minutes) is present.
    - All possibilities: "vor", "nach"

4. #### The indicator if half an hour earlier is meant 
    - Example: ["Es ist fünf vor ***halb*** zwei"](#es-ist-fünf-vor-halb-zwei.)
    - There is only the indicator that 30min earlier is meant, it is left out if it isn't meant.
    - All possibilities: "halb"

5. #### The time in hours 
    - Example: ["Es ist fünf vor halb ***drei***"](#es-ist-fünf-vor-halb-zwei.)
    - The word for 1 ("Eins") is replaced by "Ein" [if it is a full hour](#the-indicator-if-it-is-a-full-hour).
    - All possibilities: "Ein", "Eins", "Zwei", "Drei", "Vier", "Fünf", "Sechs", "Sieben", "Acht", "Neun", "Zehn", "Elf", "Zwölf"

6. #### The indicator if it is a full hour 
    - Example: ["Es ist drei ***Uhr***"](#es-ist-drei-uhr.)
    - Only used if it is a full hour.
    - All possibilities: "Uhr"

Another important thing is: They need to be in this exact order.

Now we could just look up every needed word, and mash them together into one long string. But that wouldn't be very efficient. Keep in mind that the order needs to be the same for the categories, but not for the words.

So the next logical step would be to combine words for each category. What I mean by that is shown in this example:

```
"eins", "zwei", "sieben" ---> "zweinsieben"

zweinsieben
zwei

zweinsieben
  eins

zweinsieben
     sieben
```

We can overlap and shuffle the words, because we only need one or zero words per category. We could do this by hand, but we could also just write a handy program that does it for us: 

> Note: This code is written in JS, but you don't need to worry if you don't use JS, I've put comments after each line explaining what the line does.


```js
function overlaps(word1, word2) { // Overlaps checker function. Expects 2 words as arguments and returns all overlaps as an array.
  var results = []; // Result array
  function overlap(word1, word2) { // Inner function
    var arr = word1.split(""); // Split the 1st word into an array
    var cutted = ""; // Variable to store cutted letters
	  while (arr.length > 0) { // Loop while the array still has letters
		if (word2.endsWith(arr.join(""))) { // Check if the 2nd word ends with the joined array
        results.push(word2+cutted); // Add the overlapped word to the result array
      } // End if (check overlap)
      cutted = arr.pop(1) + cutted; // Cut 1 character at the end of the array and add it to the cutted letters
    } // End loop (array empty)
  } // End inner function
  overlap(word1, word2); // Calling the inner function with the words in both orders
  overlap(word2, word1); // Calling the inner function with the words in both orders
  return results; // Return the results
}

function getOverlaps(wordArray) { // Function to get all overlaps.
  var outputArray = new Array; // Output array to add results to.
  for (var word1 of wordArray) { for (var word2 of wordArray) { // Loop for every combination
    if (overlaps(word1,word2).length > 0) { // Tests if there are any overlaps
      for (var overlap of overlaps(word1,word2)) { // Loop for every overlap
        if (!outputArray.includes(overlap) && !wordArray.includes(overlap) && word1 != word2) { // Prevent duplicates
          outputArray.push(overlap); // Add overlap to the result array
        } // End if (duplicate check)
      } // End for (overlaps)
    } // End if (overlap check)
  }} // End for (each word combination)
  return outputArray; // Return output
} // End funcion (getOverlaps)
```

We can run the program now and this are the results if we put the [hour numbers](#the-time-in-hours) into the program: 

> Note: We can run the program in a JS interpreter, like a modern web browser or [NodeJS](https://nodejs.org).


```js
> getOverlaps(["ein", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"]);

< (12) ["zwein", "drein", "eineun", "zweins", "dreins", "einsechs", "einsieben", "elfünf", "zwölfünf", "sechsieben", "siebeneun", "zehneun"]
```

And there's another thing we can do: we can make overlaps with the overlaps by adding the input array and the output array:

```js
> getOverlaps(["ein", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "zwein", "drein", "eineun", "zweins", "dreins", "einsechs", "einsieben", "elfünf", "zwölfünf", "sechsieben", "siebeneun", "zehneun"]);

< (22) ["einsechsieben", "einsiebeneun", "zweineun", "zweinsechs", "zweinsieben", "dreineun", "dreinsechs", "dreinsieben", "elfünfünf", "zwölfünfünf", "einsechsechs", "sechsechsieben", "sechsiebeneun", "eineuneun", "siebeneuneun", "zehneuneun", "zweinsechsieben", "zweinsiebeneun", "dreinsechsieben", "dreinsiebeneun", "einsechsechsieben", "einsechsiebeneun"]
```
And now we just have to arrange them into a matrix. This is a rather complicated process, and automating it would take more time than doing it by hand. This is the result:

```
e s H i s t G f ü n f
z e h n z w a n z i g 
v i e r t e l E v o r 
n a c h Ä h a l b X I
z w e i n s i e b e n 
e l f ü n f z w ö l f
z e h n e u n d r e i
a c h t P L s e c h s
v i e r u h r S Y N C
```

And you might've noticed the capitalized letters. They are just random letters that aren't important, I just filled them in to avoid gaps and to spell some easter eggs. And if you're wondering why it says `PLS SYNC` at the bottom: This will become useful [later](#5-displaying-the-current-time).

------
## 2. Making a Time-to-Word program

> Warning: This section's documentation isn't finished yet!

As you might have noticed in [the section above](#1-making-the-letter-matrix) where we discussed the time rules: There are a *ton* of rules. So to make it much shorter and easier, we can use a lookup table. We can make one by just applying all the rules by hand. It would look like this in JSON:

```
0: not present, 1: present.
The words are in this order: 
fünf, zehn, viertel, zwanzig, vor, nach, halb,
```
```json
{ "00": "0000000",
  "05": "1000010",
  "10": "0100010",
  "15": "0010010",
  "20": "0001010",
  "25": "1000101",
  "30": "0000001",
  "35": "1000011",
  "40": "0001100",
  "45": "0010100",
  "50": "0100100",
  "55": "1000100"  }
```
You might notice that the [full hour indicator](#the-indicator-if-it-is-a-full-hour) and the next hour (e.g. 3:55 is 5 minutes before 4) are missing, because those two have very simple rules:
```
uhr: active if min == 0
next Hour: active if min >= 25
```

Now we just need to make a program to look the words up and return them, which may sound a bit difficult to make, but it's actually pretty easy. The only thing that is a bit annoying is that we have to add some rules manually, because automating them would be way more complicated.

> Note: This code is written in JS, but you don't need to worry if you don't use JS, I've put comments after each line explaining what the line does.

```js
var lookupTable = { "00": "0000000","05": "1000010","10": "0100010","15": "0010010","20": "0001010","25": "1000101","30": "0000001","35": "1000011","40": "0001100","45": "0010100","50": "0100100","55": "1000100" } // The lookup table from above
var lookupTableEntries = [words.fünf, words.zehn, words.viertel, words.zwanzig, words.vor, words.nach, words.halb] // The lookup entries from above

function time2words(hours,minutes) { // The time to words function, with hours and minutes as arguments.
  var wordArray = [words.es, words.ist];
  minutes = Math.round(minutes/5)*5 // Rounding to 5 minutes
  if (minutes == 60) {hours++; minutes = 00} // Fixing rounding error (e.g. 12:58 -> 12:60 -> 13:00)
  for (var index in lookupTable[minutes]) { // Look up the sentence in the lookup table & iterate over every number
    if (lookupTable[minutes][index] == 1) { // Check if the current word is present
      wordArray.push(lookupTableEntries[index]); // Add current word to the word array
    } // End if (check if 1)
  } // End for (each number in the lookup table string)
  if (minutes >= 25) {hours++} // See code block above
  if (hours > 12) {hours -= 12} // Convert to 12Hour
  if (hours == 00) {hours = 12} // Convert to 12Hour
  if (hours == 01 && minutes == 00) { // See special rule for 1:00 (link as footnote)
    wordArray.push(words.ein); // Add "ein" to the word array
  } else { // If the rule doesn't apply, add the hour to the word array
    wordArray.push(words[hours]); // Add the hour word to the word array 
  } // End if (1:00 rule)
  if (minutes == 00) { // Check if it is a full hour (link as footnote)
    wordArray.push(words.uhr) // Add "Uhr" if its a full hour (link as footnote)
  } // Enf if (full hour rule)
  return wordArray; // Return the word array
} // End function (time2words)
```
###### [(1:00 rule)](#the-time-in-hours) | [(Full hour rule)](#the-indicator-if-it-is-a-full-hour)
This code won't work when we run it without anything. You might've noticed the `words.` in front of every word on the clock: I used references to the `words` object, because we're going to change some properties [later](#3-making-a-word-to-matrix-program). But for now, we're just going to make the object with `text` properties to get the program to work.
```js
var words = { // Object with words
  "es": {"text": "es"},
  "ist": {"text": "ist"},
  "fünf": {"text": "fünf"},
  "zehn": {"text": "zehn"},
  "viertel": {"text": "viertel"},
  "zwanzig": {"text": "zwanzig"},
  "vor": {"text": "vor"},
  "nach": {"text": "nach"},
  "halb": {"text": "halb"},
  "ein": {"text": "ein"},
  "1": {"text": "eins"},
  "2": {"text": "zwei"},
  "3": {"text": "drei"},
  "4": {"text": "vier"},
  "5": {"text": "fünf"},
  "6": {"text": "sechs"},
  "7": {"text": "sieben"},
  "8": {"text": "acht"},
  "9": {"text": "neun"},
  "10": {"text": "zehn"},
  "11": {"text": "elf"},
  "12": {"text": "zwölf"},
  "uhr": {"text": "uhr"}
}
```

Now we can take the two code blocks above and paste them into a JS console to test it.

> Note: We can run the program in a JS interpreter, like a modern web browser or [NodeJS](https://nodejs.org).

```js
> time2words(22,34)
< (6) [{…}, {…}, {…}, {…}, {…}, {…}]
```

What you're seeing here is the array with objects. This might seem like a bug, but it's intentional. The good thing about objects is that we can just add properties containing additional information, which we'll need [later](#3-making-a-word-to-matrix-program). But if we want a working output, we have to write a little parser:
```js
function parser(array) { // Parser function
  var outputArray = []; // Create a empty output array
  for (var each of array) { // Loop through every object
    outputArray.push(each.text); // Add the text from each object to the array
  } // For end
  return outputArray.join(" "); // Return the array, joined with spaces for human readability. beep boop
} // End function (parser)
```

Now we just have to run `time2words` and use it as an argument for `parse`.
```js
> parser(time2words(22,34))
< "es ist fünf nach halb elf"

> parser(time2words(11,12))
< "es ist zehn nach elf"

> parser(time2words(16,20))
< "es ist zwanzig nach vier"
```

## WiP

---
## 3. Making a Word-To-Matrix program

> Warning: This section's documentation isn't finished yet!
---
## 4. Making the real clock

> **Warning: This section's documentation isn't finished yet, because I am still working on it!**
---
## 5. Displaying the current time

> **Warning: This section's documentation isn't finished yet, because I am still working on it!**
---
## 6. Building the clock

> **Warning: This section's documentation isn't finished yet, because I am still working on it!**

The materials that I'll need aren't a lot and i already have a lot of it, although I'm currently a bit unsure if I'm building the LED Matrix myself.
- 11x9 1-colored LEDs (like 5-15€ depending on the color, brightness etc.)
- Probably just wood for the casing, at the front Balsa wood, and at the back just any wood (like 5€ max because we have a lot of wood, except for the balsa wood, at home)
- Arduino (0€, already have one)
- Power supply (0€, i can just use a powerbank)
- Maybe an LED Matrix (if i cant build the matrix myself, but i think i could pull it off)
All in all, its about 10-20€ maximum.


