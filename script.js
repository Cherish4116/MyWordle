const rows = document.querySelectorAll(".dabbas");
let Currows = 0;
let Gamerunning = true;
let isAnimating = false;
const Enterbtn = document.getElementById("Enterbtn");
const UserIP = document.getElementById("UserIP");
const Output = document.getElementById("output");
const allboxes = document.querySelectorAll(".dabba1");
Enterbtn.addEventListener("click", () => {
    if (isAnimating) return;

    const correctword = "CRAFT";

    if (!Gamerunning) {
        Output.classList.add("errorbar");
        Output.textContent = "Game over! Click reset to try again.";
        return;
    }

    if (Currows >= 6) {
        Output.classList.add("errorbar");
        Output.textContent = "No Guesses left. Click reset to try again.";
        Gamerunning = false;
        return;
    }
    let rawInput = UserIP.value;
    let Guess = rawInput.toUpperCase();
    if (!/^[A-Za-z]{5}$/.test(rawInput)) {
        Output.classList.add("errorbar");
        Output.textContent = "Please enter a valid 5-letter word (letters only, no spaces)";
        return;
    }

    else {
        isAnimating = true;
        const boxes = rows[Currows].querySelectorAll(".dabba1");
        UserIP.value = "";
        Output.textContent = "";
        Output.classList.remove("errorbar");
        const letterCount = {};
        for (let letter of correctword) {
            if (letterCount[letter]) {
                letterCount[letter] += 1;
            }
            else {
                letterCount[letter] = 1;
            }
        }

        const result = Array(5).fill("gray");
        for (let i = 0; i < 5; i++) {
            if (Guess[i] === correctword[i]) {
                result[i] = "green";
                letterCount[Guess[i]]--;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (result[i] === "green") continue;
            if (correctword.includes(Guess[i]) && letterCount[Guess[i]] > 0) {
                result[i] = "yellow";
                letterCount[Guess[i]]--;
            }
        }

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                boxes[i].textContent = Guess[i];
                if (result[i] === "green") {
                    boxes[i].classList.replace("dabba1", "Rightplace");
                } else if (result[i] === "yellow") {
                    boxes[i].classList.replace("dabba1", "Wrongplace");
                } else {
                    boxes[i].classList.replace("dabba1", "Noletter");
                }

                boxes[i].classList.add("animate-flip");
                setTimeout(() => {
                    boxes[i].classList.remove("animate-flip");
                }, 400);
            }, i * 200);
        }

        setTimeout(() => {
            Currows++;
            if (Guess === correctword) {
                Output.classList.add("errorbar");
                Output.textContent = "You have guessed the word!";
                Gamerunning = false;
            }
            isAnimating = false;
            UserIP.focus();
        }, 5 * 200 + 100);
    }
});

UserIP.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !isAnimating) {
        Enterbtn.click();
    }
});


function Reset() {
    allboxes.forEach((box) => {
        box.classList.replace("Rightplace", "dabba1");
        box.classList.replace("Wrongplace", "dabba1");
        box.classList.replace("Noletter", "dabba1");
        box.textContent = "";
    })
    Gamerunning = true;
    UserIP.value = "";
    Output.textContent = "";
    Output.classList.remove("errorbar");
    Word = "";
    visited = "";
    Currows = 0;
}
