import {pdf, getPdfs} from "./pdf.js";
import {onNextButton, onPreviousButton, onQuestionNumberElement, onDeleteQuestionButton, onAddQuestionButton, onFreeAnswerButton, addClearQuestion} from "./on-buttons.js";


const nextButton = document.querySelector('.form__next-button');
const previousButton = document.querySelector('.form__previous-button');
const questionNumberElement = document.querySelector('.form__questions-list-item');
const deleteQuestionButton = document.querySelector('.from__question-button_delete');
const addQuestionButton = document.querySelector('.from__question-button_add');
const freeAnswerButton = document.querySelector('.form__free-answer-button');


addClearQuestion();
nextButton.addEventListener('click', onNextButton);
previousButton.addEventListener('click', onPreviousButton);
deleteQuestionButton.addEventListener('click', onDeleteQuestionButton);
addQuestionButton.addEventListener('click', onAddQuestionButton);
freeAnswerButton.addEventListener('click', onFreeAnswerButton);
questionNumberElement.addEventListener('click', onQuestionNumberElement(0));


export {getPdfs};