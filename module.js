<<<<<<< HEAD
import { HfInference } from "https://cdn.skypack.dev/@huggingface/inference@2.6.4";
import { tts } from './index.js';
import { settingsModal } from './index.js';
import { passwordModal } from './index.js';
import { successfulWarning } from "./index.js";
import { infoWarning } from "./index.js";
import { alertWarning } from "./index.js";
import { errorWarning } from "./index.js";
import { enableTTS } from "./index.js";

import { Marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const { markedHighlight } = globalThis.markedHighlight;
hljs.addPlugin(new CopyButtonPlugin({
  hook: (text, el) => text.toUpperCase()
}));

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);


let history = '';
var formattedDate;
var generating = false;

// A function that requests a file from the server and logs its contents
function historyReader(date) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', './definition.txt', true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var fileContent = xhr.responseText;
      history = fileContent;
    }
  };

  xhr.send();
}
window.onload = function () {
  const timeZone = 'America/Sao_Paulo'; // 'America/Sao_Paulo' corresponds to GMT-3
  const locale = 'pt-BR';

  const currentDate = new Date();
  const options = { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };

  formattedDate = new Intl.DateTimeFormat(locale, options).format(currentDate);

  historyReader(formattedDate);
}

function getRandomDuration(value1, value2) {
  // Generate a random number between 0 (inclusive) and 1 (exclusive)
  const randomValue = Math.random();

  // Check if the random number is less than 0.2
  if (randomValue < 0.2) {
    return value1;
  } else {
    return value2;
  }
}


async function* textStreamRes(hf, controller, input) {
  let tokens = [];
  for await (const output of hf.textGenerationStream(
    {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: input,
      parameters: { max_new_tokens: 1000 },
    },
    {
      use_cache: false,
      signal: controller.signal,
    }
  )) {
    tokens.push(output);
    yield tokens;
  }
}



$("#confirmPassword").bind("click", confirmPassword);


function playParagraphs(element) {
  let elements = element.querySelectorAll('p, ul, ol');
  let audios = Array.from(elements).map(element => {
    let text = '';
    let text2 = '';
    text = element.textContent.replace('██████ ████', "--");
    text2 = text.replace('████', '--');
    return tts(text2, true, "@Rafafa2105");
  });

  Promise.all(audios).then(audios => {
    let i = 0;
    function playNextAudio() {
      if (i < audios.length) {
        audios[i].play();
        let loadingCircle = document.querySelector(".maskedCircle");
        loadingCircle.style.animation = "reverseColor 1s linear forwards, reverseGlow 1s linear forwards, blink 1s infinite linear";
        audios[i].onended = playNextAudio;
        i++;
      }
    }
    playNextAudio();
  });
}

var messageIndex = 0;

