// Initializing game data
let min = 1,
    max = 10,
    winningNum = Math.floor(Math.random()*(max-min+1)+min),
    guessesLeft = 3;

// Selectors
const game = document.querySelector('#game'),
      minNum = document.querySelector('.min-num'),
      maxNum = document.querySelector('.max-num'),
      guessInput = document.querySelector('#guess-input'),
      guessBtn = document.querySelector('#guess-btn'),
      message = document.querySelector('.message');


minNum.textContent = min;
maxNum.textContent = max; 

// Event HAndlers
game.addEventListener('mousedown',(e)=>{
    if(e.target.className === 'play-again'){
        window.location.reload();
    }
})

guessBtn.addEventListener('click',()=>{
    let guess = parseInt(guessInput.value);

    if(isNaN(guess) || guess < min || guess > max){
        setMessage(`Please enter a number between ${min} ${max}`,'red')
    }

    if(guess === winningNum){
        guessInput.disabled = true
        guessInput.style.borderColor = 'green'
        guessBtn.value = 'Play Again'
        guessBtn.className += 'play-again'
        setMessage(`Hola you guess it right! ${winningNum} is the wining number `,'green')
    } else {
        guessesLeft -= 1
        if(guessesLeft === 0){
            guessInput.disabled = true
            guessBtn.value = 'Play Again'
            guessBtn.className += 'play-again'
            guessBtn.style.borderColor = 'red'
            setMessage(`Game Over You lost, The Correct Number is ${winningNum}`, 'red')
        } else {
            if(guess > winningNum){
                guessInput.style.borderColor = 'red'
                guessInput.value = ''
                setMessage(`Your guess is High. ${guessesLeft} guess left`,'black')
            } else{
                guessInput.style.borderColor = 'red'
                guessInput.value = ''
                setMessage(`Your guess is Low. ${guessesLeft} guess left`,'black')
            }
        }
    }
}) 

// Set Error
function setMessage(msg, color){
    message.style.color = color
    message.textContent = msg
}
