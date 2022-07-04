import React, { useState } from 'react';
import './App.css';

export default function App() {
  const questions = [
    {
      questionText: 'What is the capital of France?',
      answerOptions: [
        { id: 1, answerText: 'New York', isCorrect: false },
        { id: 2, answerText: 'London', isCorrect: false },
        { id: 3, answerText: 'Paris', isCorrect: true },
        { id: 4, answerText: 'Dublin', isCorrect: false },
      ],
    },
    {
      questionText:
        'São todos cornos, mas qual tem o nome que começa com a letra E?',
      answerOptions: [
        { id: 1, answerText: 'Jeff Bezos', isCorrect: false },
        { id: 2, answerText: 'Elon Musk', isCorrect: true },
        { id: 3, answerText: 'Bill Gates', isCorrect: false },
        { id: 4, answerText: 'Tony Stark', isCorrect: false },
      ],
    },
    {
      questionText: 'The iPhone was created by which company?',
      answerOptions: [
        { id: 1, answerText: 'Apple', isCorrect: true },
        { id: 2, answerText: 'Intel', isCorrect: false },
        { id: 3, answerText: 'Amazon', isCorrect: false },
        { id: 4, answerText: 'Microsoft', isCorrect: false },
      ],
    },
    {
      questionText: 'How many Harry Potter books are there?',
      answerOptions: [
        { id: 1, answerText: '1', isCorrect: false },
        { id: 2, answerText: '4', isCorrect: false },
        { id: 3, answerText: '6', isCorrect: false },
        { id: 4, answerText: '7', isCorrect: true },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

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
  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].questionText}
            </div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].answerOptions.map((answerOption) => (
              <button
                key={answerOption.id}
                type="button"
                onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
