let pomodoroSession = 1;
let recess = false;
let session = 0;

const audioCtx = new (window.AudioContext || window.webkitAudioContext);
const startButton = document.querySelector('.buttons a:nth-child(1)');
const resetButton = document.querySelector('.buttons a:nth-child(2)');
const timer = document.getElementById('timer');
const indexCircle = document.getElementById('index-circle');

let toggleIndexCircleClass = () => {
    indexCircle.classList.add('animate');
    setTimeout(() => indexCircle.classList.remove('animate'), 500);
}

let initializeTimer = () => {
    startButton.classList.add('disabled');
    
    let minutes = 25;
    let seconds = 0;
    
    let leadingZero = (num) => (num<10) ? '0' + num : num;
    
    timer.innerHTML = leadingZero(minutes) + ':' + '00';
    indexCircle.innerHTML = 1;
    toggleIndexCircleClass();

    session = setInterval(() => {
        
        if(seconds === 0) {
            seconds = 59;
            --minutes;
        } else {
            --seconds;
        }
        
        timer.innerHTML = leadingZero(minutes) + ':' + leadingZero(seconds);
        
        if(minutes === 0 && seconds === 0){
            
            beep();
            
            if(!recess && pomodoroSession%3 !== 0) {
                indexCircle.textContent = 'B';
                toggleIndexCircleClass();
                ++pomodoroSession;
                minutes = 5;
            } else if(!recess && pomodoroSession%3 === 0){
                indexCircle.textContent = 'B';
                toggleIndexCircleClass();
                ++pomodoroSession;
                minutes = 15;
            } else if(recess) {
                indexCircle.textContent = pomodoroSession;
                toggleIndexCircleClass();
                minutes = 25;
            }
            
            recess = !recess;
        }
    }, 1000);
}

let resetTimer = () => {
    clearInterval(session);
    timer.innerHTML = '00:00';
    pomodoroSession = 1;
    recess = false;
    indexCircle.innerHTML = 0;
    startButton.classList.remove('disabled');
}

let beep = () => {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 440;
    
    oscillator.start();
    setTimeout(() => { oscillator.stop() }, 1000);
}

startButton.addEventListener('click', initializeTimer);
resetButton.addEventListener('click', resetTimer);