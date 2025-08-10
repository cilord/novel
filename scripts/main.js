let linkNovel;
let regexPattern;
const synth = window.speechSynthesis;
if (!synth) console.error("Browser Anda tidak mendukung Web Speech API.");
const utterance = new SpeechSynthesisUtterance();
utterance.lang = "id-ID";

document.getElementById("link_novel").oninput=(e)=>linkNovel=e.target.value;
document.getElementById("regex").oninput=(e)=>regexPattern=e.target.value;
document.getElementById("fetch").onclick = () => getContent();
document.getElementById("play").onclick=()=>{
    utterance.text=document.getElementById("content").innerText;
    synth.speak(utterance);
}

function getContent(){
    if(linkNovel){
        fetch(linkNovel).then(r=>{
            if (!response.ok) {
              throw new Error('Gagal mengambil data: ' + response.statusText);
            }
            return response.text();
        })
        .then(data=>console.log(data))
        .catch(err=>console.error('ada masalah: ', err));
    }
}


// script.js

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./scripts/sw.js')
            .then(registration => {
                console.log('Service Worker berhasil didaftarkan: ', registration.scope);
            })
            .catch(error => {
                console.error('Pendaftaran Service Worker gagal: ', error);
            });
    });
}