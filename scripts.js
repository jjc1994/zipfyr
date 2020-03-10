
let score = 0;

const startGame = () => {
  let startButton = document.getElementById("start");
  startButton.disabled = true;
  displayScore();
  round();
}

const round = async () => {
  let word1 = "";
  let word2 = "";
  do {
    word1 = await api1();
  }
  while (word1 === null || word1 === "");
  do {
    word2 = await api1();
  }
  while (word2 === null || word2 === "");
  if (word1 !== word2 && word1 !== "" && word2 !== "" && !(word1.includes("-")) && !(word2.includes("-")) && !(word1.includes(" ")) && !(word2.includes(" "))) {
    trigger = true;

    let startScreen = document.getElementById("title_screen");
    startScreen.style.display = "none";
    let playScreen = document.getElementById("play_screen");
    playScreen.style.display = "block";

    displayQuestion(word1, word2);
  }
  else {
    round();
  }
}

const displayScore = () => {
  let scoreSpan = document.getElementById("score_span");
  scoreSpan.textContent = "";
  scoreSpan.textContent = score;
}

const api1 = async () => {
  const response = await axios.get("https://random-word.ryanrk.com/api/en/word/random");
  return api2(response.data[0]);
}

const api2 = async (query) => {
  const response = await axios.get("https://api.datamuse.com/words/?sp=" + query + "&max=1");
  if (response.data.length === 0) {
    return "";
  }
  else if (query.toLowerCase() === response.data[0].word) {
    return query.toLowerCase();
  }
  else {
    return response.data[0].word;
  }
}

const api3 = async (query) => {
  const response = await axios.get("https://api.datamuse.com/words/?sp=" + query + "&max=1&md=fr");
  if (query.toLowerCase() === response.data[0].word) {
    return response.data[0].tags[1];
  }
  else {
    return "";
  }
}

const displayQuestion = (word1, word2) => {

  let left_screen = document.getElementById("left");
  left_screen.style.backgroundImage = "linear-gradient(silver, grey)";
  let right_screen = document.getElementById("right");
  right_screen.style.backgroundImage = "linear-gradient(silver, grey)";

  let leftButton = document.getElementById("left_button");
  leftButton.innerHTML = "";
  let leftButtonCreate = document.createElement("button");
  leftButtonCreate.id = "left_choice";
  leftButtonCreate.disabled = false;
  leftButtonCreate.innerText = word1;
  leftButtonCreate.addEventListener("click", function () { disableButtons(word1, word2, "left") });
  leftButton.appendChild(leftButtonCreate);

  let rightButton = document.getElementById("right_button");
  rightButton.innerHTML = "";
  let rightButtonCreate = document.createElement("button");
  rightButtonCreate.id = "right_choice";
  rightButtonCreate.disabled = false;
  rightButtonCreate.innerText = word2;
  rightButtonCreate.addEventListener("click", function () { disableButtons(word1, word2, "right") });
  rightButton.appendChild(rightButtonCreate);

  let leftLine = document.getElementById("left_line");
  leftLine.style.display = "none";
  let leftFreq = document.getElementById("left_freq");
  leftFreq.textContent = "";

  let rightLine = document.getElementById("right_line");
  rightLine.style.display = "none";
  let rightFreq = document.getElementById("right_freq");
  rightFreq.textContent = "";

  let leftResponse = document.getElementById("left_response");
  leftResponse.innerHTML = "";
  let leftDiv = document.getElementById("left_verdict");
  leftDiv.style.display = "none";

  let rightResponse = document.getElementById("right_response");
  rightResponse.innerHTML = "";
  let rightDiv = document.getElementById("right_verdict");
  rightDiv.style.display = "none";

  let playScreen = document.getElementById("play_screen");
  playScreen.style.display = "grid";

}

const disableButtons = (word1, word2, choice) => {

  let leftChoice = document.getElementById("left_choice");
  leftChoice.disabled = true;
  let rightChoice = document.getElementById("right_choice");
  rightChoice.disabled = true;
  checkFreq(word1, word2, choice);

}

const checkFreq = async (word1, word2, choice) => {

  let freq1str = await api3(word1);
  let freq2str = await api3(word2);
  let freq1 = parseFloat(freq1str.substring(2));
  let freq2 = parseFloat(freq2str.substring(2));

  let leftLine = document.getElementById("left_line");
  leftLine.style.display = "block";
  let leftFreq = document.getElementById("left_freq");
  leftFreq.textContent = freq1;

  let rightLine = document.getElementById("right_line");
  rightLine.style.display = "block";
  let rightFreq = document.getElementById("right_freq");
  rightFreq.textContent = freq2;

  if (freq1 > freq2 && choice === "left") {
    correct(choice);
  }
  else if (freq2 > freq1 && choice === "right") {
    correct(choice);
  }
  else if (freq1.toString() === freq2.toString()) {
    rare(choice);
  }
  else {
    incorrect(choice);
  }

  setTimeout(function () {
    round();
  }, 4000);
}

const correct = (choice) => {
  score = score + 1;
  displayScore();
  let screen = document.getElementById(choice);
  screen.style.backgroundImage = "linear-gradient(green, darkgreen)";
  let verdictResponse = document.getElementById(choice + "_response");
  verdictResponse.insertAdjacentText("beforeend", "Correct!");
  let verdictDiv = document.getElementById(choice + "_verdict");
  verdictDiv.style.display = "block";
}

const incorrect = (choice) => {
  score = score + 0;
  displayScore();
  let screen = document.getElementById(choice);
  screen.style.backgroundImage = "linear-gradient(red, firebrick)";
  let verdictResponse = document.getElementById(choice + "_response");
  verdictResponse.insertAdjacentText("beforeend", "Incorrect!");
  let verdictDiv = document.getElementById(choice + "_verdict");
  verdictDiv.style.display = "block";
}

const rare = (choice) => {
  displayScore();
  let screen = document.getElementById(choice);
  screen.style.backgroundImage = "linear-gradient(darkgrey, grey)";
  let verdictResponse = document.getElementById(choice + "_response");
  verdictResponse.insertAdjacentText("beforeend", "Tie!");
  let verdictDiv = document.getElementById(choice + "_verdict");
  verdictDiv.style.display = "block";
}
