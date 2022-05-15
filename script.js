const dayMode = document.getElementById('day-mode');
const nightMode = document.getElementById('night-mode');
const keys = document.querySelectorAll('.keys');

const calcHistoryEl = document.getElementById('calculation-history');
const calcEl = document.getElementById('calculation');

const resetBtn = document.getElementById('reset');
const undoBtn = document.getElementById('undo');
const invertBtn = document.getElementById('invert');
const modBtn = document.getElementById('mod');

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
        calcHistoryEl.innerHTML = '';
        eraseHistory = false;
    }
    updateOperand(el.getAttribute('value'));
}

function showCalulation(str) {
    if(str.charAt(str.length - 1) == '.') {
        calcEl.innerHTML = formatToNumWithComma(str) + '.';
    }
    else if(str.slice(-2) == '.0') {
        calcEl.innerHTML = formatToNumWithComma(str) + '.0'; 
    }
    else {
        calcEl.innerHTML = formatToNumWithComma(str);
    }
}

function updateOperand(digitStr) {
    if(digitStr != '.'){
        operand += digitStr;
    }
    else if(digitStr== '.' && !operand.includes('.')) {
        operand += digitStr;
    }
    console.log(operand);
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
    return num.toLocaleString();
}

function reverseNumFormat(str) {
    return Number(str.replace(/,/g, ''));
}

//////////////////////////
// Operations

function executeOperation(A, B, op) {
    console.log(A,B,op);
    if(A != 0 && B != 0 && op != '' && op != 'equals'){
        eraseHistory = false;
        showHistory(B);
        if(op == 'add') {
           result = A + B; 
        }
        else if(op == 'subtract') {
            result = A - B;
        }
        else if(op == 'multiply') {
            result = A * B;
        }
        else if(op == 'divide'){
            result = A / B;
        }
    
        operandA = getFromLS(setToLS('operandA', result));
        operandB = getFromLS(setToLS('operandB', ''))
        operand = '';
        // console.log(result);
        showCalulation(result.toString());
    }

    if (op == 'equals'){
        eraseHistory = true;
    }
}

function assignValue(op, func, flag = true) {
    if(op != null) {
        if(operandA == '') {
            operandA = getFromLS(setToLS('operandA', op));
        } else {
            operandB = getFromLS(setToLS('operandB', op));
        }
    }
        
    if(flag){
        operation = getFromLS(setToLS('operation', func));
    }

    executeOperation(Number(operandA),Number(operandB),operation);
}

// get and set from local storage
function setToLS(storage, value) {
    localStorage.setItem(storage,value);
    return storage;
}

function getFromLS(storage) {
    return localStorage.getItem(storage);
}

// Operator Event listeners

plusBtn.addEventListener('click', () => {
    // console.log(operandA);
    assignValue(operand, '', false);
    assignValue(null, 'add');
    operand = '';
    showHistory(plusBtn.innerHTML);
});

minusBtn.addEventListener('click', () => {
    // console.log(operandA);
    assignValue(operand, '', false);
    assignValue(null, 'subtract');
    operand = '';
    showHistory(minusBtn.innerHTML);
});
multiplyBtn.addEventListener('click', () => {
    // console.log(operandA);
    assignValue(operand, '', false);
    assignValue(null, 'multiply');
    operand = '';
    showHistory(multiplyBtn.innerHTML);
});

divideBtn.addEventListener('click', () => {
    // console.log(operandA);
    assignValue(operand, '', false);
    assignValue(null, 'divide');
    operand = '';
    showHistory(divideBtn.innerHTML);
});

equalsBtn.addEventListener('click', () => {
    assignValue(operand, '', false);
    showHistory(equalsBtn.innerHTML);
    assignValue(null, 'equals');
    operand = '';

});


function undo() {
    if(operand != '') {
        operand = operand.replace(/.$/, '');
        showCalulation(operand);
    }
}

// button event listeners
undoBtn.addEventListener('click', undo);

resetBtn.addEventListener('click', () => {
    localStorage.clear();
    setVaribales();
    operand = ''
    calcEl.innerHTML = '';
    calcHistoryEl.innerHTML = '';
});

invertBtn.addEventListener('click', () => {
    let invertedValue = reverseNumFormat(calcEl.innerText) * -1;
    operand = invertedValue.toString();
    showCalulation(operand);
    console.log(invertedValue);
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

// window.location.reload(() => {
    
// })


