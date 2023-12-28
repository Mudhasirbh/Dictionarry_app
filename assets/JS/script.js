// Get necessary elements from the DOM
const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
volume = wrapper.querySelector(".word i"),
infoText = wrapper.querySelector(".info-text"),
synonyms = wrapper.querySelector(".synonyms .list"),
removeIcon = wrapper.querySelector(".search .material-icons");

// Handle the data received from the API
function data(result, word) {
// Check if the API response indicates an error
if (result.title) {
  // Display an error message if the word is not found
  infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
} else {
  // Populate the UI with the result data
  wrapper.classList.add("active");
  let definitions = result[0].meanings[0].definitions[0];
  let phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;

  document.querySelector(".word p").innerText = result[0].word;
  document.querySelector(".word span").innerText = phontetics;
  document.querySelector(".meaning span").innerText = definitions.definition;
  document.querySelector(".example span").innerText = definitions.example;

  // Display synonyms and antonyms if available
  displayList(".synonyms .list", definitions.synonyms);

  if (definitions.antonyms && definitions.antonyms.length > 0) {
    displayList(".antonyms .list", definitions.antonyms);
    document.querySelector(".antonyms").style.display = "block";
  } else {
    document.querySelector(".antonyms").style.display = "none";
  }

  // Add the searched word to the search history
  showInHistory(word);
}
}

// Display a list of words in a specified container
function displayList(selector, words) {
const listContainer = document.querySelector(selector);
listContainer.innerHTML = "";

for (let i = 0; i < words.length; i++) {
  let tag = `<span onclick="search('${words[i]}')">${words[i]},</span>`;
  tag = i === words.length - 1 ? `<span onclick="search('${words[i]}')">${words[i]}</span>` : tag;
  listContainer.insertAdjacentHTML("beforeend", tag);
}
}

// Initiate a new search for a word
function search(word) {
fetchApi(word);
searchInput.value = word;
}

// Fetch data from the dictionary API
function fetchApi(word) {
// Reset the UI and display loading message
wrapper.classList.remove("active");
infoText.style.color = "#000";
infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
// Construct the API URL
let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
// Fetch data from the API
fetch(url)
  .then(response => response.json())
  .then(result => data(result, word))
  .catch(() => {
    // Handle errors if the API request fails
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  });
}

// Listen for Enter key press in the search input
searchInput.addEventListener("keyup", (e) => {
let word = e.target.value.replace(/\s+/g, ' ');
if (e.key === "Enter" && word) {
  // Initiate a new search when Enter key is pressed
  fetchApi(word);
}
});

// Clear the search input and reset the UI when the close button is clicked
removeIcon.addEventListener("click", () => {
searchInput.value = "";
searchInput.focus();
wrapper.classList.remove("active");
infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});

// Display the searched word in the search history
function showInHistory(word) {
const historyContainer = document.getElementById("historyContainer");

// Create a new history item and append it to the container
const historyItem = document.createElement("div");
historyItem.textContent = word;

historyContainer.appendChild(historyItem);
}

// Toggle the visibility of the search history container
function toggleHistory() {
const historyContainer = document.getElementById("historyContainer");
historyContainer.style.display = historyContainer.style.display === "block" ? "none" : "block";
}