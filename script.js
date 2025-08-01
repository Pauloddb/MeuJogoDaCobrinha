const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const score = document.querySelector('#pontos')
const timerTxt = document.querySelector('span#timer')
const passosTxt = document.getElementById('passos')
const direcaoTxt = document.getElementById('direcao')
const paineis = document.querySelectorAll('.painel')
const botoes = document.querySelectorAll('.botao')
const direcionais = document.querySelectorAll('.direcional-cll')


if (window.innerWidth <= 768) {
  console.log(1)
  canvas.width = window.innerWidth - 20  // tira um espacinho da margem
  canvas.height = canvas.width
}


const tam = canvas.width / 20
let direcao = 'und', cobralistx, cobralisty, isPaused = false, contagem, countMoves = 0, passos = 0

let tempo = {
    min: '00',
    seg: '00',
    mls: '00'
}



const funcMovimento = (e) => {
    if ('wasd'.includes(e.key)){
        if ((e.key == 'ArrowUp' || e.key == 'w') && direcao != 'baixo') direcao = 'cima'
        else if ((e.key == 'ArrowDown' || e.key == 's') && direcao != 'cima') direcao = 'baixo'
        else if ((e.key == 'ArrowLeft' || e.key == 'a') && direcao != 'direita' && direcao != 'und') direcao = 'esquerda'
        else if ((e.key == 'ArrowRight' || e.key == 'd') && direcao != 'esquerda') direcao = 'direita'

        countMoves++

        if (countMoves === 1){
            contagem = setInterval(() => {
                if (Number(tempo.mls) < 99) tempo.mls = String(Number(tempo.mls) + 1)
                else {
                    tempo.mls = '00'
                    tempo.seg = String(Number(tempo.seg) + 1)
                }
                if (Number(tempo.seg) >= 60) {
                    tempo.seg = '00'
                    tempo.min = String(Number(tempo.min) + 1)
                }

                timerTxt.textContent = `${Number(tempo.min).toString().padStart(2, '0')}:${Number(tempo.seg).toString().padStart(2, '0')}:${Number(tempo.mls).toString().padStart(2, '0')}`
            }, 10)
        }

        
    }
}


document.addEventListener('keydown', funcMovimento)

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') location.reload()
})

botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
        paineis.forEach((painel) => {
            if (painel.id === botao.id.replace('btn-', '')){
                paineis.forEach(p => p.classList.remove('ativo'))
                painel.classList.add('ativo')
            }
        })
    })  
})


direcionais.forEach(direcional => {
    direcional.addEventListener('click', (e) => { 
        if (direcional.id.includes('du') && direcao !== 'baixo') direcao = 'cima'
        else if (direcional.id.includes('dd') && direcao !== 'cima') direcao = 'baixo'
        else if (direcional.id.includes('dl') && direcao !== 'direita' && direcao != 'und') direcao = 'esquerda'
        else if (direcional.id.includes('dr') && direcao !== 'esquerda') direcao = 'direita'
    })
})



let cobra = [
    {x: canvas.width / 2 - tam, y: canvas.width / 2, color: 'green'},
    {x: canvas.width / 2, y: canvas.width / 2, color: 'green'},
    {x: canvas.width / 2 + tam, y: canvas.width / 2, color: 'limegreen'}
]
let head = cobra.at(-1)



let comida = {
    x: Math.floor(Math.random() * (canvas.width / tam)) * tam,
    y: Math.floor(Math.random() * (canvas.height / tam)) * tam,
    color: 'yellow'
}


const desenharGrade = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = 'white'

    for(let x = 0; x <= canvas.width; x += tam){
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
    }
    for(let y = 0; y <= canvas.width; y += tam){
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
    }
}


const desenharRect = (x, y, w, h, color, verf=false, colorborda=undefined) => {
    if (verf) {
        ctx.lineWidth = 2
        ctx.strokeStyle = colorborda
    }
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
    ctx.strokeRect(x, y, w, h)
}






const gerarNovaComida = () => {
    comida = {
        x: Math.floor(Math.random() * (canvas.width / tam)) * tam,
        y: Math.floor(Math.random() * (canvas.height / tam)) * tam
    }

    for (let ibloco = 0; ibloco < cobra.length - 1; ibloco += 1) {

        while (cobra[ibloco].x == comida.x && cobra[ibloco].x == comida.x) {
            comida = {
                x: Math.floor(Math.random() * (canvas.width / tam)) * tam,
                y: Math.floor(Math.random() * (canvas.height / tam)) * tam
            }
        }
    }
}




