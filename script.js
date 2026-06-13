
let submit = document.querySelector('#sub')
let home = document.querySelector('#home')
let quiz = document.querySelector('#quiz')
let cat = document.querySelector('#cat')
let ques = document.querySelector('#ques')
let quesno = document.querySelector('#questionno')
let next = document.querySelector('#next')
let question = document.querySelector('#question')
let prev = document.querySelector('#prev')
let name = document.querySelector('#name')
let testsubmit = document.querySelector('#testsubmit')
let score = document.querySelector('#score')
let result = document.querySelector('#result')
let timer = document.querySelector('#timer')
let fill = document.querySelector('#fill')
let ul = document.querySelector('#breakdown')
let playagain = document.querySelector('#playagain')
let scorehistory = document.querySelector('#scorehistory')
let userhistory = document.querySelector('#userhistory')
let hist = document.querySelector('#hist')


let questions = []

let categorymap = {
   'Maths': 19,
   'G.K.': 9,
   'JAVASCRIPT': 18

}
//neche formatqn isliye bana rhe hai becouse mere pass pahle qusetions is format me tha {
//  questin:djf,options:3 options, answer: index of answer} ab problem ye tha api humko iss formate me de rha tha {question:dfj, correctans:ek , 
// incorrect ans me 3 options the aur humko upar wale cat me karna tha}
function formatQuestion(apiquestion) {
   let options = apiquestion.incorrect_answers.concat(apiquestion.correct_answer)//toh ab humne options me correct aur incorrect concat kar diya
   let answerIndex = options.indexOf(apiquestion.correct_answer)//humne answerIndex m4 correct answer ka index store kar liya 
   return {
      question: decodeURIComponent(apiquestion.question),
      options: options.map((op)=>decodeURIComponent(op)),
      answer: answerIndex
   }

}
async function fetchQuestion(category) {//ye category para kyu pass kiya ye aapko aage pta chalega jab hum uss fn ko call karenge waha mai
   //samjhaya hu submit listner me dekhna
   try{
      let categoryNumber = categorymap[category]//categorymap ko dekho usme 3 numbers hai ussi ka number dalna hai
      let url = `https://opentdb.com/api.php?amount=10&category=${categoryNumber}&type=multiple&encode=url3986`//categorynumber toh change hoti rhegi
      const response = await fetch(url)
      const data = await response.json()
      questions = data.results.map((q)=> formatQuestion(q))//dekho api ka question option correct incorret sab result me hai toh humne data.result
      //se uss array ko nikala then uspe map lagaya yaani kuch kaam karo ---kya karo her ek ko formatquestion naam ke fn me daal do (jo q kar raha)
      //ab formatquestin naam ka fn usko aram se apne format me badal dega jo humne discuss kiya tha

   } catch(error){
      console.log('error',error)
   }


}

let currentIndex = 0
let selectedIndex = null
let filtered = null
let timing = 0
let count = 30
let leftTime = []



function questionRender() {
   question.innerHTML = ''
   // console.log(currentQuestion)
   let currentQuestion = filtered[currentIndex]
   ques.innerText = currentQuestion.question

   // console.log(ques.innerText)
   let letters = ['A', 'B', 'C', 'D']
   currentQuestion.options.forEach((opt, index) => {//ek ek karke options ko append karna tha toh isliye manually karne se acha
      //for each laga diya ab currentquestion ke option per for each chalega jo ki total 4 ioptions hai ek ek karke 
      //charo per chalega aur opt para hai uske liye yaani otion a '2 jo ki ab opt me hai then ab phla ke liye chala
      //uske liye div bana do aur uss div ke andar opt ka inner text daal do chuki phla option 2 tha jo ki opt me aaya
      //aur wo sab div ke inner text me aa gya then ab div ko question ke andar append kara do 
      let div = document.createElement('div')
      div.innerHTML = `<span>${letters[index]}.</span> <span>${opt}</span> <input type="radio" name="option"></input>`
      question.appendChild(div)
      quesno.innerText = 'Q' + (currentIndex + 1) + '/' + filtered.length
      div.addEventListener('click', function () {
         if (count === 0) {
            let radios = question.querySelectorAll('input')
            radios.forEach((radio) => {
               radio.disabled = true
            })
            return

         }

         else if (selectedIndex === index) {
            selectedIndex = null
            let radio = div.querySelector('input')

            radio.checked = false


         } else {
            selectedIndex = index
         }
      })


   })
   function countdown(fn) {
      timing = setInterval(fn, 1000)
   }
   timer.innerText = count
   if (count > 0) {
      countdown(function () {
         count--
         if (count <= 0) {
            testsubmit.innerHTML = ''
            if (currentIndex < filtered.length - 1) {
               if (selectedIndex === filtered[currentIndex].answer) {
                  positiveMarks++
               } else if (selectedIndex === null) {
                  skipedanswer++

               } else if (selectedIndex !== filtered[currentIndex].answer) {
                  incorectanswer++

               }

               selectedIndex = null
               leftTime[currentIndex] = 0


               clearInterval(timing)
               currentIndex++

               if (leftTime[currentIndex] !== undefined) {
                  count = leftTime[currentIndex]
               } else {
                  count = 30
               }
               questionRender()
            } else {
               let pendingIndex = leftTime.findIndex((time) => time > 0)
               if (pendingIndex !== -1) {
                  currentIndex = pendingIndex
                  count = leftTime[currentIndex]
                  clearInterval(timing)
                  questionRender()



               } else {
                  if (selectedIndex === filtered[currentIndex].answer) {
                     positiveMarks++
                  } else if (selectedIndex === null) {
                     skipedanswer++

                  } else if (selectedIndex !== filtered[currentIndex].answer) {
                     incorectanswer++

                  }
                  testsubmit.innerHTML = ''
                  quiz.style.display = 'none'
                  result.style.display = 'block'
                  let studentName = localStorage.getItem('username')
                  score.innerText = `${studentName},You scored ${positiveMarks}/${filtered.length}`


               }
            }
            if (currentIndex === filtered.length - 1) {

               let testbutton = document.createElement('button')

               testbutton.innerText = 'test submit'
               testsubmit.appendChild(testbutton)
            }

         }
         timer.innerText = count

      })
   }
   fill.style.width = ((currentIndex + 1) / filtered.length * 100) + '%' //currentIndex + 1
//currentIndex 0 se start hota hai — pehla question index 0 hai. But progress bar mein dikhana hai "1 out of 10" — isliye +1.

//Total questions se divide karo — fraction milega. Jaise 1/10 = 0.1* 100
//Fraction ko percentage banao — 0.1 * 100 = 10+ '%'
//CSS mein width percentage mein chahiye — string banana pada "10%"

}




