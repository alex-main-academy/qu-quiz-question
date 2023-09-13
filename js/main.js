// timer
let isTimerWork = true;

class CountdownTimer {
    constructor(minutes, seconds, element) {
        this.minutes = minutes;
        this.seconds = seconds;
        this.element = element;
        this.intervalId = null;
    }

    start() {
        this.intervalId = setInterval(() => {
            if (this.minutes === 0 && this.seconds === 0) {
                clearInterval(this.intervalId);

                // add active class to failure section if timer has stopped
                const allScreens = document.querySelectorAll(".js-screen");
                allScreens.forEach((screen) => {
                    screen.classList.remove("is-active");
                });
                document
                    .querySelector(".js-failure")
                    .classList.add("is-active");

                // send data if timer has stopped

                if (isTimerWork) {
                    const scriptURL =
                        "https://script.google.com/macros/s/AKfycbw4OksMn-XiYwn_vqtrtiBh2c0AJzqaduHx4Y9qtTs9WsiR620l18zTxDMHnAs0E9lDXQ/exec";

                    const dataForm = document.querySelector(".js-data-form");

                    dataForm.querySelector('input[name="phone"]').value = `'${document.querySelector('.js-data-phone').value}`

                    fetch(scriptURL, {
                        method: "POST",
                        body: new FormData(dataForm),
                    })
                        .then((response) => response.text()) // Преобразование ответа в текст
                        .then((data) => console.log("Success!")) // Обработка успешного ответа
                        .catch((error) =>
                            console.error("Error!", error.message)
                        ); // Обработка ошибки
                }

                return;
            }

            // change timer border color
            if (this.minutes === 2 && this.seconds <= 30) {
                document.querySelector(".js-timer").classList.add("orange");
            }
            if (this.minutes <= 0) {
                document.querySelector(".js-timer").classList.add("red");
            }

            if (this.seconds === 0) {
                this.minutes--;
                this.seconds = 59;
            } else {
                this.seconds--;
            }

            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        const minutesDisplay = this.padZero(this.minutes);
        const secondsDisplay = this.padZero(this.seconds);

        this.element.querySelector(".js-timer-minutes").textContent =
            minutesDisplay;
        this.element.querySelector(".js-timer-seconds").textContent =
            secondsDisplay;
    }

    padZero(value) {
        return value < 10 ? `0${value}` : value;
    }
}

const timerElement = document.querySelector(".js-timer");
const timer = new CountdownTimer(5, 0, timerElement);

// change section
const screen = document.querySelectorAll(".js-screen");
const changeScreenBtn = document.querySelector(".js-change-screen");
const dataInput = document.querySelectorAll(".js-data-input");

const handleSaveDataToLS = (name, phone, telegram) => {
    localStorage.setItem("user", JSON.stringify({ name, phone, telegram }));
};

const handleChangeScreenListener = () => {
    screen.forEach((elem) => {
        elem.classList.remove("is-active");
    });

    handleSaveDataToLS(
        dataInput[0].value,
        dataInput[1].value,
        dataInput[2].value
    );
    screen[1].classList.add("is-active");
    timer.start();
};

const handleIsAllInputNotEmpty = () => {
    if (
        dataInput[0].value !== "" &&
        dataInput[1].value !== "" &&
        dataInput[2].value !== ""
    ) {
        changeScreenBtn.classList.add("active");
        changeScreenBtn.addEventListener("click", handleChangeScreenListener);
    } else {
        changeScreenBtn.classList.remove("active");
        changeScreenBtn.removeEventListener(
            "click",
            handleChangeScreenListener
        );
    }
};

dataInput.forEach((elem) => {
    elem.addEventListener("input", handleIsAllInputNotEmpty);
});

// change question
const progressActive = document.querySelector(".js-progress-active");
const progressActiveMob = document.querySelector(".js-progress-active-mob");
const progressActiveMobMob = document.querySelector(
    ".js-progress-active-mob-mob"
);
const changeQuestionBtn = document.querySelector(".js-change-question");
const question = document.querySelectorAll(".js-question");
const radioInputs = document.querySelectorAll(".js-radio");
let questionIndex = 0;

const handleChangeActiveQestion = () => {
    for (let i = 0; i < question.length; i++) {
        question[i].classList.remove("is-active");
        changeQuestionBtn.classList.remove("active");
        changeQuestionBtn.removeEventListener(
            "click",
            handleChangeActiveQestionListener
        );

        if (i === questionIndex) {
            question[i].classList.add("is-active");
        }
    }
};

const handleChangeActiveQestionListener = () => {
    if (questionIndex === question.length - 1) {
        // add active class to success section
        const allScreens = document.querySelectorAll(".js-screen");
        allScreens.forEach((screen) => {
            screen.classList.remove("is-active");
        });
        document.querySelector(".js-success").classList.add("is-active");

        // add full data to google form
        isTimerWork = false;

        const minutes = parseInt(
            document.querySelector(".js-timer-minutes").textContent
        );
        const seconds = parseInt(
            document.querySelector(".js-timer-seconds").textContent
        );
        const allSeconds = minutes * 60 + seconds;
        const secondLast = 5 * 60 - allSeconds;
        const minutesLeft = Math.floor(secondLast / 60);
        const secondsLeft = secondLast % 60;
        const timeToQuiz = `${minutesLeft}min${secondsLeft}sec`;

        const scriptURL =
            "https://script.google.com/macros/s/AKfycbw4OksMn-XiYwn_vqtrtiBh2c0AJzqaduHx4Y9qtTs9WsiR620l18zTxDMHnAs0E9lDXQ/exec";

        const dataForm = document.querySelector(".js-quest-form");

        dataForm.querySelector('input[name="name"]').value =
            document.querySelector(".js-data-name").value;
        dataForm.querySelector('input[name="phone"]').value = `'${
            document.querySelector(".js-data-phone").value
        }`;
        dataForm.querySelector('input[name="telegram"]').value =
            document.querySelector(".js-data-telegram").value;
        dataForm.querySelector('input[name="time"]').value = timeToQuiz;

        fetch(scriptURL, {
            method: "POST",
            body: new FormData(dataForm),
        })
            .then((response) => response.text()) // Преобразование ответа в текст
            .then((data) => console.log("Success!", data)) // Обработка успешного ответа
            .catch((error) => console.error("Error!", error.message)); // Обработка ошибки

        return;
    } else {
        questionIndex++;
        handleChangeActiveQestion();
        progressActive.style.cssText = `
            transform: translateY(${questionIndex * 100}%);
        `;
        progressActiveMob.style.cssText = `
            transform: translateX(${questionIndex * 100}%);
        `;
        progressActiveMobMob.style.cssText = `
            transform: translateX(${questionIndex * 100}%);
        `;
    }
};

radioInputs.forEach((radio) => {
    radio.addEventListener("click", () => {
        if (
            (question[questionIndex].children[0].children[1].children[0]
                .children[0].checked &&
                question[questionIndex].children[1].children[1].children[0]
                    .children[0].checked) ||
            (question[questionIndex].children[0].children[1].children[1]
                .children[0].checked &&
                question[questionIndex].children[1].children[1].children[1]
                    .children[0].checked) ||
            (question[questionIndex].children[0].children[1].children[1]
                .children[0].checked &&
                question[questionIndex].children[1].children[1].children[0]
                    .children[0].checked) ||
            (question[questionIndex].children[0].children[1].children[0]
                .children[0].checked &&
                question[questionIndex].children[1].children[1].children[1]
                    .children[0].checked)
        ) {
            changeQuestionBtn.classList.add("active");
            changeQuestionBtn.addEventListener(
                "click",
                handleChangeActiveQestionListener
            );
        }
    });
});
