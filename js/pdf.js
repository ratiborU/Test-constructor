import {updateQuestionFromForm, getCurrentElementNumber} from "./on-buttons.js";


const pdf = {
  name: '',
  variantNumber: '1',
  questions: []
};


// получить разметку вопроса для pdf
const getQuestionInHTML = (n, pdfInput) => {
  const pdfQuestion = document.querySelector('.pdf__question').cloneNode(true);
  const pdfFreeQuestion = document.querySelector('.pdf__question-free').cloneNode(true);
  if (!pdfInput.questions[n].isFreeAnswer) {
    pdfQuestion.children[0].textContent = '' + `${n + 1}` + '. ' + pdfInput.questions[n].questionText;
    for (let i = 0; i < 4; i++) {
      pdfQuestion.children[1].children[i].textContent = `${i + 1}) ` + pdfInput.questions[n].answersText[i];
    }
    return pdfQuestion;
  }
  pdfFreeQuestion.children[0].textContent = '' + `${n + 1}` + '. ' + pdfInput.questions[n].questionText;
  return pdfFreeQuestion;
};


// получить HTML для pdf
const getPdfInHTML = (pdfInput) => {
  const pdfResult = document.querySelector('.pdf').cloneNode();
  const pdfTestName = document.querySelector('.pdf__test-name').cloneNode();
  const pdfVariant = document.querySelector('.pdf__variant-number').cloneNode();
  pdfTestName.textContent = document.querySelector('.form__name input').value;
  pdfVariant.textContent = `Вариант ${pdfInput.variantNumber}`;
  pdfResult.append(pdfTestName);
  pdfResult.append(pdfVariant);
  for (let i = 0; i < pdf.questions.length; i++) {
    pdfResult.append(getQuestionInHTML(i, pdfInput));
  }

  return pdfResult;
};


// получить номер варианта и ответы на вопросы
const getPdfVarNumberAndAnswers = (innerPdf) => {
  const resultArray = innerPdf.questions
    .map((x, index) => x.isFreeAnswer ? 
      x.freeAnswer: 
      x.answerNumbers
      .map((y, i) => y ? i + 1 : 0)
      .filter(y => y > 0)
      .join(''))
    .map((x, index) => `${index + 1}) ${x}`)
    .join('<pre style="display: inline-block;">   </pre>');
  
  const varNumber = document.querySelector('.pdf-answers__number').cloneNode();
  const varAnswers = document.querySelector('.pdf-answers__string').cloneNode(true);
  varAnswers.innerHTML = `${resultArray}`;
  varNumber.textContent = `Вариант ${innerPdf.variantNumber}`;

  return {
    "number": varNumber,
    "answers": varAnswers
  };
};


// получить Html разметку ответов на вопросы
const getPdfAnswers = (pdfVariants) => {
  const result = document.querySelector('.pdf-answers').cloneNode();
  let currentVariant;
  for (let i = 0; i < pdfVariants.length; i++) {
    currentVariant = getPdfVarNumberAndAnswers(pdfVariants[i]);
    result.append(currentVariant.number);
    result.append(currentVariant.answers);
  }
  return result
};


// возвращает 1 случайны pdf вариант в виде объекта
const getNewPdfVariantInObject = (n) => {
  const resultPdf = {
    name: '',
    variantNumber: '',
    questions: []
  };
  let pdfClone = JSON.parse(JSON.stringify(pdf));

  resultPdf.name = pdfClone.name;
  resultPdf.variantNumber = n;
  if (n == 1) {
    resultPdf.questions = pdfClone.questions
  } else {
    resultPdf.questions = pdfClone.questions.sort(() => Math.random() - 0.5);
  }

  return resultPdf;
};


// возвращает варианты в виде объектов
const getNPdfVariantsInObject = (n) => {
  return [...Array(n)].map((x, i) => getNewPdfVariantInObject(i + 1));
};


// возвращает варианты в виде html разметки
const getNPdfVariantsFromObject = (pdfObjects) => {
  return [...Array(pdfObjects.length)].map((x, i) => getPdfInHTML(pdfObjects[i]));
};


// скачивает на компьютер сразу и варианты и ответы
const getPdfs = (downloadFunction) => {
  return () => {
    console.log(pdf);
    const variantsCount = Math.min(Math.max(1, document.querySelector('.form__variants-count input').value), 4);
    const testName = document.querySelector('.form__name input');
    updateQuestionFromForm(getCurrentElementNumber());
    window.scrollTo({top: 0});
    
    const pdfObjects = getNPdfVariantsInObject(variantsCount);
    const pdfVariants = getNPdfVariantsFromObject(pdfObjects);

    for (let i = 0; i < variantsCount; i++) {
      downloadFunction(`${testName.value ? testName.value: "Тест"} вариант ${i + 1}.pdf`, pdfVariants[i]);
    }

    downloadFunction(`Ответы на ${testName.value ? testName.value: "тест"}.pdf`, getPdfAnswers(pdfObjects));
  };
}


export {pdf, getPdfs};