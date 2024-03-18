import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Quiz() {
  const [data, setData] = useState([]);
  const [option, setOption] = useState([]);
  const [right, setRight] = useState([]);
  const [count, setCount] = useState(0);
  const [x, setX] = useState(0);
  const [time, setTime] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => prevTime - 1);
     
    }, 1000);
   

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (time === 0 && count < 10) {
      setCount(prevCount => prevCount + 1);
      setTime(10);
    }
    
  
  }, [time, count]);


  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
        console.log(response.data.results);
        setData(response.data.results);
  
        const questions = response.data.results.map(question => {
          const options = [...question.incorrect_answers, question.correct_answer];
          
          const shuffledOptions = options.sort(() => Math.random() - 0.5);
          return {
            ...question,
            options: shuffledOptions
          };
        });
  
        const correctAnswers = questions.map(question => question.correct_answer);
        setRight(correctAnswers);
  
        const options = questions.map(question => question.options);
        setOption(options);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
  
    fetchQuestions();
  }, []);
  

  let correctBtn = (e) => {
    console.log(right[count]);
    console.log(option[count]);
    
    if(e===right[count]){
      setX(x + 1);
     setCount(count+1);
    }else{
      setCount(count+1);
    }
    setTime(10)
    
   
  };

  let nextQuestion=()=>{
    setCount(count+1);
    setTime(10)
    console.log(count);
  }

  return (
    <div className='box'>
      {data.length > 0 ? (
        data.map((result, index) => (
          (count===index)?(
            <>
              <h1>Quiz App</h1>
              <h2>Question {count+1}</h2>
              <div className='inner-box' key={index}>
              <p className='question'>{result.question}</p>
              {option[index].map((element, optionIndex) => (
                <div className='btn-box'>
                  <button value={element} onClick={(e) => correctBtn(e.target.value)} key={optionIndex}>{element}</button> 
                </div>
              ))}
          </div>
            <p className='time'>Time left: {time} seconds</p>
            <button onClick={nextQuestion}>Next Question</button>
          </>
          ):(
            (count-1 === index && count===10) ? (
              <p className='loading'>Quiz completed! Score: {x}/10</p>
        
       
      ) : null
            
            
         
        )))
      ) : (
        <p className='loading'>Loading...</p>
      )}
   
    </div>
  );
}

export default Quiz;
