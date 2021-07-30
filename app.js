const pageContainer = document.querySelector(".container")
const menu = document.querySelector(".menu")
const btnContainer = document.querySelector(".btn-container")
const quizBtn = document.querySelector(".quiz-mode")
const mode = document.querySelector(".light-mode")
const generateBtn = document.querySelector(".kanji-btn")
const kanjiDisplay = document.querySelector(".kanji")
const infoBox = document.querySelector(".info-box")
const info = document.querySelector(".info")
const revealBtn = document.querySelector(".reveal")
const meaning = document.querySelector(".meaning")
const kun = document.querySelector(".kun")
const on = document.querySelector(".on")
const stroke = document.querySelector(".stroke")
const jlpt = document.querySelector(".jlpt")
const grade = document.querySelector(".grade")
let darkMode = true
let studyMode = true

window.onLoad = getKanji()
quizBtn.addEventListener("click", manageQuizMode)
revealBtn.addEventListener("click", revealKanjiInfo)

window.onclick = (e) => {
    if (e.target === menu) {
        btnContainer.classList.toggle("show")
    } else {
        btnContainer.classList.remove("show")
    }
}

mode.addEventListener("click", () => {
    if(darkMode) { 
        darkMode = false
        pageContainer.style.backgroundColor = "#83db86"
        pageContainer.style.color = "rgb(30, 30, 30)"
        kanjiDisplay.style.backgroundColor = "rgba(255, 255, 255, 0.4)"
        kanjiDisplay.style.color = "rgb(20, 20, 20)"
        infoBox.style.backgroundColor = "rgba(255, 255, 255, 0.4)"
        mode.innerHTML = "Dark mode"
        
    } else if(!darkMode) {
        pageContainer.style.backgroundColor = "#1f1f1f"
        pageContainer.style.color = "#fff"
        kanjiDisplay.style.backgroundColor = "rgb(15, 15, 15)"
        kanjiDisplay.style.color = "#fff"
        infoBox.style.backgroundColor = "rgb(15, 15, 15, 0.5)"
        mode.innerHTML = "Light mode"
        darkMode = true
    }
})

function manageQuizMode() {
if (studyMode) {
    quizBtn.innerHTML = "Study mode"
    studyMode = false
    info.style.visibility = "hidden"
    revealBtn.style.visibility = "visible"
    } else {
    quizBtn.innerHTML = "Quiz mode"
    studyMode = true
    info.style.visibility = "visible"
    revealBtn.style.visibility = "hidden"
    }
}

function revealKanjiInfo() {
    revealBtn.style.visibility = "hidden"
    info.style.visibility = "visible"
}

generateBtn.addEventListener("click", ()=> {
getKanji()
})

async function getKanji() {
let jouyou = await fetch("https://kanjiapi.dev/v1/kanji/jouyou")
let data1 = await jouyou.json()
let jinmeiyou = await fetch("https://kanjiapi.dev/v1/kanji/jinmeiyou")
let data2 = await jinmeiyou.json()

Promise.all([data1, data2]).then((lists) => {
    let list = lists[0].concat(lists[1])
    return getRandomKanji(list)
})

function getRandomKanji(list) {
    let kanji = list[Math.floor((Math.random()*list.length))]
    return getKanjiData(kanji)
}

async function getKanjiData(kanji) {
    let r = await fetch(`https://kanjiapi.dev/v1/kanji/${kanji}`)
    let data = await r.json()
    return generateDisplay(data)
    }
}

function generateDisplay(data) {
    if(!studyMode) {
        info.style.visibility = "hidden"
        revealBtn.style.visibility = "visible"
    }
    let meaningsArr = []
    let kunArr = []
    let onArr = []
    kanjiDisplay.innerHTML = data.kanji
    stroke.innerHTML = data.stroke_count
    grade.innerHTML = data.grade

    for(var i = 0; i < data.meanings.length; i++) {
        meaningsArr.push(" "+data.meanings[i])
        meaning.innerHTML = meaningsArr
    }
    
    if(data.kun_readings.length === 0) {
        kun.innerHTML = "n/a"
    } else {
        for(var k = 0; k < data.kun_readings.length; k++) {
            let removed = data.kun_readings[k].replace(".", "")
            kunArr.push("  "+removed)
            kun.innerHTML = kunArr
        } 
    }

    if(data.on_readings.length === 0) {
        on.innerHTML = "n/a"
    } else {
        for(var o = 0; o < data.on_readings.length; o++) {
            onArr.push("  "+data.on_readings[o])
            on.innerHTML = onArr
    }
}

    if(data.jlpt === null) {
        jlpt.innerHTML = "n/a"
    } else {
        jlpt.innerHTML = data.jlpt
    }
}