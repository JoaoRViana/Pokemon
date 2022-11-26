const buttonPlay = document.querySelector('#playGame');
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
    const number = Math.round((Math.random()*251))
    return number.toString()
}


const cleanScreen = ()=>{
    answer = []
    attempts = 3
    correctAnswer = false
    const son = document.querySelector('#gameContainer')
    game.removeChild(son)
    loadScreen(renderMenu)
}
const renderMenu = ()=>{
    const gifLoad = document.querySelector('.gifLoad')
    body.removeChild(gifLoad)
    body.style.background =' url("imagens/forest.jpg") no-repeat'
    body.style.backgroundSize = 'cover'
    body.style.height = '100vh'
    title.style.display = ''
    menuContainer.style.display = 'flex'

}

const loadScreen = (afterLoad)=>{
    const oldGif = document.querySelectorAll('.gifLoad')
    if(oldGif.length >0){
        oldGif[0].remove()
    }
    const gifLoad = document.createElement('img')
    menuContainer.style.display = 'none'
    title.style.display = 'none'
    gifLoad.src = './imagens/load.gif'
    gifLoad.className = 'gifLoad'
    body.style.background = '#000'
    body.appendChild(gifLoad)
    return setTimeout(afterLoad,1000)
}
const win =()=>{
    const button = document.querySelector('#buttonAnswer')
    button.innerHTML = 'Parabéns você acertou'
}

const loose = ()=>{
    const button = document.querySelector('#buttonAnswer')
    button.innerHTML = `Você errou !
    O pokemon era: <h4>${word.toUpperCase()}</h4>`
}
const getPokemon = async(pokemonNumber)=>{
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
    const data = await APIResponse.json()
    return data
}

const pokemonRender = async(pokemonNumber)=>{
    const data = await getPokemon(pokemonNumber)
    const img = document.createElement('img')
    title.style.display = 'none'
    menuContainer.style.display = 'none'
    img.src = data.sprites.versions['generation-v']['black-white'].animated.front_default
    img.className = 'pokemon'
    img.style.filter = 'brightness(0%)'
    body.style.background =' url("imagens/deepForest.png") no-repeat'
    body.style.backgroundSize = 'cover'
    body.style.maxheight = '100vh'
    gameContainer.appendChild(img)
    if(img.style.height > 60){
        img.style.height = '20vh'
    }else{
        img.style.height = '25vh'
    }
    const name = data['name']
    return name
}

const catchValues = (event)=>{
    const proximo = event.target.nextSibling
    if(event.target.value.length >0 && proximo !== null){
        proximo.focus()
    }
}

const cleanTextArea = () =>{
    const paragrafs =document.querySelectorAll('.line')
    for(let i  = 0; i <paragrafs.length; i +=1 ){
        paragrafs[i].value = ''
    }
}

const afterHit =()=>{
    const pokemon = document.querySelector('.pokemon')
    pokemon.style.filter = 'brightness(0%)'
    const buttonAnswer = document.querySelector('#buttonAnswer')
    buttonAnswer.disabled = false
}

const wrongAnswer = () =>{
    const pokemon = document.querySelector('.pokemon')
    const pokeballs = document.querySelector('#pokeballs')
    const buttonAnswer = document.querySelector('#buttonAnswer')
    buttonAnswer.disabled = true
    pokemon.style.filter = 'contrast(0%)'
    answer = []
    attempts -=1
    pokeballs.innerHTML = `x${attempts}`
    cleanTextArea()
    if(correctAnswer === false && attempts > 0){
        setTimeout(afterHit,500)
    }
}


const endGame =  ()=>{
    const buttonAnswer = document.querySelector('#buttonAnswer')
    buttonAnswer.disabled = true
    const pokemon = document.querySelector('.pokemon')
    pokemon.style.filter = 'brightness(100%)'
    if( correctAnswer === true){
        win()
    }else{
        loose()
    }
    setTimeout(cleanScreen,3000)
}

const sendAnswer = ()=>{
    const paragrafs = document.querySelectorAll('.line')
    for(let i = 0;i<paragrafs.length ;i+=1){
        answer.push(paragrafs[i].value)
    }
    answer = answer.toString()
    answer = answer.replaceAll(',','')
    console.log(word)
    if(answer.toLowerCase() === word.toLowerCase()){
        correctAnswer = true
    }else{
        wrongAnswer()
    }
    if(correctAnswer === true || attempts <1){
        endGame()
    }
}

const renderLines = (gameContainer) =>{
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
}

const renderButtonAnswer = (gameContainer)=>{
    const button = document.createElement('button')
    button.id = 'buttonAnswer'
    button.innerHTML = 'Capturar'
    button.addEventListener('click',sendAnswer)
    gameContainer.appendChild(button)
}

const renderAttempts = (gameContainer)=> {
    const pokeballs = document.createElement('p')
    const imgPokeballs = document.createElement('img')
    imgPokeballs.id = 'imgPokeballs'
    imgPokeballs.src = './imagens/pokeball.png'
    pokeballs.id = 'pokeballs'
    pokeballs.innerHTML = `x${attempts}`
    const br = document.createElement('br')
    gameContainer.appendChild(br)
    gameContainer.appendChild(pokeballs)
    gameContainer.appendChild(imgPokeballs)
}

const startGame = async() =>{
    const gameContainer = document.createElement('div')
    const gif = document.querySelector('.gifLoad')
    body.removeChild(gif)
    gameContainer.id = 'gameContainer'
    game.appendChild(gameContainer)
    word = await pokemonRender(randomNumber())
    renderLines(gameContainer);
    renderButtonAnswer(gameContainer)
    renderAttempts(gameContainer)
    const arr = [word]
    return arr
}

const iniciando = ()=> {
    loadScreen(startGame)
}
buttonPlay.addEventListener('click',iniciando)