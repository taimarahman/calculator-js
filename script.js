const dayMode = document.getElementById('day-mode');
const nightMode = document.getElementById('night-mode');
const keys = document.querySelectorAll('.keys');

const calcHistoryEl = document.getElementById('calculation-history');
const calcEl = document.getElementById('calculation');

const resetBtn = document.getElementById('reset');
const undoBtn = document.getElementById('undo');
const invertBtn = document.getElementById('invert');
const percentBtn = document.getElementById('percent');

const plusBtn = document.getElementById('plus');
const minusBtn = document.getElementById('minus');
const multiplyBtn = document.getElementById('multiply');
const divideBtn = document.getElementById('divide');
const equalsBtn = document.getElementById('equals');

let operandA;
let operandB;
let operation;
let result = 0;
let eraseHistory = false;


function setVaribales() {
    operandA = localStorage.getItem("operandA") ? localStorage.getItem("operandA") : '';
    operandB = localStorage.getItem("operandB") ? localStorage.getItem("operandB") : '';
    operation = localStorage.getItem("operation") ? localStorage.getItem("operation") : '';
}

setVaribales();

let operand = '';


keys.forEach(key => {
    if(key.innerText != '' && key.innerText != 'AC'){
        key.setAttribute('value',key.innerText);
        key.setAttribute('onclick', 'digitClick(this)');

    }
})

function digitClick(el) {
    if(eraseHistory) {
        operand = '';
        operandA = getFromLS(setToLS('operandA', ''));
        calcHistoryEl.innerHTML = '';
        eraseHistory = false;
    }
    updateOperand(el.getAttribute('value'));
}

function showCalulation(str) {
    if(str == '.'){
        calcEl.innerHTML = '0.';
    }
    else if(str.charAt(str.length - 1) == '.') {
        calcEl.innerHTML = formatToNumWithComma(str) + '.';
    }
    else if(str.slice(-2) == '.0') {
        calcEl.innerHTML = formatToNumWithComma(str) + '.0'; 
    }
    else {
        calcEl.innerHTML = formatToNumWithComma(str);
    }
}

// showCalulation('5%');

function updateOperand(digitStr) {
    if(digitStr != '.'){
        operand += digitStr;
    }
    else if(digitStr== '.' && !operand.includes('.')) {
        operand += digitStr;
    }
    // console.log(operand);
    showCalulation(operand);
}



function showHistory(history) {
    if(calcHistoryEl.innerHTML == '' || eraseHistory){
        calcHistoryEl.innerHTML = calcEl.innerHTML + history;
        eraseHistory = false;
    }
    else
        calcHistoryEl.innerHTML = calcHistoryEl.innerHTML + history;

}

