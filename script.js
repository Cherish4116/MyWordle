const rows = document.querySelectorAll(".dabbas");
let Currows = 0;
const wordList = [
    "apple", "grape", "brave", "crane", "flame", "blush", "cabin", "charm", "climb", "craft",
    "creak", "drink", "doubt", "draft", "elbow", "equal", "fancy", "feast", "flock", "glide",
    "glove", "grind", "habit", "harsh", "haunt", "ideal", "ivory", "jolly", "judge", "knife",
    "knock", "lemon", "latch", "lunar", "mango", "march", "match", "moist", "noble", "ocean",
    "piano", "plant", "plaza", "pride", "quake", "quiet", "quick", "raven", "reach", "rider",
    "risky", "rough", "saint", "scale", "shine", "shout", "siren", "skate", "slope", "smile",
    "spice", "spike", "stack", "stamp", "steal", "storm", "sugar", "swirl", "table", "tango",
    "teeth", "thank", "thief", "tight", "tiger", "toast", "trace", "trail", "trend", "trick",
    "truth", "twist", "unite", "urban", "vague", "vital", "vocal", "wheat", "whirl", "widen",
    "wrist", "wound", "yeast", "yield", "zebra", "pearl", "zonal", "bloom", "chase", "dwell",
    "grasp", "hinge", "jumpy", "nudge", "punch", "swoop", "jumbo", "grain", "ethos", "false"
];
let correctword = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
let Gamerunning = true;
let isAnimating = false;
const guessed = new Set();
const Enterbtn = document.getElementById("Enterbtn");
const UserIP = document.getElementById("UserIP");
const Output = document.getElementById("output");
const allboxes = document.querySelectorAll(".dabba1");

const wordCache = new Map();

async function isRealWord(word) {
    if (wordCache.has(word)) {
        return wordCache.get(word);
    }

    try {
        let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!res.ok) {
            wordCache.set(word, false);
            return false;
        }
        wordCache.set(word, true);
        return true;
    } catch (err) {
        throw new Error("Invalid check.Please check your internet ");
    }
}

Enterbtn.addEventListener("click", async () => {
    if (isAnimating) return;
    if (Currows >= 6) {
        Output.classList.add("errorbar");
        Output.textContent = "No Guesses left. Click reset to try again.";
        Gamerunning = false;
        return;
    }

    if (!Gamerunning) {
        Output.classList.add("errorbar");
        Output.textContent = "Game over! Click reset to try again.";

        return;
    }

    let rawInput = UserIP.value.trim();
    let Guess = rawInput.toUpperCase();
    if (!/^[A-Za-z]{5}$/.test(rawInput)) {
        Output.classList.add("errorbar");
        Output.textContent = "Please enter a valid 5-letter word ";
        return;
    }
    if (guessed.has(Guess)) {
        Output.classList.add("errorbar");
        Output.textContent = `You have already guessed "${rawInput}"`;
        return;
    }
    try {
        const isValid = await isRealWord(rawInput.toLowerCase());
        if (!isValid) {
            Output.classList.add("errorbar");
            Output.textContent = `"${rawInput}" is not a valid English word `;
            return;
        }
    } catch (error) {
        Output.classList.add("errorbar");
        Output.textContent = error.message;
        return;
    }
    guessed.add(Guess);
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
            if (!boxes[i]) return;
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
        if (Currows == 6) {
            Output.classList.add("errorbar");
            Output.textContent = `The word was ${correctword}`;
            Gamerunning = false;
        }
        if (Guess === correctword) {
            Output.classList.add("errorbar");
            Output.textContent = "You have guessed the word!";
            Gamerunning = false;
        }

        isAnimating = false;
        UserIP.focus();
    }, 5 * 200 + 100);
}
);

UserIP.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !isAnimating) {
        Enterbtn.click();
    }
});


function Reset() {
    if (isAnimating) return;
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
    correctword = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    Currows = 0;
    guessed.clear();
}

