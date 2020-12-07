[](Hey_there!)
[](If_you're_not_here_to_modify_the_markdown_source_code:)
[](This_should_be_displayed_as_markdown,)
[](so_please_open_it_in_a_markdown_compatible_program)
[](to_view_this_document!)


<p align="center">
  <h1 align="center">Word Clock Project Summary</h1>
</p>

Hey there! This is the Project Summary of my Word Clock Project!

Before we get started, i'd like to mention two things: 
1. This whole summary, and the code, are all written in English, because almost everything code-related is also in English.For Example: It would be weird to call a integer a *"integer"* in the declaration and then a *"Ganzzahl"* in the variable name, so I just chose to make this in English instead of German, even though the clock itself is in German.
2. I use a lot of links, and if you get tired of clicking every single link, try hovering over it to see where its destination is, or to be precise, which paragraph is linked. [You can try it here](#Here-are-destinations-or-paragraphs-displayed).

So to start off, here's an example to give you the gist:
###### (note: ignore the quotation marks, they are used to highlight words)

```js
"e s"H"i s t"G f ü n f
 z e h n"z w a n z i g"
 v i e r t e l E"v o r"
 n a c h Ä h a l b X I
 z w e i n"s i e b e n"
 e l f ü n f z w ö l f
 z e h n e u n d r e i
 a c h t P L s e c h s
 v i e r u h r S Y N C
```

If you look at all the letters, you can see how this clock works. It has all words that are required to spell out every time of the day with 5 minutes accuracy on it, allowing you to display the time by highlighting some of the words (see the [example](#(note:-ignore-the-quotation-marks,-they-are-used-to-highlight-words))). And that's basically it.

But making it a real thing isnt that easy, because you need to do these things:
1. [Make a letter matrix with all words on it, with the least possible amount of letters.](#making-the-letter-matrix)
2. [Make a program that gives you the time in words.](#making-a-time-to-word-program)
3. [Make a program that displays the words on the matrix.](#making-a-word-to-matrix-program)
4. [Display the matrix on a real LED Matrix](#making-the-real-clock)
5. [Displaying the current time on the clock](#displaying-the-current-time)
6. [Getting the materials and building the clock](#building-the-clock)

## Making the letter matrix

To start off, we need to analyze how time is spoken in German. Here are two examples:

> #### Es ist fünf vor halb zwei.

> #### Es ist drei Uhr.

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

3. #### The indicator if the relative is positive or negative 
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

So the next logical step would be to combine words for each category. What I mean by that is shown by this example:

```
"eins", "zwei", "sieben" ---> "zweinsieben"

zweinsieben
zwei

zweinsieben
  eins

zweinsieben
     sieben
```

We can overlap the words, because we only need one or zero words per category. We could do this by hand, but we could also just write a handy program that does it for us: 


```js
function overlaps(word1, word2) { // Overlaps checker. Expects 2 words as arguments and returns all overlaps as an array.
  var results = []; // Result array
  function overlap(word1, word2) { // Inner function
    var arr = word1.split(""); // Split the 1st word into an array
    var cutted = ""; // Variable for cutted letters
	  while (arr.length > 0) { // Loop while the array isn't empty
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
    if (overlaps(word1,word2).length != 0) { // Tests if there aren't 0 overlaps
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

We can run the program now (in this case in a browser or in NodeJS, because the program is written in JS) and this are the results if we put the [hour numbers](#the-time-in-hours) into the program: 

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

```js
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

And you might've noticed the capitalized letters. They are just random letters that aren't important, I just filled them in to avoid gaps and to spell some easter eggs. And if you're wondering why it says "PLS SYNC" at the bottom: This will become useful [later](#displaying-the-current-time).

## Making a Time-to-Word program

> Warning: This section's documentation isn't finished yet!

As you might have noticed in [the section above](#making-the-letter-matrix) where we discussed the time rules: There are a *ton* of rules. So to make it much shorter and easier, we can use a lookup table. It would look like this:

```
0: not present, 1: present.
The words are in this order: 
fünf, zehn, viertel, zwanzig, vor, nach, halb, (thisHour), (nextHour), uhr
```

```js
var lookupObject = {
"00": "0000000101",
"05": "1000010100",
"10": "0100010100",
"15": "0010010100",
"20": "0001010100",
"25": "1000101010",
"30": "0000001010",
"35": "1000011010",
"40": "0001100010",
"45": "0010100010",
"50": "0100100010",
"55": "1000100010"}
```

Now we just need to make a program to look the words up and return them.

# WiP

## Making a Word-To-Matrix program

> Warning: This section's documentation isn't finished yet!

## Making the real clock

> **Warning: This section's documentation isn't finished yet, because I am still working on it!**

## Displaying the current time

> **Warning: This section's documentation isn't finished yet, because I am still working on it!**

## Building the clock

> **Warning: This section's documentation isn't finished yet, because I am still working on it!**

The materials that I'll need aren't a lot and i already have a lot of it, although I'm currently a bit unsure if I'm building the LED Matrix myself.
- 11x9 1-colored LEDs (like 5-15€ depending on the color, brightness etc.)
- Probably just wood for the casing, at the front Balsa wood, and at the back just any wood (like 5€ max because we have a lot of wood, except for the balsa wood, at home)
- Arduino (0€, already have one)
- Power supply (0€, i can just use a powerbank)
- Maybe an LED Matrix (if i cant build the matrix myself, but i think i could pull it off)
All in all, its about 10-20€ maximum.
