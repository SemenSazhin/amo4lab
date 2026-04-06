/**
 * Ядро калькулятора: хранит состояние и выполняет вычисления.
 * Нововведение (задача "вынести логику в модули"): вся бизнес-логика
 * собрана в отдельном файле, а UI-слой только вызывает методы этого класса.
 */
export class CalculatorCore {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
    }

    /**
     * Возвращает текущее значение для дисплея.
     * @returns {string}
     */
    getDisplayValue() {
        return this.displayValue;
    }

    /**
     * Обрабатывает ввод цифры.
     * @param {string} digit
     */
    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
    }

    /**
     * Добавляет десятичную точку, если это возможно.
     */
    inputDecimal() {
        if (this.waitingForSecondOperand) {
            this.displayValue = '0.';
            this.waitingForSecondOperand = false;
            return;
        }

        if (!this.displayValue.includes('.')) {
            this.displayValue += '.';
        }
    }

    /**
     * Сбрасывает состояние калькулятора.
     */
    clear() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
    }

    /**
     * Применяет арифметический оператор.
     * @param {'+'|'-'|'*'|'/'|'='} nextOperator
     */
    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.displayValue);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.firstOperand === null && !Number.isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.displayValue = String(result);
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
    }

    /**
     * Выполняет операцию над двумя числами.
     * @param {number|string} first
     * @param {number|string} second
     * @param {string} op
     * @returns {number|string}
     */
    calculate(first, second, op) {
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

    /**
     * Переводит текущее число в проценты.
     */
    calculatePercentage() {
        let value = parseFloat(this.displayValue);
        value = value / 100;
        this.displayValue = String(value);
    }

    /**
     * Проверяет, можно ли выполнить вычисление по "=".
     * @returns {boolean}
     */
    canEvaluate() {
        return Boolean(this.operator) && !this.waitingForSecondOperand;
    }

    /**
     * Удаляет последний символ в текущем вводе.
     */
    backspace() {
        if (this.waitingForSecondOperand) {
            return;
        }

        this.displayValue = this.displayValue.length > 1 ? this.displayValue.slice(0, -1) : '0';
    }
}
