// Калькулятор с "особенностями" для код-ревью

let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

function updateDisplay() {
    const display = document.getElementById('display');
    display.innerText = displayValue;
}

function inputDigit(digit) {
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    
    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
}

function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    waitingForSecondOperand = false;
    operator = null;
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }
    
    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        displayValue = String(result);
        firstOperand = result;
        updateDisplay();
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
}

function calculate(first, second, op) {
    switch (op) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '*':
            return first * second;
        case '/':
            if (second === 0) {
                return 'Ошибка';
            }
            return first / second;
        default:
            return second;
    }
}

// Проблемная функция - может упасть
function calculatePercentage() {
    let value = parseFloat(displayValue);
    value = value / 100;
    displayValue = String(value);
    updateDisplay();
}

// Неиспользуемая функция
function unusedFunction() {
    console.log("Эта функция нигде не используется");
}

// Глобальная переменная (плохая практика)
window.someGlobalVar = "это глобальная переменная";

// Проблема с обработкой событий
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        inputDigit(button.innerText);
    });
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        handleOperator(button.innerText);
    });
});

document.querySelector('.clear').addEventListener('click', () => {
    clearDisplay();
});

document.querySelector('.equals').addEventListener('click', () => {
    if (operator && !waitingForSecondOperand) {
        handleOperator('=');
    }
});

document.querySelector('.decimal').addEventListener('click', () => {
    inputDecimal();
});

// Проблема: нет обработки клавиатуры
// Проблема: нет ограничения длины числа
// Проблема: при делении на 0 выводится строка, но дальше калькулятор ломается