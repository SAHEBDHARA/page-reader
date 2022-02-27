const video = document.querySelector("video") // 
const textElem = document.querySelector("[data-text]") // select the text recognized from the canvas

async function setup() { // making that async  
  const stream = await navigator.mediaDevices.getUserMedia({ video: true }) // geting the acces of users video access
  video.srcObject = stream // use stream as the source of the video

  video.addEventListener("playing", async () => { // if run or pause the video, this function will activate
    const worker = Tesseract.createWorker() // that is giong to create a worker which is comming from the source link
    await worker.load() // this is going to load our worker
    await worker.loadLanguage("eng") // then load the language in case the language is english
    await worker.initialize("eng") // we have initialize with that language 

    const canvas = document.createElement("canvas") // used canvas to get img from the video 
    canvas.width = video.width // cnavas width 
    canvas.height = video.height // canvas height

    document.addEventListener("keypress", async e => { // this event will listne while pressing any key
      if (e.code !== "Space") return // if the keypress is space then return..
      canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height) // draw the entair video screen over the enteir canvas
      const {                                                                   // this gives the current frame of our video into the canvas
        data: { text },
      } = await worker.recognize(canvas) // text recognize from the canvas

      speechSynthesis.speak( // speechSynthesis API is used to speak the text 
        new SpeechSynthesisUtterance(text.replace(/\s/g, " ")) // avoiding the space newline 
      )

      textElem.textContent = text // save the text to the textElem
    })
  })
}

setup()