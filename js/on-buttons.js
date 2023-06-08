import {pdf} from "./pdf.js";

const questionText = document.querySelector('.question__text textarea'); //question__answer-input-text
const questionAnswers = document.querySelectorAll('.question__answer-input-text');
const questionAnswerNumbers = document.querySelectorAll('.question__answer-checkbox');

const questionNumberElement = document.querySelector('.form__questions-list-item');
const questionNumbersList = document.querySelector('.form__questions-list');

const answersField = document.querySelector('.question__answers-list');
const freeAnswerField = document.querySelector('.form__free-answer-field');
const freeAnswerFieldInput = document.querySelector('.form__free-answer-field-input-text');


let currentElementNumber = 0;


// возвращает номер текущего вопроса
const getCurrentElementNumber = () => {
  return currentElementNumber;
};


// добавляет кнопку с переходом на вопрос
const addQuestionNumberElement = () => {
  const newQuestionNumberElement = questionNumberElement.cloneNode();
  newQuestionNumberElement.textContent = questionNumbersList.children.length + 1;  
  newQuestionNumberElement.addEventListener('click', onQuestionNumberElement(questionNumbersList.children.length));
  questionNumbersList.append(newQuestionNumberElement);
};


// устанавливет номер вопроса в форму
const setActiveElement = () => {
  const questionNumberElements = document.querySelectorAll('.form__questions-list-item');
  for (const child of questionNumberElements) {
    child.classList.remove('form__questions-list-item_active');
  }
  questionNumberElements[currentElementNumber].classList.add('form__questions-list-item_active');
}


// добваляет пустой вопрос в pdf
const addClearQuestion = () => {
  pdf.questions.push({
    questionText: '',
    isFreeAnswer: false,
    freeAnswer: '',
    answersText: [...questionAnswers].map(x => ''),
    answerNumbers: [...questionAnswerNumbers].map(x => false)
  });
  clearForm();
};


// обновляет данные для pdf файла
const updateQuestionFromForm = (n) => {
  pdf.questions[n] = {
    questionText: questionText.value,
    isFreeAnswer: freeAnswerField.style.display == "block", // добавить связь с block none
    freeAnswer: freeAnswerFieldInput.value, // добавить связь с block none
    answersText: [...questionAnswers].map(x => x.value),
    answerNumbers: [...questionAnswerNumbers].map(x => x.checked)
  };
};


// очищает форму 
const clearForm = () => {
  questionText.value = '';
  freeAnswerFieldInput.value = '';
  questionAnswers.forEach((x) => x.value = '');
  questionAnswerNumbers.forEach((x) => x.checked = false);
};


// заполняет форму вопроса
function fillQuestionForm(elementNumber) {
  if (elementNumber > pdf.questions.length - 1) {
    clearForm();
  } else {
    questionText.value = pdf.questions[elementNumber].questionText;
    freeAnswerFieldInput.value = pdf.questions[elementNumber].freeAnswer;
    questionAnswers.forEach((x, i) => x.value = pdf.questions[elementNumber].answersText[i]);
    questionAnswerNumbers.forEach((x, i) => x.checked = pdf.questions[elementNumber].answerNumbers[i]);
  }
  setAnswersType(pdf.questions[elementNumber].isFreeAnswer);
  currentElementNumber = elementNumber;
};


// добавляет вопрос в pdf object
const addQuestion = (n) => {
  pdf.questions.splice(n, 0, {
    questionText: '',
    isFreeAnswer: false,
    freeAnswer: '',
    answersText: [...questionAnswers].map(x => ''),
    answerNumbers: [...questionAnswerNumbers].map(x => false)
  });
};


// удаляет последний элемент из кнопок с переходами по вопросам
const deleteLastNumberElement = () => {
  questionNumbersList.removeChild(questionNumbersList.lastChild);
};


// удалаяет вопрос из pdf файла
const deleteQuestion = (n) => {
  pdf.questions.splice(n, 1);
};


// меняет тип ответа
const changeAnswersType = () => {
  answersField.style.display = answersField.style.display == "none" ? "block" : "none";
  freeAnswerField.style.display = freeAnswerField.style.display == "block" ? "none" : "block";
};


// устанавливает тип ответа
const setAnswersType = (isFreeAnswer) => {
  answersField.style.display = isFreeAnswer ? "none": "block";
  freeAnswerField.style.display = isFreeAnswer ? "block": "none";
};











const onNextButton = () => {
  updateQuestionFromForm(currentElementNumber);
  currentElementNumber++;
  if (currentElementNumber == pdf.questions.length) {
    addQuestionNumberElement();
    addClearQuestion();
  } else if (currentElementNumber < pdf.questions.length) {
    fillQuestionForm(currentElementNumber);
  }
  setActiveElement();
};


const onPreviousButton = () => {
  if (currentElementNumber > 0) {
    updateQuestionFromForm(currentElementNumber);
    currentElementNumber--;
    fillQuestionForm(currentElementNumber);
  } 
  setActiveElement();
};


const onQuestionNumberElement = (elementNumber) => {
  return () => {
    updateQuestionFromForm(currentElementNumber);
    fillQuestionForm(elementNumber);
    setActiveElement();
  };
};


const onAddQuestionButton = () => {
  updateQuestionFromForm(currentElementNumber);
  currentElementNumber++;
  addQuestion(currentElementNumber);
  addQuestionNumberElement();
  setActiveElement();
  fillQuestionForm(currentElementNumber);
};


const onDeleteQuestionButton = () => {
  if (pdf.questions.length > 1) {
    if (currentElementNumber > 0) {
      deleteQuestion(currentElementNumber);
      deleteLastNumberElement();
      currentElementNumber--;
      fillQuestionForm(currentElementNumber);
      setActiveElement();
    } else {
      deleteQuestion(currentElementNumber);
      deleteLastNumberElement();
      fillQuestionForm(currentElementNumber);
      setActiveElement();
    }
  } else {
    deleteQuestion(currentElementNumber);
    addClearQuestion();
  }
};


const onFreeAnswerButton = () => {
  changeAnswersType();
};


export {onNextButton, onPreviousButton, onQuestionNumberElement, addClearQuestion, updateQuestionFromForm, onDeleteQuestionButton, onAddQuestionButton, onFreeAnswerButton, getCurrentElementNumber};