// number format
function formatToNumWithComma(value) {
    let num = Number(value);
    return num.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function reverseNumFormat(str) {
    return Number(str.replace(/,/g, ''));
}

//////////////////////////
// Operations

function executeOperation(A, B, op) {
    // console.log(A,B,op);
    if(A != 0 && B != 0 && op != ''){
        // showHistory(B);
        if(op == 'add') {
           result = addition(A,B); 
        }
        else if(op == 'subtract') {
            result = subtraction(A,B);
        }
        else if(op == 'multiply') {
            result = multiplication(A,B);
        }
        else if(op == 'divide'){
            result = division(A,B);
        }
    
        operandA = getFromLS(setToLS('operandA', result));
        operandB = getFromLS(setToLS('operandB', ''))
        operand = '';
        showCalulation(result.toString());
    }
}

function addition(x,y) {
    return x + y;
}
function subtraction(x,y) {
    return x - y;
}
function multiplication(x,y) {
    return x * y;
}
function division(x,y) {
    return x / y;
}

function assignValue(op, func, flag = true) {
    if(op != null){
        if(operandA == '') {
            operandA = getFromLS(setToLS('operandA', op));
        } else {
            operandB = getFromLS(setToLS('operandB', op));
            showHistory(operandB);
        }
    }
        
    if(flag){
        operation = getFromLS(setToLS('operation', func));
    }

    executeOperation(Number(operandA),Number(operandB),operation);
}


// function changeOperatorIcon(operator) {
//     if(calcHistoryEl.lastElementChild.tagName.toLowerCase() == 'i'){
//         calcHistoryEl.removeChild(calcHistoryEl.lastElementChild);
//         calcHistoryEl.appendChild(operator);
//     };
// }

// get and set from local storage
function setToLS(storage, value) {
    localStorage.setItem(storage,value);
    return storage;
}

function getFromLS(storage) {
    return localStorage.getItem(storage);
}

// Operator Event listeners

function checkOperationState(operation, operator) {
    if (operand != null) {
        assignValue(operand, '', false);
        assignValue(null, operation);
        operand = '';
        if(calcEl.innerHTML != '')
            showHistory(operator);
    }
}

function checkPercentState(A, B, op) {
    if(A == '' && B == '' && op == ''){ 
        operandA = getFromLS(setToLS('operandA', operand));
        operand = '';
        showHistory(percentBtn.innerHTML);
        eraseHistory =true;
    }
    else if(A != '' && op != '') {
        operandB = getFromLS(setToLS('operandB', operand));
        showHistory(operand);
        showHistory(percentBtn.innerHTML);
        percentageExecuteOperation(Number(A),Number(operandB),op);
        operand = '';
        eraseHistory = true;

    }
}

let percentValue = 0;

function percentageExecuteOperation(A,B,op) {
    if(op == 'add') {
        percentValue = getPercentage(A,B);
        result = addition(A,percentValue); 
    }
    else if(op == 'subtract') {
        percentValue = getPercentage(A,B);
        result = subtraction(A,percentValue);
    }
    else if(op == 'divide'){
        percentValue =  division(B,100);
        result = division(A,percentValue);
    } else {
         result = getPercentage(A,B);
    }

    operandA = getFromLS(setToLS('operandA', result));
    operandB = getFromLS(setToLS('operandB', ''));
    operation = getFromLS(setToLS('operation', ''));
    operand = '';
    showCalulation(result.toString());

}

function getPercentage(x,y) {
    return (x*(y/100));
}

function undo() {
    if(operand != '') {
        operand = operand.replace(/.$/, '');
        showCalulation(operand);
    }
}

plusBtn.addEventListener('click', () => {
    checkOperationState('add', plusBtn.innerHTML);
});

minusBtn.addEventListener('click', () => {
    checkOperationState('subtract', minusBtn.innerHTML);
});
multiplyBtn.addEventListener('click', () => {
    checkOperationState('multiply', multiplyBtn.innerHTML);
});

divideBtn.addEventListener('click', () => {
    checkOperationState('divide', divideBtn.innerHTML);
});

function equalsOperation() {
    assignValue(operand, '', false);
    if(calcEl.innerHTML != '')
        showHistory(equalsBtn.innerHTML);
    operandB = getFromLS(setToLS('operandB', ''));
    operation = getFromLS(setToLS('operation', ''));
    eraseHistory = true;
    operand = '';
}

equalsBtn.addEventListener('click', equalsOperation);

invertBtn.addEventListener('click', () => {
    let invertedValue = reverseNumFormat(calcEl.innerText) * -1;
    operand = invertedValue.toString();
    if(eraseHistory) {
        operandA = getFromLS(setToLS('operandA', ''));
        calcHistoryEl.innerHTML = '';
        eraseHistory = false;
    }
    showCalulation(operand);
});

percentBtn.addEventListener('click', () => {
    if(operand != '') {
        checkPercentState(operandA, operandB, operation);    
    }
});



// button event listeners
undoBtn.addEventListener('click', undo);

resetBtn.addEventListener('click', () => {
    localStorage.clear();
    setVaribales();
    operand = ''
    calcEl.innerHTML = '';
    calcHistoryEl.innerHTML = '';
});

dayMode.addEventListener('click', () => {
    document.querySelector('.container').classList.add('day');
    dayMode.classList.add('active');
    nightMode.classList.remove('active');
});

nightMode.addEventListener('click', () => {
    if(document.querySelector('.container').classList.contains('day')){
        document.querySelector('.container').classList.remove('day');
    }
    dayMode.classList.remove('active');
    nightMode.classList.add('active');
});

window.onload = () => {
    localStorage.clear();
    setVaribales();
};



window.addEventListener('keydown', event => {
    if (event.key >= 0 && event.key <=9){
        updateOperand(event.key);
    }
    else if (event.key == '+'){
        checkOperationState('add', plusBtn.innerHTML);
    }
    else if (event.key == '-'){
        checkOperationState('subtract', minusBtn.innerHTML);
    }
    else if (event.key == '*'){
        checkOperationState('multiply', multiplyBtn.innerHTML);
    }
    else if (event.key == '/'){
        checkOperationState('divide', divideBtn.innerHTML);
    }
    else if (event.key == 'Enter' || event.key == '=') {
        equalsOperation();
    }
});
