// Elementos do DOM
const chatBox = document.getElementById('chat');
const optionsArea = document.getElementById('options');
const scoreDisplay = document.getElementById('score-display');
const trophyAnimation = document.getElementById('trophy-animation');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const quizContainer = document.getElementById('quizContainer');

// Variáveis globais
let currentUser = null;
let totalScore = 0;
let currentCategory = "";
let currentQuestion = 0;
const categories = ['Ciências', 'Matemática', 'História', 'História Geral'];

// Sons
const correctSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
const wrongSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
const levelUpSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
const gameOverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-over-trombone-1940.mp3');
const suspenseSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-suspense-mystery-bass-685.mp3');
const victorySound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
const applauseSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-audience-light-applause-354.mp3');
const motivationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-show-suspense-waiting-667.mp3');

// Perguntas do quiz
const questions = {
    'Ciências': [
        {
            question: "Qual é o maior planeta do sistema solar?",
            options: ["Júpiter", "Saturno", "Netuno", "Urano"],
            correctAnswer: "Júpiter"
        },
        {
            question: "Qual é o símbolo químico do ouro?",
            options: ["Au", "Ag", "Fe", "Cu"],
            correctAnswer: "Au"
        },
        {
            question: "Qual é o osso mais longo do corpo humano?",
            options: ["Fêmur", "Tíbia", "Úmero", "Fíbula"],
            correctAnswer: "Fêmur"
        }
    ],
    'Matemática': [
        {
            question: "Quanto é 7 x 8?",
            options: ["54", "56", "58", "60"],
            correctAnswer: "56"
        },
        {
            question: "Qual é a raiz quadrada de 144?",
            options: ["10", "11", "12", "13"],
            correctAnswer: "12"
        },
        {
            question: "Qual é o valor de π (pi) arredondado para duas casas decimais?",
            options: ["3.14", "3.15", "3.16", "3.17"],
            correctAnswer: "3.14"
        }
    ],
    'História': [
        {
            question: "Em que ano o Brasil foi descoberto?",
            options: ["1492", "1500", "1503", "1510"],
            correctAnswer: "1500"
        },
        {
            question: "Quem foi o primeiro presidente do Brasil?",
            options: ["Getúlio Vargas", "Juscelino Kubitschek", "Deodoro da Fonseca", "Tancredo Neves"],
            correctAnswer: "Deodoro da Fonseca"
        },
        {
            question: "Em que ano ocorreu a Independência do Brasil?",
            options: ["1808", "1822", "1889", "1930"],
            correctAnswer: "1822"
        }
    ],
    'História Geral': [
        {
            question: "Quem foi o primeiro imperador romano?",
            options: ["Júlio César", "Augusto", "Nero", "Calígula"],
            correctAnswer: "Augusto"
        },
        {
            question: "Em que ano começou a Primeira Guerra Mundial?",
            options: ["1912", "1914", "1916", "1918"],
            correctAnswer: "1914"
        },
        {
            question: "Quem pintou a Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correctAnswer: "Leonardo da Vinci"
        }
    ]
};

// Funções de login e registro
function showLoginForm() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
}

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    // Aqui você deve implementar a lógica de verificação do login
    // Por enquanto, vamos apenas simular um login bem-sucedido
    currentUser = username;
    loginForm.style.display = 'none';
    quizContainer.style.display = 'block';
    startQuiz();
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    // Aqui você deve implementar a lógica de registro
    // Por enquanto, vamos apenas simular um registro bem-sucedido
    showLoginForm();
}

// Funções do quiz
function startQuiz() {
    addMessage(`Bem-vindo, ${currentUser}! Escolha uma categoria:`, 'bot');
    showCategories();
}
function showCategories() {
    optionsArea.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.innerText = category;
        button.onclick = () => selectCategory(category);
        optionsArea.appendChild(button);
    });
}

function selectCategory(category) {
    currentCategory = category;
    currentQuestion = 0;
    addMessage(`Você escolheu ${category}. Vamos começar!`, 'bot');
    askQuestion();
}

