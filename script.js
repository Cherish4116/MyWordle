
const rows=document.querySelectorAll(".dabbas");
let Currows=0;
let Word="";
let visited="";
let Gamerunning=true;
const Enterbtn=document.getElementById("Enterbtn");
const UserIP=document.getElementById("UserIP");
const Output=document.getElementById("output");
const allboxes=document.querySelectorAll(".dabba1");
Enterbtn.addEventListener("click",()=>{
    
const correctword="SUNNY";
    
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

   else{
    const boxes=rows[Currows].querySelectorAll(".dabba1");
    for(let i=0;i<5;i++){
        const letter=Guess[i];

        Word+=letter;
        setTimeout(()=>{
            boxes[i].textContent=letter;
        if(letter===correctword[i]){
            boxes[i].classList.replace("dabba1","Rightplace");
        }
        else if(correctword.includes(letter)&&!visited.includes(letter)){
            boxes[i].classList.replace("dabba1","Wrongplace");
        }
        else{
            boxes[i].classList.replace("dabba1","Noletter");
        }

        visited+=letter;

        boxes[i].classList.add("animate-flip");

setTimeout(() => {
  boxes[i].classList.remove("animate-flip");
}, 400);
        },i*200);
    }

    setTimeout(()=>{
    Currows++;
    UserIP.value="";
    Output.textContent="";
    Output.classList.remove("errorbar");
    if(Word===correctword){
        Output.classList.add("errorbar");
        Output.textContent="You have guessed the word!";
        Gamerunning=false;
    }
    Word="";
    visited="";
},5*200);
   }
}
);

UserIP.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        Enterbtn.click();
    }
});


function Reset(){
    allboxes.forEach((box)=>{
        box.classList.replace("Rightplace","dabba1");
        box.classList.replace("Wrongplace","dabba1");  
        box.classList.replace("Noletter","dabba1");
        box.textContent="";    
    })
    Gamerunning=true;
    UserIP.value="";
    Output.textContent="";
    Output.classList.remove("errorbar");
    Word="";
    visited="";
    Currows=0;
}