async function run(rawInput, password) {
  const controller = new AbortController();
  const message = "[INST]{:}[/INST]";
  const input = message.replace("{:}", rawInput);
  const token = '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';
  const hf = new HfInference(token);
  let gen = document.createElement("div");
  let loadingCircle = document.querySelector(".maskedCircle");
  history += input;

  gen.innerHTML = "";
  try {
    for await (const tokens of textStreamRes(hf, controller, history)) {
      const lastToken = tokens[tokens.length - 1];
      const lastTokenFormated = lastToken.token.text;
      gen.textContent += lastTokenFormated.replace("</s>", "");
      history += lastTokenFormated;

      if (lastTokenFormated == "</s>") {
        gen.innerHTML = marked.parse(gen.textContent);
        let historyElement = document.querySelector("#history");
        let historyMessageGroup = document.querySelector("#messageIndex" + messageIndex);

        gen.id = "aiMessage";


        setTimeout(() => {
          historyElement.lastElementChild.scrollIntoView({ behavior: 'smooth' });
      }, 0);
      
      
        historyMessageGroup.appendChild(gen);

        

        // check if gen has any pre elements
        if (gen.querySelectorAll("pre").length > 0) {
          // get all the pre elements in gen
          let preElements = gen.querySelectorAll("pre");
          // loop through each pre element
          for (let pre of preElements) {
            // create a button element
            let button = document.createElement("button");
            // add the copy-button class to the element
            button.setAttribute("class", "copy-button");
            // create a SVG element with the SVG namespace
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            // set the SVG attributes
            svg.setAttribute("viewBox", "0 -960 960 960");
            // create a path element with the SVG namespace
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // set the path attributes
            path.setAttribute("d", "M 320 -240 C 298 -240 279.167 -247.833 263.5 -263.5 C 247.833 -279.167 240 -298 240 -320 L 240 -800 C 240 -822 247.833 -840.833 263.5 -856.5 C 279.167 -872.167 298 -880 320 -880 L 800 -880 C 822 -880 840.833 -872.167 856.5 -856.5 C 872.167 -840.833 880 -822 880 -800 L 880 -320 C 880 -298 872.167 -279.167 856.5 -263.5 C 840.833 -247.833 822 -240 800 -240 L 320 -240 Z M 320 -320 L 800 -320 L 800 -800 L 320 -800 L 320 -320 Z M 160 -80 C 138 -80 119.167 -87.833 103.5 -103.5 C 87.833 -119.167 80 -138 80 -160 L 80 -720 L 160 -720 L 160 -160 L 720 -160 L 720 -80 L 160 -80 Z M 320 -800 L 320 -320 L 320 -800 Z");
            // append the path to the SVG
            svg.appendChild(path);
            // append the SVG to the button
            button.appendChild(svg);
            // append the button to the pre element
            pre.appendChild(button);
            // add a click event listener to the button
            button.addEventListener("click", function () {
              // get the text content of the pre element
              let text = pre.textContent;
              // copy the text to the clipboard using the navigator.clipboard API
              navigator.clipboard.writeText(text)
                .then(() => {
                  // show a success message
                  infoWarning("Copied to clipboard!", "The text was copied to your clipboard.");
                })
                .catch((error) => {
                  // show an error message
                  errorWarning("Copy failed:", error);
                });
            });
          }
        }

        generating = false;


        // TTS part
        if (enableTTS) {
          playParagraphs(gen);
        } else {
          loadingCircle.style.animation = "reverseColor 1s linear forwards, reverseGlow 1s linear forwards, blink 1s infinite linear";
        }

        // Extract the email content using a regular expression
        const emailContent = gen.textContent.match(/sendEmail\("([^"]+)"\)/g);

        // Check if there is a match
        if (emailContent) {
          // Replace any occurrences of '\n' with actual line breaks
          const formattedEmailContent = emailContent.replace(/\\n/g, '\n');
          
          // Call the sendEmail function with the formatted content
          sendEmail(formattedEmailContent);

          gen.textContent = gen.textContent.replace(/sendEmail\([^)]*\)/g, '');
        }



        setTimeout(() => {
          fadeInOut(gen, "fadeIn", 'flex');
        }, 500);

        messageIndex++;


      } else {
        let blinkValue = getRandomDuration(0, 1);

        loadingCircle.style.animation = `color 0.3s linear forwards, glow 0.3s linear forwards`;
        loadingCircle.style.opacity = blinkValue;


        loadingCircle.style.transition = "all 0.1s linear";
      }


    }
  } catch (e) {
    errorWarning("Um erro ocorreu!", e);
    console.log(e);
  }
}

$('#clearHistory').bind('click', function () {
  historyReader(formattedDate);
  let historyElement = document.querySelector('#history');
  infoWarning("Chat resetado!", "O histórico dessa conversa foi limpo!");
  historyElement.style.animation = "fadeOut 0.5s ease-in-out forwards";
  setTimeout(() => {
    let messageElement = document.createElement('div');
    messageElement.id = 'aiMessage';
    historyElement.innerHTML = '';
    messageElement.innerHTML = "<p>Olá, eu sou Stella. Como posso ajudar?</p>";
    let historyMessageGroup = document.createElement("div");
    historyMessageGroup.id = 'messageIndex0';
    historyMessageGroup.setAttribute("class", "messageGroup");
    historyMessageGroup.appendChild(messageElement);
    historyElement.appendChild(historyMessageGroup);    
    historyElement.style.animation = "fadeIn 0.5s ease-in-out forwards";
  }, 525);
});



