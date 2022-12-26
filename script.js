const buttonPlay = document.querySelector('#playGame');
const buttonDifficult = document.querySelector('#chooseDifficult')
const game = document.querySelector('#game')
const menuContainer = document.querySelector('#menuContainer')
const title = document.querySelector('#title')
const body = document.querySelector('body')
const buttonTrainer  = document.querySelector('#trainerButton')
const buttonsMenu = document.querySelector('#buttonsMenu')
let correctAnswer = false
let answer = []
let attempts = 3
let word = ''
let number;
let trainerName = ''
let notName = true
let timer = false
let mobile = false
const userAgent = navigator.userAgent.toLowerCase();
if( userAgent.search(/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i)!= -1 ){
    mobile = true
}


const randomNumber = ()=>{
    number = Math.round((Math.random()*151))
    return number.toString()
}


const cleanScreen = ()=>{
    answer = []
    attempts = 3
    correctAnswer = false
    buttonPlay.disabled = false
    if(trainerName.length < 1){
        notName = true
    }
    darkness(renderMenu)
}
const renderMenu = ()=>{
    const gifLoad = document.querySelector('.gifLoad')
    body.removeChild(gifLoad)
    body.style.background =' url("imagens/forest.jpg") no-repeat'
    body.style.backgroundSize = 'cover'
    body.style.height = '100vh'
    title.style.display = ''
    menuContainer.style.display = 'inline'

}

const darkness = (afterLoad) =>{
    const loadScreen = ()=>{
        const oldGif = document.querySelectorAll('.gifLoad')
        if(oldGif.length >0){
            oldGif[0].remove()
        }
        if(game.children.length >0){
            const son = document.querySelector('#gameContainer')
            game.removeChild(son)
        }
        const gifLoad = document.createElement('img')
        menuContainer.style.display = 'none'
        title.style.display = 'none'
        gifLoad.src = './imagens/load.gif'
        gifLoad.className = 'gifLoad'
        body.style.background = '#000'
        body.appendChild(gifLoad)
        body.style.animation = ''
        return setTimeout(afterLoad,1000)
    }
    setTimeout(loadScreen,1000)
}


const win =()=>{
    const button = document.querySelector('#buttonAnswer')
    if(trainerName !== ''){
        let pokedex = JSON.parse(localStorage.getItem(trainerName))
        pokedex[number] = word
        localStorage.setItem(trainerName,JSON.stringify(pokedex))
    }
    button.innerHTML = 'Parabéns você acertou'
}

