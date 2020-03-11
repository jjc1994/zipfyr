
let score = 0;
let genSwitch = true;

const startGame = () => {
  let startButton = document.getElementById("start");
  startButton.disabled = true;
  displayScore();
  generate();
}

const generate = async () => {
  if (genSwitch) {
    let callA1 = async () => {
      await fetch("https://random-word.ryanrk.com/api/en/word/random").then(response1a => response1a.json()).then(function (response2a) {
        console.log(response2a);
        if (response2a.length === 0) {
          generate();
        }
        else {
          let wordA1 = response2a[0];
          let callB1 = async () => {
            await fetch("https://random-word.ryanrk.com/api/en/word/random").then(response1a => response1a.json()).then(function (response2b) {
              console.log(response2b);
              if (response2b.length === 0) {
                generate();
              }
              else {
                let wordB1 = response2b[0];

                let wordCheck = async () => { await checkWords(wordA1, wordB1); }
                wordCheck();

              }

            });
          }
          callB1();
        }
      });
    }
    callA1();
  }
}


const checkWords = async (wordA1, wordB1) => {
  let callA2 = async () => {
    await fetch("https://api.datamuse.com/words/?sp=" + wordA1 + "&max=1").then(response1a => response1a.json()).then(function (response2a) {
      console.log(response2a);

      let wordA = wordA1;
      if (response2a.length === 0) {
        wordA = "";
        generate();
      }
      else if (wordA.toLowerCase() === response2a[0].word) {
        wordA = wordA.toLowerCase();
      }
      else {
        wordA = response2a[0].word;
      }

      let callB2 = async () => {
        await fetch("https://api.datamuse.com/words/?sp=" + wordB1 + "&max=1").then(response1b => response1b.json()).then(function (response2b) {
          console.log(response2b);
          let wordB = wordB1;

          if (response2b.length === 0) {
            wordB = "";
            generate();
          }
          else if (wordB.toLowerCase() === response2b[0].word) {
            wordB = wordB.toLowerCase();
          }
          else {
            wordB = response2b[0].word;
          }

          console.log(wordA);
          console.log(wordB);

          if (wordA !== wordB && wordA !== "" && wordB !== "" && !(wordA.includes("-")) && !(wordB.includes("-")) && !(wordA.includes(" ")) && !(wordB.includes(" "))) {
            if (genSwitch) {
              let startScreen = document.getElementById("title_screen");
              startScreen.style.display = "none";
              let playScreen = document.getElementById("play_screen");
              playScreen.style.display = "block";
              displayQuestion(wordA, wordB);
            }
            genSwitch = false;
          }
          else {
            generate();
          }
        });
      }
      callB2();

    });
  }

  callA2();
}

const displayScore = () => {
  let scoreSpan = document.getElementById("score_span");
  console.log(score);
  scoreSpan.textContent = "";
  scoreSpan.textContent = score;
}

const displayQuestion = (wordA, wordB) => {

  let left_screen = document.getElementById("left");
  left_screen.style.backgroundImage = "linear-gradient(silver, grey)";
  let right_screen = document.getElementById("right");
  right_screen.style.backgroundImage = "linear-gradient(silver, grey)";

  let leftButton = document.getElementById("left_button");
  leftButton.innerHTML = "";
  let leftButtonCreate = document.createElement("button");
  leftButtonCreate.id = "left_choice";
  leftButtonCreate.disabled = false;
  leftButtonCreate.innerText = wordA;
  leftButtonCreate.addEventListener("click", function () { disableButtons(wordA, wordB, "left") });
  leftButton.appendChild(leftButtonCreate);

  let rightButton = document.getElementById("right_button");
  rightButton.innerHTML = "";
  let rightButtonCreate = document.createElement("button");
  rightButtonCreate.id = "right_choice";
  rightButtonCreate.disabled = false;
  rightButtonCreate.innerText = wordB;
  rightButtonCreate.addEventListener("click", function () { disableButtons(wordA, wordB, "right") });
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

const disableButtons = (wordA, wordB, choice) => {

  let leftChoice = document.getElementById("left_choice");
  leftChoice.disabled = true;
  let rightChoice = document.getElementById("right_choice");
  rightChoice.disabled = true;
  checkFreq(wordA, wordB, choice);

}

const checkFreq = async (wordA, wordB, choice) => {

  const callA3 = async () => {
    await fetch("https://api.datamuse.com/words/?sp=" + wordA + "&max=1&md=fr").then(response1 => response1.json()).then(function (response2a) {
      console.log(response2a);
      if (response2a.length === 0) {
        setTimeout(function () {
          callA3();
        }, 1000);
      }
      else if (wordA.toLowerCase() === response2a[0].word) {
        freq1str = response2a[0].tags[1];
        const callB3 = async () => {
          await fetch("https://api.datamuse.com/words/?sp=" + wordB + "&max=1&md=fr").then(response1 => response1.json()).then(function (response2b) {
            console.log(response2b);
            if (response2b.length === 0) {
              setTimeout(function () {
                callB3();
              }, 1000);
            }
            else if (wordB.toLowerCase() === response2b[0].word) {
              freq2str = response2b[0].tags[1];
              postAnswer(wordA, wordB, choice, freq1str, freq2str);
            }
          });
        }
        callB3();
      }
    });
  }
  callA3();
}

const postAnswer = (wordA, wordB, choice, freq1str, freq2str) => {
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
    genSwitch = true;
    generate();
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
