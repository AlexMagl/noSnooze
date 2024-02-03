function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;

  const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
  document.getElementById('clock').innerText = formattedTime;
}

function startClock() {
  setInterval(updateClock, 1000);
}

startClock();

document.getElementById("setAlarm").addEventListener("click", function () {
  const alarmTime = document.getElementById("alarmTime").value;
  const timeArray = alarmTime.split(":");
  const hours = parseInt(timeArray[0]);
  const minutes = parseInt(timeArray[1]);

  const current = new Date();
  const alarm = new Date();
  alarm.setHours(hours);
  alarm.setMinutes(minutes);
  alarm.setSeconds(0);

  const timeToAlarm = alarm - current;

  if (timeToAlarm > 0) {
    let alarmInterval;

    // Start checking for answer submission
    alarmInterval = setInterval(function () {
      const now = new Date().getTime();
      const distance = alarm - now;

      if (distance <= 0) {
        clearInterval(alarmInterval); // Stop checking for answer when the alarm goes off
        document.getElementById("countdown").innerText = "ALARM!";
        showQuestionPopup();
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("countdown").innerText =
          `${hours}h ${minutes}m ${seconds}s `;
      }
    }, 1000);
  } else {
    alert("Invalid time for the alarm.");
  }
});

// Function to show the question popup
function showQuestionPopup() {
  fetch(
    "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=boolean"
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.results.length > 0) {
        const question = result.results[0].question;
        const correctAnswer = result.results[0].correct_answer;
        document.getElementById("question").innerText = question;
        document.getElementById("alarmSound").loop = true;
        document.getElementById("alarmSound").play();
        document.getElementById("questionPopup").style.display = "block";
        document.getElementById("setAlarm").correctAnswer = correctAnswer;
      } else {
        console.error("No question received from the API");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function submitAnswerPopup() {
  const userAnswer = document.getElementById("userAnswerPopup").value.trim();
  if (userAnswer !== "") {
    submitAnswer(userAnswer);
  }
}

function submitAnswer(answer) {
  const correctAnswer = document.getElementById("setAlarm").correctAnswer;
  const isCorrectAnswer = answer.toLowerCase() === correctAnswer.toLowerCase();

  if (isCorrectAnswer) {
    document.getElementById("alarmSound").pause();
    document.getElementById("questionPopup").style.display = "none";
    document.getElementById("setAlarm").disabled = false;
    document.getElementById("countdown").innerText = "";
  } else {
    changeQuestion();
  }
}

function changeQuestion() {
  showQuestionPopup();
}

var darklightmode = document.getElementById("darklightmode");

darklightmode.onclick = function() {
  document.body.classList.toggle("light-mode")
  if(document.body.classList.contains("light-mode")){
    darklightmode.src = "assets/images/sun.png"
  }else{
    darklightmode.src = "assets/images/moon.png"
  }
}