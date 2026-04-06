import { CalculatorCore } from './calculator-core.js';

// Нововведение (задача "вынести логику в модули"): UI-слой работает с отдельным ядром калькулятора.
const calculator = new CalculatorCore();

/**
 * Обновляет текст на дисплее калькулятора.
 */
function updateDisplay() {
    const display = document.getElementById('display');
    if (display) {
        display.innerText = calculator.getDisplayValue();
    }
}

/**
 * Навешивает обработчики на кнопки интерфейса.
 */
function bindUiEvents() {
    // Обработка цифр
    document.querySelectorAll('.number').forEach((button) => {
        button.addEventListener('click', () => {
            calculator.inputDigit(button.innerText);
            updateDisplay();
        });
    });

    // Обработка операторов
    document.querySelectorAll('.operator').forEach((button) => {
        button.addEventListener('click', () => {
            calculator.handleOperator(button.innerText);
            updateDisplay();
        });
    });

    // Очистка
    const clearBtn = document.querySelector('.clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            calculator.clear();
            updateDisplay();
        });
    }

    // Равно
    const equalsBtn = document.querySelector('.equals');
    if (equalsBtn) {
        equalsBtn.addEventListener('click', () => {
            if (calculator.canEvaluate()) {
                calculator.handleOperator('=');
                updateDisplay();
            }
        });
    }

    // Десятичная точка
    const decimalBtn = document.querySelector('.decimal');
    if (decimalBtn) {
        decimalBtn.addEventListener('click', () => {
            calculator.inputDecimal();
            updateDisplay();
        });
    }

    // Проценты (если есть такая кнопка)
    const percentBtn = document.querySelector('.percent');
    if (percentBtn) {
        percentBtn.addEventListener('click', () => {
            calculator.calculatePercentage();
            updateDisplay();
        });
    }

    // Backspace (если есть такая кнопка)
    const backspaceBtn = document.querySelector('.backspace');
    if (backspaceBtn) {
        backspaceBtn.addEventListener('click', () => {
            calculator.backspace();
            updateDisplay();
        });
    }
}

/**
 * Добавляет поддержку клавиатуры.
 */
function bindKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
        // Цифры
        if (e.key >= '0' && e.key <= '9') {
            calculator.inputDigit(e.key);
            updateDisplay();
        }
        // Десятичная точка
        else if (e.key === '.') {
            calculator.inputDecimal();
            updateDisplay();
        }
        // Операторы
        else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            calculator.handleOperator(e.key);
            updateDisplay();
        }
        // Равно (Enter или =)
        else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            if (calculator.canEvaluate()) {
                calculator.handleOperator('=');
                updateDisplay();
            }
        }
        // Очистка (Escape или Delete)
        else if (e.key === 'Escape' || e.key === 'Delete') {
            calculator.clear();
            updateDisplay();
        }
        // Backspace
        else if (e.key === 'Backspace') {
            e.preventDefault();
            calculator.backspace();
            updateDisplay();
        }
        // Проценты
        else if (e.key === '%') {
            calculator.calculatePercentage();
            updateDisplay();
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    bindUiEvents();
    bindKeyboardEvents();
    updateDisplay();
});