submit.addEventListener('click', (event) => {
   event.preventDefault()
   if (name.value.trim() === '') {//space daba ke ya khali box na login ho
      alert('kindly please fill your name')
      return
   }
   localStorage.setItem('username', name.value)
   fetchQuestion(cat.value).then(()=>{//yha dekho jo maine bola ta fetchqn fn me jo category pass kiya tha usme yhi cat.value jayega
      //socho cat.value kya dega maths, science,gk ye aur ye uth ke waha jayega aur wha jo line hai   let categoryNumber = categorymap[category]
      //isme aaisa hoga categoryNunber = categpryMap[maths] whic is 10 ya jo bhi ho
      filtered = questions

   home.style.display = 'none'
   quiz.style.display = 'block'
   questionRender()
   })
})
let positiveMarks = 0
let incorectanswer = 0
let skipedanswer = 0

next.addEventListener('click', () => {


   testsubmit.innerHTML = ''
   if (currentIndex < filtered.length - 1) {
      if (selectedIndex === filtered[currentIndex].answer) {
         positiveMarks++
      } else if (selectedIndex === null) {
         skipedanswer++
      } else if (selectedIndex !== filtered[currentIndex].answer) {
         incorectanswer++
      }
      selectedIndex = null
      leftTime[currentIndex] = count
      clearInterval(timing)
      currentIndex++

      if (leftTime[currentIndex] !== undefined) {
         count = leftTime[currentIndex]
      } else {
         count = 30
      }

      questionRender()
   }
   if (currentIndex === filtered.length - 1) {

      let testbutton = document.createElement('button')

      testbutton.innerText = 'test submit'
      testsubmit.appendChild(testbutton)
   }



})

prev.addEventListener('click', () => {
   if (currentIndex > 0) {
      leftTime[currentIndex] = count
      clearInterval(timing)
      currentIndex--

      if (leftTime[currentIndex] !== undefined) {
         count = leftTime[currentIndex]
      } else {
         count = 30
      }

      questionRender()
   }
})
skip.addEventListener('click', function () {

   if (currentIndex < filtered.length - 1) {
      leftTime[currentIndex] = count
      clearInterval(timing)
      currentIndex++

      if (leftTime[currentIndex] !== undefined) {
         count = leftTime[currentIndex]
      } else {
         count = 30
      }
      questionRender()
      selectedIndex = null
      console.log(selectedIndex);

   }
   if (currentIndex === filtered.length - 1) {

      let testbutton = document.createElement('button')

      testbutton.innerText = 'test submit'
      testsubmit.appendChild(testbutton)
   }

})

testsubmit.addEventListener('click', function () {

   if (selectedIndex === filtered[currentIndex].answer) {
      positiveMarks++
   } else if (selectedIndex === null) {
      skipedanswer++

   } else if (selectedIndex !== filtered[currentIndex].answer) {
      incorectanswer++

   }
   testsubmit.innerHTML = ''
   quiz.style.display = 'none'
   result.style.display = 'block'
   let studentName = localStorage.getItem('username')
   score.innerText = `${studentName},You scored ${positiveMarks}/${filtered.length}`
   let li1 = document.createElement('li')
   li1.innerText = `Total positiveMarks : ${positiveMarks}`
   ul.appendChild(li1)
   let li2 = document.createElement('li')
   li2.innerText = `Total IncorrectMarks : ${incorectanswer}`
   ul.appendChild(li2)
   let li3= document.createElement('li')
   li3.innerText = `Total skippedQuestion : ${skipedanswer}`
   ul.appendChild(li3)
   localStorage.setItem('totalresult', score.innerText)

   let history = JSON.parse(localStorage.getItem('history')) || []
   let existingUser = history.find((entry)=>entry.name === studentName)
if(existingUser){
   console.log(history.existingUser);
   
}else{
   let newResult = {
    name:studentName,
    score:score.innerText,
    date: new Date()
}
history.push(newResult)



}
localStorage.setItem('history', JSON.stringify(history))

   console.log(existingUser);
   

})

playagain.addEventListener('click',function(){
   result.style.display = 'none'
   home.style.display = 'block'
   currentIndex= 0
   name.value = ''
   timing = 0
   count = 0
   leftTime = []
   incorectanswer = 0
   skipedanswer = 0
   positiveMarks = 0
   testsubmit.innerHTML = ''
   ul.innerHTML = ''
score.innerText = ''

})
userhistory.addEventListener('click',function(){
   scorehistory.style.display = 'block'
   let previousInfo = JSON.parse(localStorage.getItem('history'))
   console.log(previousInfo);
   
//    for(let i=0;i<previousInfo.length;i++){
// let li = previousInfo[i]
// console.log(li.score);
//    }

})
