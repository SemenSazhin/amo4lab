// Калькулятор с исправленными багами

let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;
let lastOperator = null;
let lastOperand = null;
const MAX_DIGITS = 12;

function updateDisplay() {
    const display = document.getElementById('display');
    // Исправление: ограничение длины числа
    if (displayValue.replace(/[^0-9]/g, '').length > MAX_DIGITS) {
        const num = parseFloat(displayValue);
        if (!isNaN(num)) {
            displayValue = num.toPrecision(MAX_DIGITS).replace(/\.?0+$/, '');
        }
    }
    display.innerText = displayValue;
}

function inputDigit(digit) {
    // Исправление: ограничение длины числа
    if (displayValue.replace(/[^0-9]/g, '').length >= MAX_DIGITS) {
        return;
    }
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
        
        // Исправление: деление на ноль не ломает калькулятор
        if (result === 'Ошибка') {
            displayValue = 'Ошибка';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = true;
            updateDisplay();
            return;
        }
        
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
    if (displayValue === 'Ошибка') {
        clearDisplay();
        return;
    }
    if (operator && !waitingForSecondOperand) {
        const inputValue = parseFloat(displayValue);
        // Сохраняем для повторного нажатия "="
        lastOperator = operator;
        lastOperand = inputValue;
        handleOperator('=');
    } else if (lastOperator && lastOperand !== null) {
        // Исправление: повторное нажатие "="
        const result = calculate(firstOperand, lastOperand, lastOperator);
        if (result === 'Ошибка') {
            displayValue = 'Ошибка';
            firstOperand = null;
            operator = null;
            updateDisplay();
            return;
        }
        displayValue = String(result);
        firstOperand = result;
        waitingForSecondOperand = true;
        updateDisplay();
    }
});

document.querySelector('.decimal').addEventListener('click', () => {
    inputDecimal();
});

// Исправление: добавлена поддержка клавиатуры
document.addEventListener('keydown', (e) => {
    if (displayValue === 'Ошибка' && e.key !== 'Escape' && e.key !== 'Delete') {
        return;
    }
    if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
    } else if (e.key === '.') {
        inputDecimal();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        document.querySelector('.equals')?.click();
    } else if (e.key === 'Escape' || e.key === 'Delete') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        if (displayValue.length > 1) {
            displayValue = displayValue.slice(0, -1);
        } else {
            displayValue = '0';
        }
        updateDisplay();
    } else if (e.key === '%') {
        calculatePercentage();
    }
});