document.addEventListener("keydown", function (event) {
  const isShiftPressed = event.shiftKey;
  const isEnterPressed = event.key === "Enter";
  const passwordModalElement = document.querySelector('#ttsModalPassword');
  const settingsModalElement = document.querySelector("#settingsModal");

  if (isEnterPressed && !isShiftPressed && passwordModalElement.style.display != 'block' && settingsModalElement.style.display != 'block') {
    event.preventDefault();
    const inputElement = document.querySelector("#input");
    if (generating) {
      alertWarning("Calma amigão", "Uma mensagem de cada vez.");
    } else if (!inputElement.innerText.trim()) {
      window.scrollTo(window.innerWidth, window.innerHeight);
      alertWarning("Input vazio!", "Insira pelo menos um caractere.");
    } else {
      messageIndex++;
      window.scrollTo(window.innerWidth, window.innerHeight);
      generating = true;
      let userMessageElement = document.createElement("div");
      let historyMessageGroup = document.createElement("div");
      let historyElement = document.querySelector("#history");

      userMessageElement.id = "userMessage";
      userMessageElement.innerHTML = marked.parse(inputElement.innerText.trim());

      historyMessageGroup.id = 'messageIndex' + messageIndex;
      historyMessageGroup.className = 'messageGroup';

      historyMessageGroup.appendChild(userMessageElement);
      historyElement.appendChild(historyMessageGroup);
      setTimeout(() => {
        historyElement.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    
      fadeInOut(userMessageElement, "fadeIn", 'flex');
      
      var inputValue = inputElement.innerText.trim();
      console.log(inputValue);


      inputElement.innerHTML = "";
      run(inputValue);
    }
  } else if (isEnterPressed && passwordModalElement.style.display == 'block' && settingsModalElement.style.display != 'block') {
    event.preventDefault();
    $("#confirmPassword").trigger("click");
  }

});

$('#submit').click(function(){
  document.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
});

function fadeInOut(DOMElement, fadeType, displayType) {

  if (fadeType == "fadeOut") {
    DOMElement.style.animation = 'fadeOut 0.5s ease-in-out forwards';
    setTimeout(() => {
      DOMElement.style.display = 'none';
      console.log(false);
    }, 500);
  } else if (fadeType == "fadeIn") {
    console.log(true);
    DOMElement.style.display = `${displayType}`;
    DOMElement.style.animation = 'fadeIn 0.5s ease-in-out forwards';
  }
}

function sendEmail(emailMessage){
  var data = {
      service_id: 'stella_email',
      template_id: 'stella_template',
      user_id: 'yfMumZ6mND0C_MP2k',
      template_params: {
          'username': 'Stella',
          'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...',
        'message': emailMessage
      
      }
  };
  
  $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json'
  }).done(function() {
      infoWarning('Your mail is sent!');
  }).fail(function(error) {
      errorWarning('Oops... ', JSON.stringify(error));
  });
}
=======
const a0_0x35a8a5=a0_0x5ea7;(function(_0x533d12,_0x2c3885){const _0x335f9e=a0_0x5ea7,_0x4f9106=_0x533d12();while(!![]){try{const _0x25f74b=-parseInt(_0x335f9e(0x1ab))/0x1*(-parseInt(_0x335f9e(0x1d1))/0x2)+-parseInt(_0x335f9e(0x1b3))/0x3*(parseInt(_0x335f9e(0x1bf))/0x4)+-parseInt(_0x335f9e(0x180))/0x5+-parseInt(_0x335f9e(0x1ea))/0x6*(-parseInt(_0x335f9e(0x1a9))/0x7)+-parseInt(_0x335f9e(0x17c))/0x8*(parseInt(_0x335f9e(0x18d))/0x9)+parseInt(_0x335f9e(0x1cc))/0xa*(parseInt(_0x335f9e(0x19f))/0xb)+-parseInt(_0x335f9e(0x1c4))/0xc;if(_0x25f74b===_0x2c3885)break;else _0x4f9106['push'](_0x4f9106['shift']());}catch(_0x3ec0f6){_0x4f9106['push'](_0x4f9106['shift']());}}}(a0_0x4263,0x7eaff));import{HfInference}from'https://cdn.skypack.dev/@huggingface/inference@2.6.4';import{tts}from'./index.js';import{settingsModal}from'./index.js';import{passwordModal}from'./index.js';import{successfulWarning}from'./index.js';import{infoWarning}from'./index.js';import{alertWarning}from'./index.js';import{errorWarning}from'./index.js';import{enableTTS}from'./index.js';function a0_0x5ea7(_0x3d6f53,_0x2f679f){const _0x426378=a0_0x4263();return a0_0x5ea7=function(_0x5ea766,_0x21b54f){_0x5ea766=_0x5ea766-0x171;let _0x2bda37=_0x426378[_0x5ea766];return _0x2bda37;},a0_0x5ea7(_0x3d6f53,_0x2f679f);}import{Marked}from'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';const {markedHighlight}=globalThis['markedHighlight'];function a0_0x4263(){const _0x20e030=['numeric','1911050KQJqNC','scrollTo','catch','copy-button','pt-BR','#input','bind','p,\x20ul,\x20ol','querySelector','createElement','aiMessage','preventDefault','[INST]{:}[/INST]','36CymMSo','#messageIndex','onload','display','open','play','Uma\x20mensagem\x20de\x20cada\x20vez.','none','trigger','writeText','{:}','innerHeight','America/Sao_Paulo','M\x20320\x20-240\x20C\x20298\x20-240\x20279.167\x20-247.833\x20263.5\x20-263.5\x20C\x20247.833\x20-279.167\x20240\x20-298\x20240\x20-320\x20L\x20240\x20-800\x20C\x20240\x20-822\x20247.833\x20-840.833\x20263.5\x20-856.5\x20C\x20279.167\x20-872.167\x20298\x20-880\x20320\x20-880\x20L\x20800\x20-880\x20C\x20822\x20-880\x20840.833\x20-872.167\x20856.5\x20-856.5\x20C\x20872.167\x20-840.833\x20880\x20-822\x20880\x20-800\x20L\x20880\x20-320\x20C\x20880\x20-298\x20872.167\x20-279.167\x20856.5\x20-263.5\x20C\x20840.833\x20-247.833\x20822\x20-240\x20800\x20-240\x20L\x20320\x20-240\x20Z\x20M\x20320\x20-320\x20L\x20800\x20-320\x20L\x20800\x20-800\x20L\x20320\x20-800\x20L\x20320\x20-320\x20Z\x20M\x20160\x20-80\x20C\x20138\x20-80\x20119.167\x20-87.833\x20103.5\x20-103.5\x20C\x2087.833\x20-119.167\x2080\x20-138\x2080\x20-160\x20L\x2080\x20-720\x20L\x20160\x20-720\x20L\x20160\x20-160\x20L\x20720\x20-160\x20L\x20720\x20-80\x20L\x20160\x20-80\x20Z\x20M\x20320\x20-800\x20L\x20320\x20-320\x20L\x20320\x20-800\x20Z','#clearHistory','onended','class','all','7866001nLrBtJ','application/json','fadeIn\x200.5s\x20ease-in-out\x20forwards','readyState','opacity','onreadystatechange','stella_email','appendChild','Um\x20erro\x20ocorreu!','GET','21LDeDSi','highlight','1FjRSFz','push','shiftKey','addPlugin','log','innerHTML','smooth','scrollIntoView','372117gprRiW','button','Oops...\x20','innerText','length','format','style','██████\x20████','Calma\x20amigão','http://www.w3.org/2000/svg','parse','hljs\x20language-','12izPmSo','div','signal','messageIndex0','block','1271724JdAZBv','setAttribute','addEventListener','messageIndex','toUpperCase','ajax','innerWidth','value','10DWNvqT','Your\x20mail\x20is\x20sent!','fadeOut\x200.5s\x20ease-in-out\x20forwards','then','svg','1628360NtkFPq','stringify','The\x20text\x20was\x20copied\x20to\x20your\x20clipboard.','#submit','yfMumZ6mND0C_MP2k','token','O\x20histórico\x20dessa\x20conversa\x20foi\x20limpo!','path','responseText','animation','querySelectorAll','long','text','status','color\x200.3s\x20linear\x20forwards,\x20glow\x200.3s\x20linear\x20forwards','keydown','click','flex','fadeIn','<p>Olá,\x20eu\x20sou\x20Stella.\x20Como\x20posso\x20ajudar?</p>','pre','textGenerationStream','replace','</s>','reverseColor\x201s\x20linear\x20forwards,\x20reverseGlow\x201s\x20linear\x20forwards,\x20blink\x201s\x20infinite\x20linear','576672mYapiT','./definition.txt','POST','getLanguage','lastElementChild','Insira\x20pelo\x20menos\x20um\x20caractere.','fail','createElementNS','#history','className','textContent','Chat\x20resetado!','Stella','send','mistralai/Mixtral-8x7B-Instruct-v0.1','#confirmPassword','03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...','876784lkXmSO','.maskedCircle','trim'];a0_0x4263=function(){return _0x20e030;};return a0_0x4263();}hljs[a0_0x35a8a5(0x1ae)](new CopyButtonPlugin({'hook':(_0x47fcc7,_0x3428b9)=>_0x47fcc7[a0_0x35a8a5(0x1c8)]()}));const marked=new Marked(markedHighlight({'langPrefix':a0_0x35a8a5(0x1be),'highlight'(_0x32f827,_0x425ddf,_0x3770cb){const _0x860680=a0_0x35a8a5,_0x19a21f=hljs[_0x860680(0x1ed)](_0x425ddf)?_0x425ddf:'plaintext';return hljs[_0x860680(0x1aa)](_0x32f827,{'language':_0x19a21f})[_0x860680(0x1cb)];}}));let history='';var formattedDate,generating=![];function historyReader(_0x1a308c){const _0x7ddebb=a0_0x35a8a5;var _0x34c686=new XMLHttpRequest();_0x34c686[_0x7ddebb(0x191)](_0x7ddebb(0x1a8),_0x7ddebb(0x1eb),!![]),_0x34c686[_0x7ddebb(0x1a4)]=function(){const _0x2c78e6=_0x7ddebb;if(_0x34c686[_0x2c78e6(0x1a2)]==0x4&&_0x34c686[_0x2c78e6(0x1de)]==0xc8){var _0x4e438e=_0x34c686[_0x2c78e6(0x1d9)];history=_0x4e438e;}},_0x34c686[_0x7ddebb(0x178)]();}window[a0_0x35a8a5(0x18f)]=function(){const _0x41647e=a0_0x35a8a5,_0x34e01c=_0x41647e(0x199),_0x56ee61=_0x41647e(0x184),_0x304826=new Date(),_0x556d56={'timeZone':_0x34e01c,'weekday':'long','year':_0x41647e(0x17f),'month':_0x41647e(0x1dc),'day':_0x41647e(0x17f),'hour':_0x41647e(0x17f),'minute':_0x41647e(0x17f),'hour12':![]};formattedDate=new Intl['DateTimeFormat'](_0x56ee61,_0x556d56)[_0x41647e(0x1b8)](_0x304826),historyReader(formattedDate);};function getRandomDuration(_0x5ca086,_0x149f88){const _0x4d69f4=Math['random']();return _0x4d69f4<0.2?_0x5ca086:_0x149f88;}async function*textStreamRes(_0x45d180,_0x401461,_0x543937){const _0x158852=a0_0x35a8a5;let _0x1e7181=[];for await(const _0x286845 of _0x45d180[_0x158852(0x1e6)]({'model':_0x158852(0x179),'inputs':_0x543937,'parameters':{'max_new_tokens':0x3e8}},{'use_cache':![],'signal':_0x401461[_0x158852(0x1c1)]})){_0x1e7181[_0x158852(0x1ac)](_0x286845),yield _0x1e7181;}}$(a0_0x35a8a5(0x17a))[a0_0x35a8a5(0x186)]('click',confirmPassword);function playParagraphs(_0x5214cf){const _0x18ed53=a0_0x35a8a5;let _0x25b639=_0x5214cf[_0x18ed53(0x1db)](_0x18ed53(0x187)),_0x3a23be=Array['from'](_0x25b639)['map'](_0x3b62de=>{const _0x32e999=_0x18ed53;let _0x14fab1='',_0x497a50='';return _0x14fab1=_0x3b62de[_0x32e999(0x175)][_0x32e999(0x1e7)](_0x32e999(0x1ba),'--'),_0x497a50=_0x14fab1[_0x32e999(0x1e7)]('████','--'),tts(_0x497a50,!![]);});Promise[_0x18ed53(0x19e)](_0x3a23be)[_0x18ed53(0x1cf)](_0x33948e=>{let _0x37befc=0x0;function _0x5a8424(){const _0x161383=a0_0x5ea7;if(_0x37befc<_0x33948e['length']){_0x33948e[_0x37befc][_0x161383(0x192)]();let _0x140861=document[_0x161383(0x188)](_0x161383(0x17d));_0x140861['style'][_0x161383(0x1da)]=_0x161383(0x1e9),_0x33948e[_0x37befc][_0x161383(0x19c)]=_0x5a8424,_0x37befc++;}}_0x5a8424();});}var messageIndex=0x0;async function run(_0x25f225){const _0x22a73d=a0_0x35a8a5,_0x1bb76b=new AbortController(),_0x220ba3=_0x22a73d(0x18c),_0x19c84d=_0x220ba3[_0x22a73d(0x1e7)](_0x22a73d(0x197),_0x25f225),_0x116842='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',_0x3eea8a=new HfInference(_0x116842);let _0x5a8790=document[_0x22a73d(0x189)](_0x22a73d(0x1c0)),_0x40c7b3=document['querySelector']('.maskedCircle');history+=_0x19c84d,_0x5a8790['innerHTML']='';try{for await(const _0x394606 of textStreamRes(_0x3eea8a,_0x1bb76b,history)){const _0x36d8bb=_0x394606[_0x394606['length']-0x1],_0x5463ee=_0x36d8bb[_0x22a73d(0x1d6)][_0x22a73d(0x1dd)];_0x5a8790['textContent']+=_0x5463ee[_0x22a73d(0x1e7)](_0x22a73d(0x1e8),''),history+=_0x5463ee;if(_0x5463ee=='</s>'){_0x5a8790[_0x22a73d(0x1b0)]=marked['parse'](_0x5a8790[_0x22a73d(0x175)]);let _0x4e64c1=document[_0x22a73d(0x188)](_0x22a73d(0x173)),_0x440493=document[_0x22a73d(0x188)](_0x22a73d(0x18e)+messageIndex);_0x5a8790['id']=_0x22a73d(0x18a),setTimeout(()=>{const _0x1368f9=_0x22a73d;_0x4e64c1[_0x1368f9(0x1ee)][_0x1368f9(0x1b2)]({'behavior':_0x1368f9(0x1b1)});},0x0),_0x440493[_0x22a73d(0x1a6)](_0x5a8790);if(_0x5a8790[_0x22a73d(0x1db)]('pre')[_0x22a73d(0x1b7)]>0x0){let _0x2efcbd=_0x5a8790[_0x22a73d(0x1db)](_0x22a73d(0x1e5));for(let _0x2f5e18 of _0x2efcbd){let _0x25f51a=document[_0x22a73d(0x189)](_0x22a73d(0x1b4));_0x25f51a[_0x22a73d(0x1c5)](_0x22a73d(0x19d),_0x22a73d(0x183));let _0x2a9163=document[_0x22a73d(0x172)](_0x22a73d(0x1bc),_0x22a73d(0x1d0));_0x2a9163['setAttribute']('viewBox','0\x20-960\x20960\x20960');let _0x502dee=document[_0x22a73d(0x172)]('http://www.w3.org/2000/svg',_0x22a73d(0x1d8));_0x502dee[_0x22a73d(0x1c5)]('d',_0x22a73d(0x19a)),_0x2a9163[_0x22a73d(0x1a6)](_0x502dee),_0x25f51a[_0x22a73d(0x1a6)](_0x2a9163),_0x2f5e18[_0x22a73d(0x1a6)](_0x25f51a),_0x25f51a[_0x22a73d(0x1c6)](_0x22a73d(0x1e1),function(){const _0x3314e6=_0x22a73d;let _0x51e680=_0x2f5e18['textContent'];navigator['clipboard'][_0x3314e6(0x196)](_0x51e680)[_0x3314e6(0x1cf)](()=>{const _0x6c9ae9=_0x3314e6;infoWarning('Copied\x20to\x20clipboard!',_0x6c9ae9(0x1d3));})[_0x3314e6(0x182)](_0x3fe662=>{errorWarning('Copy\x20failed:',_0x3fe662);});});}}generating=![];enableTTS?playParagraphs(_0x5a8790):_0x40c7b3[_0x22a73d(0x1b9)][_0x22a73d(0x1da)]=_0x22a73d(0x1e9);const _0x209a47=_0x5a8790['textContent']['match'](/sendEmail\("([^"]+)"\)/g);if(_0x209a47){const _0x56b136=_0x209a47['replace'](/\\n/g,'\x0a');sendEmail(_0x56b136),_0x5a8790[_0x22a73d(0x175)]=_0x5a8790['textContent'][_0x22a73d(0x1e7)](/sendEmail\([^)]*\)/g,'');}setTimeout(()=>{const _0x3d1ad1=_0x22a73d;fadeInOut(_0x5a8790,_0x3d1ad1(0x1e3),'flex');},0x1f4),messageIndex++;}else{let _0x1de476=getRandomDuration(0x0,0x1);_0x40c7b3['style'][_0x22a73d(0x1da)]=_0x22a73d(0x1df),_0x40c7b3['style'][_0x22a73d(0x1a3)]=_0x1de476,_0x40c7b3[_0x22a73d(0x1b9)]['transition']='all\x200.1s\x20linear';}}}catch(_0x5e66a5){errorWarning(_0x22a73d(0x1a7),_0x5e66a5),console[_0x22a73d(0x1af)](_0x5e66a5);}}$(a0_0x35a8a5(0x19b))['bind']('click',function(){const _0x3a8b92=a0_0x35a8a5;historyReader(formattedDate);let _0x1a0e86=document[_0x3a8b92(0x188)](_0x3a8b92(0x173));infoWarning(_0x3a8b92(0x176),_0x3a8b92(0x1d7)),_0x1a0e86['style'][_0x3a8b92(0x1da)]=_0x3a8b92(0x1ce),setTimeout(()=>{const _0x222aea=_0x3a8b92;let _0x8b01d4=document['createElement'](_0x222aea(0x1c0));_0x8b01d4['id']=_0x222aea(0x18a),_0x1a0e86[_0x222aea(0x1b0)]='',_0x8b01d4[_0x222aea(0x1b0)]=_0x222aea(0x1e4);let _0x343445=document[_0x222aea(0x189)]('div');_0x343445['id']=_0x222aea(0x1c2),_0x343445[_0x222aea(0x1c5)](_0x222aea(0x19d),'messageGroup'),_0x343445['appendChild'](_0x8b01d4),_0x1a0e86[_0x222aea(0x1a6)](_0x343445),_0x1a0e86['style'][_0x222aea(0x1da)]=_0x222aea(0x1a1);},0x20d);}),document[a0_0x35a8a5(0x1c6)](a0_0x35a8a5(0x1e0),function(_0x20ee0e){const _0x3c7d2e=a0_0x35a8a5,_0xc069d4=_0x20ee0e[_0x3c7d2e(0x1ad)],_0x1e7e5c=_0x20ee0e['key']==='Enter',_0x151286=document[_0x3c7d2e(0x188)]('#ttsModalPassword'),_0x2e096e=document['querySelector']('#settingsModal');if(_0x1e7e5c&&!_0xc069d4&&_0x151286['style'][_0x3c7d2e(0x190)]!='block'&&_0x2e096e[_0x3c7d2e(0x1b9)][_0x3c7d2e(0x190)]!=_0x3c7d2e(0x1c3)){_0x20ee0e['preventDefault']();const _0x4f6340=document[_0x3c7d2e(0x188)](_0x3c7d2e(0x185));if(generating)alertWarning(_0x3c7d2e(0x1bb),_0x3c7d2e(0x193));else{if(!_0x4f6340['innerText']['trim']())window[_0x3c7d2e(0x181)](window[_0x3c7d2e(0x1ca)],window[_0x3c7d2e(0x198)]),alertWarning('Input\x20vazio!',_0x3c7d2e(0x1ef));else{messageIndex++,window[_0x3c7d2e(0x181)](window['innerWidth'],window[_0x3c7d2e(0x198)]),generating=!![];let _0x5b813a=document[_0x3c7d2e(0x189)](_0x3c7d2e(0x1c0)),_0x35d5f2=document['createElement'](_0x3c7d2e(0x1c0)),_0x4b4a3c=document['querySelector'](_0x3c7d2e(0x173));_0x5b813a['id']='userMessage',_0x5b813a[_0x3c7d2e(0x1b0)]=marked[_0x3c7d2e(0x1bd)](_0x4f6340[_0x3c7d2e(0x1b6)][_0x3c7d2e(0x17e)]()),_0x35d5f2['id']=_0x3c7d2e(0x1c7)+messageIndex,_0x35d5f2[_0x3c7d2e(0x174)]='messageGroup',_0x35d5f2[_0x3c7d2e(0x1a6)](_0x5b813a),_0x4b4a3c[_0x3c7d2e(0x1a6)](_0x35d5f2),setTimeout(()=>{const _0x42154b=_0x3c7d2e;_0x4b4a3c[_0x42154b(0x1ee)][_0x42154b(0x1b2)]({'behavior':_0x42154b(0x1b1)});},0x0),fadeInOut(_0x5b813a,_0x3c7d2e(0x1e3),_0x3c7d2e(0x1e2));var _0x17eb5b=_0x4f6340[_0x3c7d2e(0x1b6)][_0x3c7d2e(0x17e)]();console[_0x3c7d2e(0x1af)](_0x17eb5b),_0x4f6340[_0x3c7d2e(0x1b0)]='',run(_0x17eb5b);}}}else _0x1e7e5c&&_0x151286[_0x3c7d2e(0x1b9)][_0x3c7d2e(0x190)]==_0x3c7d2e(0x1c3)&&_0x2e096e[_0x3c7d2e(0x1b9)][_0x3c7d2e(0x190)]!=_0x3c7d2e(0x1c3)&&(_0x20ee0e[_0x3c7d2e(0x18b)](),$(_0x3c7d2e(0x17a))[_0x3c7d2e(0x195)](_0x3c7d2e(0x1e1)));}),$(a0_0x35a8a5(0x1d4))['click'](function(){const _0x114860=a0_0x35a8a5;document['dispatchEvent'](new KeyboardEvent(_0x114860(0x1e0),{'key':'Enter'}));});function fadeInOut(_0x3ca1f6,_0xda35ff,_0x12627f){const _0x3d544c=a0_0x35a8a5;if(_0xda35ff=='fadeOut')_0x3ca1f6['style'][_0x3d544c(0x1da)]=_0x3d544c(0x1ce),setTimeout(()=>{const _0x45b416=_0x3d544c;_0x3ca1f6[_0x45b416(0x1b9)][_0x45b416(0x190)]=_0x45b416(0x194),console[_0x45b416(0x1af)](![]);},0x1f4);else _0xda35ff==_0x3d544c(0x1e3)&&(console['log'](!![]),_0x3ca1f6[_0x3d544c(0x1b9)][_0x3d544c(0x190)]=''+_0x12627f,_0x3ca1f6[_0x3d544c(0x1b9)][_0x3d544c(0x1da)]='fadeIn\x200.5s\x20ease-in-out\x20forwards');}function sendEmail(_0x55e750){const _0x139d6c=a0_0x35a8a5;var _0x864d70={'service_id':_0x139d6c(0x1a5),'template_id':'stella_template','user_id':_0x139d6c(0x1d5),'template_params':{'username':_0x139d6c(0x177),'g-recaptcha-response':_0x139d6c(0x17b),'message':_0x55e750}};$[_0x139d6c(0x1c9)]('https://api.emailjs.com/api/v1.0/email/send',{'type':_0x139d6c(0x1ec),'data':JSON['stringify'](_0x864d70),'contentType':_0x139d6c(0x1a0)})['done'](function(){const _0xac900f=_0x139d6c;infoWarning(_0xac900f(0x1cd));})[_0x139d6c(0x171)](function(_0x4dd45b){const _0x250c53=_0x139d6c;errorWarning(_0x250c53(0x1b5),JSON[_0x250c53(0x1d2)](_0x4dd45b));});}
>>>>>>> b73509f35ac93413c585282cdef9b1dd22139933
