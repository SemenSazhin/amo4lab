import { CalculatorCore } from './calculator-core.js';

// Нововведение (задача "вынести логику в модули"): UI-слой работает с отдельным ядром калькулятора.
const calculator = new CalculatorCore();

/**
 * Обновляет текст на дисплее калькулятора.
 */
function updateDisplay() {
    const display = document.getElementById('display');
    display.innerText = calculator.getDisplayValue();
}

/**
 * Навешивает обработчики на кнопки интерфейса.
 */
function bindUiEvents() {
    // Нововведение (задача "добавить JSDoc"): основные UI-функции документированы блоками выше.
    document.querySelectorAll('.number').forEach((button) => {
        button.addEventListener('click', () => {
            calculator.inputDigit(button.innerText);
            updateDisplay();
        });
    });

    document.querySelectorAll('.operator').forEach((button) => {
        button.addEventListener('click', () => {
            calculator.handleOperator(button.innerText);
            updateDisplay();
        });
    });

    document.querySelector('.clear').addEventListener('click', () => {
        calculator.clear();
        updateDisplay();
    });

    document.querySelector('.equals').addEventListener('click', () => {
        if (calculator.canEvaluate()) {
            calculator.handleOperator('=');
            updateDisplay();
        }
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
        calculator.inputDecimal();
        updateDisplay();
    });
}

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
