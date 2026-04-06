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

    document.querySelector('.decimal').addEventListener('click', () => {
        calculator.inputDecimal();
        updateDisplay();
    });
}

bindUiEvents();
updateDisplay();