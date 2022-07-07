/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import './App.css';
import { collection, query, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'questions'));
    onSnapshot(q, (querySnapshot) => {
      setQuestions(querySnapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleNavigateQuestions = (next) => {
    let nextQuestion;
    if (next === true) {
      nextQuestion = currentQuestion + 1;
    } else {
      nextQuestion = currentQuestion - 1;
    }
    setCurrentQuestion(nextQuestion);
  };

  // const handleCreateData = () => {
  //   questionsAndAnswers.forEach((entry) => {
  //     const questionsToAdd = collection(db, 'questions');
  //     return addDoc(questionsToAdd, {
  //       questionText: entry.questionText,
  //       answerOptions: entry.answerOptions,
  //     });
  //   });
  // };

  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : questions.length ? (
        <div>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].questionText}
            </div>
            <div className="answer-section">
              {questions[currentQuestion].answerOptions?.map(
                (answer, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAnswerOptionClick(answer.isCorrect)}
                  >
                    {answer.answerText}
                  </button>
                )
              )}
              {/* <div>
                <button
                  type="button"
                  onClick={() => handleNavigateQuestions(true)}
                >
                  Próximo
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateQuestions(false)}
                >
                  Anterior
                </button>
              </div> */}
            </div>
          </div>

          {/* <button type="button" onClick={() => handleCreateData()}>
            create
          </button> */}
        </div>
      ) : null}
    </div>
  );
}