const desenharCobra = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let bloco of cobra) {
        desenharRect(bloco.x, bloco.y, tam, tam, bloco.color, true,'black')
    }
    desenharRect(comida.x, comida.y, tam, tam, 'red', true, 'black')
    desenharGrade()
}


const moverCobra = () => {
    let listax = [], listay = []
    head = cobra.at(-1)
    

    if('direita esquerda cima baixo'.includes(direcao)){
        if (direcao == 'direita') {
            if (head.x + tam == comida.x && head.y == comida.y) {
                gerarNovaComida()
            } else {
                cobra.shift()
            }

            if (cobra.some(bloco => bloco.x == head.x + tam && bloco.y == head.y)) location.reload()
            if (cobra.some(bloco => bloco.x == canvas.width - tam)) location.reload()
            
            cobra.push({
                x: head.x + tam,
                y: head.y,
                color: head.color
            })
        }

        if (direcao == 'esquerda') {
            if (head.x - tam == comida.x && head.y == comida.y) {
                gerarNovaComida()
            } else {
                cobra.shift()
            }

            if (cobra.some(bloco => bloco.x == head.x - tam && bloco.y == head.y)) location.reload()
            if (cobra.some(bloco => bloco.x == 0)) location.reload()

            cobra.push({
                x: head.x - tam,
                y: head.y,
                color: head.color
            })
        }

        if (direcao == 'cima') {
            if (head.x == comida.x && head.y - tam == comida.y) {
                gerarNovaComida()
            } else {
                cobra.shift()
            }

            if (cobra.some(bloco => bloco.x == head.x && bloco.y == head.y - tam)) location.reload()
            if (cobra.some(bloco => bloco.y == 0)) location.reload()

            cobra.push({
                x: head.x,
                y: head.y - tam,
                color: head.color
            })
        }

        if (direcao == 'baixo') {
            if (head.x == comida.x && head.y + tam == comida.y) {
                gerarNovaComida()
            } else {
                cobra.shift()
            }

            if (cobra.some(bloco => bloco.x == head.x && bloco.y == head.y + tam)) location.reload()
            if (cobra.some(bloco => bloco.y == canvas.height - tam)) location.reload()

            cobra.push({
                x: head.x,
                y: head.y + tam,
                color: head.color
            })
        }

        passos++
        passosTxt.textContent = `Passos: ${passos}`
        direcaoTxt.textContent = `Direção: ${direcao}`
    }
    


    for (bloco of cobra) {
        listax.push(bloco.x)
        listay.push(bloco.y)
    }

    cobralistx = [...listax]
    cobralisty = [...listay]

    
    score.textContent = `Pontuação: ${cobra.length - 3}`

    cobra.at(-2).color = 'green'
    desenharCobra()
}



desenharCobra()
desenharGrade()
moverCobra()

let movimento = setInterval(moverCobra, 100)




document.addEventListener('keydown', (tecla) => {
    if (tecla.key === ' '){
        if (isPaused){
            contagem = setInterval(() => {
                if (Number(tempo.mls) < 99) tempo.mls = String(Number(tempo.mls) + 1)
                else {
                    tempo.mls = '00'
                    tempo.seg = String(Number(tempo.seg) + 1)
                }
                if (Number(tempo.seg) >= 60) {
                    tempo.seg = '00'
                    tempo.min = String(Number(tempo.min) + 1)
                }

                timerTxt.textContent = `${Number(tempo.min).toString().padStart(2, '0')}:${Number(tempo.seg).toString().padStart(2, '0')}:${Number(tempo.mls).toString().padStart(2, '0')}`
            }, 10)

            movimento = setInterval(moverCobra, 100)

            document.addEventListener('keydown', funcMovimento)
            //console.log('Não Pausado')

        } else if (!isPaused){
            clearInterval(movimento)
            clearInterval(contagem)

            document.removeEventListener('keydown', funcMovimento)
            //console.log('Pausado')
        }

        isPaused = !isPaused
    }
})