function askQuestion() {
    if (currentQuestion < questions[currentCategory].length) {
        const questionData = questions[currentCategory][currentQuestion];
        addMessage(questionData.question, 'bot');
        showOptions(questionData.options);
    } else {
        endCategory();
    }
}

function showOptions(options) {
    optionsArea.innerHTML = '';
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.innerText = option;
        button.onclick = () => checkAnswer(option, button);
        optionsArea.appendChild(button);
    });
}

function checkAnswer(selectedOption, selectedButton) {
    const correctAnswer = questions[currentCategory][currentQuestion].correctAnswer;
    if (compareStrings(selectedOption, correctAnswer)) {
        totalScore += 10;
        correctSound.play();
        addMessage(`✅ Resposta correta, ${currentUser}! Você ganhou 10 pontos. Continue assim!`, 'bot');
        selectedButton.classList.add('correct-answer');
    } else {
        wrongSound.play();
        selectedButton.classList.add('wrong-answer');
        addMessage(`❌ Resposta errada, ${currentUser}. A resposta correta era: ${correctAnswer}`, 'bot');
    }
    updateScoreDisplay();
    currentQuestion++;
    setTimeout(askQuestion, 2000);
}

function compareStrings(str1, str2) {
    return str1.toLowerCase().trim() === str2.toLowerCase().trim();
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Pontuação Total: ${totalScore} | Categoria: ${currentCategory}`;
    scoreDisplay.style.animation = 'pulse 0.5s';
    setTimeout(() => scoreDisplay.style.animation = '', 500);
}

function endCategory() {
    addMessage(`Você completou todas as perguntas de ${currentCategory}!`, 'bot');
    setTimeout(() => {
        addMessage("Escolha outra categoria ou clique em 'Finalizar' para encerrar o quiz.", 'bot');
        showCategories();
        const finishButton = document.createElement('button');
        finishButton.classList.add('option-btn');
        finishButton.innerText = 'Finalizar';
        finishButton.onclick = endGame;
        optionsArea.appendChild(finishButton);
    }, 1000);
}

function endGame() {
    stopAllSounds();
    if (totalScore >= 30) {
        victorySound.play();
        applauseSound.play();
        trophyAnimation.style.display = 'block';
        addMessage(`🏆 Parabéns, ${currentUser}! Você completou o quiz com ${totalScore} pontos! Você é incrível! 🎉`, 'bot');
    } else {
        gameOverSound.play();
        motivationSound.play();
        addMessage(`😔 ${currentUser}, você finalizou o quiz com ${totalScore} pontos. Continue praticando e melhore sua pontuação! 💪`, 'bot');
    }
    setTimeout(() => {
        trophyAnimation.style.display = 'none';
        resetQuiz();
    }, 5000);
}

function resetQuiz() {
    totalScore = 0;
    currentCategory = "";
    currentQuestion = 0;
    updateScoreDisplay();
    addMessage("Quiz reiniciado. Escolha uma nova categoria para começar!", 'bot');
    showCategories();
}

function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function stopAllSounds() {
    [correctSound, wrongSound, levelUpSound, gameOverSound, suspenseSound, victorySound, applauseSound, motivationSound].forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

// Inicialização
showLoginForm();

// Correção para o problema de som
document.body.addEventListener('click', () => {
    correctSound.play().then(() => correctSound.pause());
    wrongSound.play().then(() => wrongSound.pause());
    levelUpSound.play().then(() => levelUpSound.pause());
    gameOverSound.play().then(() => gameOverSound.pause());
    suspenseSound.play().then(() => suspenseSound.pause());
    victorySound.play().then(() => victorySound.pause());
    applauseSound.play().then(() => applauseSound.pause());
    motivationSound.play().then(() => motivationSound.pause());
}, { once: true });

// Adiciona efeito de hover 3D ao container
quizContainer.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = quizContainer.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    quizContainer.style.transform = `
        perspective(1000px)
        rotateX(${(y - 0.5) * 10}deg)
        rotateY(${(x - 0.5) * 10}deg)
        translateZ(20px)
    `;
});

quizContainer.addEventListener('mouseleave', () => {
    quizContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
});
    
