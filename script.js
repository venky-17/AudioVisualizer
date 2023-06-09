
 function hslToRgb(h, s, l) {
    let r;
    let g;
    let b;
  
    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
  
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
  
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
const width  = 1500;
const height =1500;

const canvas = document.querySelector(".canvas")

const ctx = canvas.getContext('2d')

canvas.width = width;
canvas.height = height;

let analyser;
let bufferLength;
function handleError(err){
    console.log('pls give access to ur microphone');
}

async function getAudio(){
  const stream = await navigator.mediaDevices.getUserMedia({audio: true})
  .catch(handleError)
const audioCtx = new AudioContext();
analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaStreamSource(stream);
source.connect(analyser);

analyser.fftSize = 2**10;
  bufferLength = analyser.frequencyBinCount
const timeData = new Uint8Array(bufferLength);
const frequencyData = new Uint8Array(bufferLength)
drawTimeData(timeData);
drawFrequency(frequencyData);
}

function drawTimeData(timeData){
    analyser.getByteTimeDomainData(timeData)
//console.log(timeData);
ctx.clearRect(0,0, width,height)


ctx.lineWidth =8;
ctx.strokeStyle = "#ffc600"
ctx.beginPath();

const sliceWidth = width / bufferLength;
let x= 0;

timeData.forEach((data,i) => {
    const v = data/128;
    const y = (v * height)/2.2;
 
if(i===0){
    ctx.moveTo(x,y);
} else{
    ctx.lineTo(x,y)
}
x+= sliceWidth;

})
ctx.stroke();
//console.log(sliceWidth);


requestAnimationFrame(()=> drawTimeData(timeData))

}

function drawFrequency(frequencyData){
    analyser.getByteFrequencyData(frequencyData)

const barWidth = (width/bufferLength) *2.5;
//console.log(barWidth);
 let x =0;
 frequencyData.forEach(amount =>{
    const percent = amount/255;
    const barHeight = (height*percent)/2;
    const [h,s,l]= [360/(percent*360),1,0.5]
    
   

    //hsl color
    const [r,g,b] = hslToRgb(h,s,l)


ctx.fillStyle = `rgb(${r},${g},${b})`;
ctx.fillRect(x, height-barHeight, barWidth, barHeight)
x += barWidth+2;
 })


   
    requestAnimationFrame(() => drawFrequency(frequencyData));


}



getAudio();
