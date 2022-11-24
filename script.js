const buttonPlay = document.querySelector('#playGame')
const buttonDifficult = document.querySelector('#chooseDifficult')
const game = document.querySelector('#game')
const menuContainer = document.querySelector('#menuContainer')
const title = document.querySelector('#title')
const body = document.querySelector('body')
let correctAnswer = false
let answer = []
let attempts = 3
let word = ''

const randomNumber = ()=>{
    const number = Math.round((Math.random()*251)+1)
    return number.toString()
}

const getPokemon = async(pokemonNumber)=>{
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
    const data = await APIResponse.json()
    return data
}

const pokemonRender = async(pokemonNumber)=>{
    const data = await getPokemon(pokemonNumber)
    const img = document.createElement('img')
    img.src = data.sprites.versions['generation-v']['black-white'].animated.front_default
    img.className = 'pokemon'
    body.style.background =' url("imagens/deepForest.png")'
    body.style.backgroundSize = '100%'
    gameContainer.appendChild(img)
    title.style.display = 'none'
    menuContainer.style.display = 'none'
    const name = data['name']
    return name
}
const catchValues = (event)=>{
    const proximo = event.target.nextSibling
    if(event.target.value.length >0){
        if(proximo !== null){
            proximo.focus()
        }
    }
}
const cleanTextArea = () =>{
    const paragrafs =document.querySelectorAll('.line')
    for(let i  = 0; i <paragrafs.length; i +=1 ){
        paragrafs[i].value = ''
    }
}
const endGame = ()=>{
    if(correctAnswer === true || attempts <1){
        answer = []
        attempts = 3
        const son = document.querySelector('#gameContainer')
        game.removeChild(son)
        title.style.display = ''
        menuContainer.style.display = 'flex'
        body.style.background =' url("imagens/forest.jpg") no-repeat'
        body.style.backgroundSize = '100%'
    }
}

const sendAnswer = ()=>{
    const paragrafs = document.querySelectorAll('.line')
    console.log(paragrafs)
    for(let i = 0;i<paragrafs.length ;i+=1){
        answer.push(paragrafs[i].value)
    }
    answer = answer.toString()
    answer = answer.replaceAll(',','')
    console.log(answer)
    console.log(word)
    if(answer === word){
        correctAnswer = true
    }else{
        answer = []
        attempts -=1
        cleanTextArea()
    }
    endGame()
}

const secretWord = async() =>{
    const gameContainer = document.createElement('div')
    gameContainer.id = 'gameContainer'
    game.appendChild(gameContainer)
    word = await pokemonRender(randomNumber())
    let secretWord = []
    const lettersContainer = document.createElement('div')
    gameContainer.appendChild(lettersContainer)
    lettersContainer.style.display ='flex'
    lettersContainer.style.justifyContent = 'center'
    for( let  i =0; i<word.length ; i += 1){
        const line = document.createElement('textarea')
        line.className = 'line'
        line.maxLength = 1
        lettersContainer.appendChild(line)
        line.addEventListener('keyup',catchValues)
    }
    const button = document.createElement('button')
    button.className = 'buttonAnswer'
    button.innerHTML = 'Enviar Resposta'
    button.addEventListener('click',sendAnswer)
    gameContainer.appendChild(button)
    const arr = [secretWord,word]
    return arr
}


buttonPlay.addEventListener('click',secretWord)