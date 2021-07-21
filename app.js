const background = document.querySelector(".container")
const mode = document.querySelector(".mode")
const generateBtn = document.querySelector(".kanji-btn")
const kanjiDisplay = document.querySelector(".kanji")
const infoBox = document.querySelector(".info-box")
const meaning = document.querySelector(".meaning")
const kun = document.querySelector(".kun")
const on = document.querySelector(".on")
const stroke = document.querySelector(".stroke")
const jlpt = document.querySelector(".jlpt")
const grade = document.querySelector(".grade")
let day = false

window.onLoad = getKanji()

mode.addEventListener("click", () => {
    if(!day) { 
        background.classList.add("day")
        kanjiDisplay.style.backgroundColor = "rgba(255, 255, 255, 0.7)"
        kanjiDisplay.style.color = "#000"
        infoBox.style.backgroundColor = "rgba(255, 255, 255, 0.7)"
        mode.innerHTML = "Dark mode"
        day = true
    } else if(day) {
        background.classList.remove("day")
        kanjiDisplay.style.backgroundColor = "rgb(15, 15, 15)"
        kanjiDisplay.style.color = "#fff"
        infoBox.style.backgroundColor = "rgb(15, 15, 15, 0.5)"
        mode.innerHTML = "Light mode"
        day = false
    }
})

generateBtn.addEventListener("click", ()=> {
getKanji()
})

async function getKanji() {
let jouyou = await fetch("https://kanjiapi.dev/v1/kanji/jouyou")
let data1 = await jouyou.json()
let jinmeiyou = await fetch("https://kanjiapi.dev/v1/kanji/jinmeiyou")
let data2 = await jinmeiyou.json()
console.log(data2)

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
            // let removed = data.on_readings[o].replace(".", "")
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