const loose = ()=>{
    const button = document.querySelector('#buttonAnswer')
    button.innerHTML = `Ele fugiu!
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

const inserValues = (event)=>{
    if(event.which !== 13){
        const proximo = event.target.nextSibling
        if(event.target.value.length >0 && proximo !== null){
            proximo.focus()
        }
    }
    if(event.target.value === '\n'){
        event.target.value = ''
    }
}

const cleanTextArea = () =>{
    const paragrafs =document.querySelectorAll('.line')
    for(let i  = 0; i <paragrafs.length; i +=1 ){
        paragrafs[i].value = ''
    }
    paragrafs[0].focus()
    answer = []
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

const CountTime = () =>{
    timer = true
    return timer
}

const endGame =  ()=>{
    const buttonAnswer = document.querySelector('#buttonAnswer')
    buttonAnswer.disabled = true
    const pokemon = document.querySelector('.pokemon')
    pokemon.style.filter = 'brightness(100%)'
    if( correctAnswer === true){
        win()
    }else{
        const pokemon = document.querySelector('.pokemon')
        pokemon.style.animation = '2.7s ease-in flee 0.1s'
        loose()
    }
    setTimeout(cleanScreen,1500)
}

const catchValues = ()=>{
    const lines = document.querySelectorAll('.line')
    for( let i = 0; i<lines.length ; i +=1){
        answer.push(lines[i].value)
    }
    answer = answer.toString()
    answer = answer.replaceAll(',','')
}

const sendAnswer = ()=>{
    answer = []
    catchValues()
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
        const line = document.createElement('input')
        line.className = 'line'
        line.maxLength = 1
        lettersContainer.appendChild(line)
        line.addEventListener('keyup',inserValues)
    }
}

const renderButtonAnswer = (gameContainer)=>{
    const button = document.createElement('button')
    button.id = 'buttonAnswer'
    button.innerHTML = 'Capturar'
    button.addEventListener('click',sendAnswer)
    mobile === true?button.style.fontSize = '25px':false
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
    document.addEventListener('keypress',function(key){
        if((correctAnswer === false || attempts < 1)){
            if(key.which === 13 && setTimeout(CountTime,1000)){
                catchValues()
                if(answer.length === word.length ){
                    sendAnswer()
                }else{
                    answer = []
                }
            }
        
        }
    })
    const lines = document.querySelectorAll('.line')
    lines[0].focus()

}


const removeInputTrainer = ()=>{
    const input = document.querySelector('#inputTrainer')
    const inputTitle= document.querySelector('#inputTitle')
    input.remove()
    inputTitle.remove()
    buttonTrainer.addEventListener('click',renderInputTrainer)
    buttonTrainer.removeEventListener('click',removeInputTrainer)

}

const renderTrainerName =()=>{
    const inputTitle = document.querySelector('#inputTitle')
    const inputName = document.querySelector('#inputTrainer')
    title.innerHTML = `Bem vindo ${trainerName}`
    buttonTrainer.remove()
    inputTitle.remove()
    inputName.remove()
}

const catchTrainerName = () =>{
    const trainer = document.querySelector('#inputTrainer')
    trainerName = trainer.value
    if(trainerName.length > 1 ){
        const getTrainer = localStorage.getItem(trainerName)
        let pokedex = localStorage.getItem(trainerName.pokedex)
        if(pokedex === null){
            pokedex ={}
        }
        if(getTrainer === null){
            localStorage.setItem(trainerName,JSON.stringify(pokedex))
        }
        notName = false
        renderTrainerName()
        mobile === true?false:renderButtonPokedex();
    }
    else{
        alert('nome inválido')
    }
}


const renderInputTrainer = ()=>{
    buttonTrainer.disabled = true
    const input = document.createElement('input')
    const inputTitle = document.createElement('h4')
    inputTitle.innerHTML = 'Qual seu nome?'
    input.id = 'inputTrainer'
    inputTitle.id = 'inputTitle'
    buttonsMenu.appendChild(inputTitle)
    buttonsMenu.appendChild(input)
    if(buttonTrainer.disabled === true){
        buttonTrainer.disabled = false
        buttonTrainer.removeEventListener('click',renderInputTrainer)
        buttonTrainer.addEventListener('click',removeInputTrainer)
    }
    document.addEventListener('keypress',function(key){
        if(key.which === 13 && notName == true){
            catchTrainerName()
        }
    })
    input.focus()
}

const iniciando = ()=> {
    notName = false
    window.onload = darkness(startGame)

}
buttonPlay.addEventListener('click',iniciando)
buttonTrainer.addEventListener('click',renderInputTrainer)

const removePokedex = () =>{
    const buttonPokedex = document.querySelector('#buttonPokedex')
    const pokedexContainer = document.querySelector('#pokedexContainer')
    pokedexContainer.remove()
    buttonsMenu.style.marginLeft = ''
    buttonPokedex.removeEventListener('click',removePokedex)
    buttonPokedex.addEventListener('click',renderPokedex)

}


const renderPokedex = ()=>{
    const buttonPokedex = document.querySelector('#buttonPokedex')
    const pokedexContainer = document.createElement('aside')
    pokedexContainer.id = 'pokedexContainer'
    pokedexContainer.innerHTML = 'Pokemons que você já capturou:'
    const listPokedex = document.createElement('ul')
    pokedexContainer.appendChild(listPokedex)
    let pokedex = JSON.parse(localStorage.getItem(trainerName))
    let len = Object.keys(pokedex).length
    for(let i = 0 ; i < len; i+=1){
        const li = document.createElement('li')
        li.innerHTML = `nº ${Object.keys(pokedex)[i]}: <u>${Object.values(pokedex)[i]}</u>`
        listPokedex.appendChild(li)
    }
    buttonsMenu.style.marginLeft = '30.1vw'
    buttonPokedex.addEventListener('click',removePokedex)
    menuContainer.appendChild(pokedexContainer)
    pokedexContainer.appendChild(listPokedex)
    buttonPokedex.removeEventListener('click',renderPokedex)

}

const renderButtonPokedex = () =>{
    const buttonPokedex = document.createElement('button')
    buttonPokedex.className = 'menuButton'
    buttonPokedex.id = 'buttonPokedex'
    buttonPokedex.innerHTML = 'Pokedex'
    buttonsMenu.appendChild(buttonPokedex)
    buttonPokedex.addEventListener('click',renderPokedex)
}

