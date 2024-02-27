import { HfInference } from "https://cdn.skypack.dev/@huggingface/inference@2.6.4";
import { tts } from "./index.js";
import { settingsModal } from "./index.js";
import { passwordModal } from "./index.js";
import { successfulWarning } from "./index.js";
import { infoWarning } from "./index.js";
import { alertWarning } from "./index.js";
import { errorWarning } from "./index.js";
import { enableTTS } from "./index.js";

import { Marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const { markedHighlight } = globalThis.markedHighlight;
hljs.addPlugin(
  new CopyButtonPlugin({
    hook: (text, el) => text.toUpperCase(),
  })
);

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

let history = "";
var formattedDate;
var generating = false;

// A function that requests a file from the server and logs its contents
function historyReader(date) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "./definition.txt", true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var fileContent = xhr.responseText;
      history = fileContent;
    }
  };

  xhr.send();
}
window.onload = function () {
  const timeZone = "America/Sao_Paulo"; // 'America/Sao_Paulo' corresponds to GMT-3
  const locale = "pt-BR";

  const currentDate = new Date();
  const options = {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  formattedDate = new Intl.DateTimeFormat(locale, options).format(currentDate);

  historyReader(formattedDate);
};

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
      parameters: { max_new_tokens: 2048 },
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

$("#confirmPassword").bind("click", function () {
  confirmPassword(document.querySelector("#ttsPassword").value);
});

function playParagraphs(element) {
  let elements = element.querySelectorAll("p, ul, ol");
  let audios = Array.from(elements).map((element) => {
    let text = "";
    let text2 = "";
    text = element.textContent.replace("██████ ████", "--");
    text2 = text.replace("████", "--");
    return tts(text2, true, "@Rafafa2105");
  });

  Promise.all(audios).then((audios) => {
    let i = 0;
    function playNextAudio() {
      if (i < audios.length) {
        audios[i].play();
        let loadingCircle = document.querySelector(".maskedCircle");
        loadingCircle.style.animation =
          "reverseColor 1s linear forwards, reverseGlow 1s linear forwards, blink 1s infinite linear";
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
  const token = "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";
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
        let historyMessageGroup = document.querySelector(
          "#messageIndex" + messageIndex
        );
        let aiProfileElement = document.createElement("div");
        let userProfileElement = document.createElement("div");

        gen.id = "aiMessage";

        setTimeout(() => {
          historyElement.lastElementChild.scrollIntoView({
            behavior: "smooth",
          });
        }, 0);

        aiProfileElement.id = 'aiProfile';
        historyMessageGroup.appendChild(gen);
        historyMessageGroup.appendChild(aiProfileElement);

        if(gen.textContent.includes("END_OF_DIALOG")){
          gen.textContent = gen.textContent.replace("END_OF_DIALOG","");
        }

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
            let svg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            // set the SVG attributes
            svg.setAttribute("viewBox", "0 -960 960 960");
            // create a path element with the SVG namespace
            let path = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            // set the path attributes
            path.setAttribute(
              "d",
              "M 320 -240 C 298 -240 279.167 -247.833 263.5 -263.5 C 247.833 -279.167 240 -298 240 -320 L 240 -800 C 240 -822 247.833 -840.833 263.5 -856.5 C 279.167 -872.167 298 -880 320 -880 L 800 -880 C 822 -880 840.833 -872.167 856.5 -856.5 C 872.167 -840.833 880 -822 880 -800 L 880 -320 C 880 -298 872.167 -279.167 856.5 -263.5 C 840.833 -247.833 822 -240 800 -240 L 320 -240 Z M 320 -320 L 800 -320 L 800 -800 L 320 -800 L 320 -320 Z M 160 -80 C 138 -80 119.167 -87.833 103.5 -103.5 C 87.833 -119.167 80 -138 80 -160 L 80 -720 L 160 -720 L 160 -160 L 720 -160 L 720 -80 L 160 -80 Z M 320 -800 L 320 -320 L 320 -800 Z"
            );
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
              navigator.clipboard
                .writeText(text)
                .then(() => {
                  // show a success message
                  infoWarning(
                    "Copiado!",
                    "O texto foi copiado para sua área de transferência."
                  );
                })
                .catch((error) => {
                  // show an error message
                  errorWarning("A cópia falhou:", error);
                });
            });
          }
        }

        generating = false;

        // TTS part
        if (enableTTS) {
          playParagraphs(gen);
        } else {
          loadingCircle.style.animation =
            "reverseColor 1s linear forwards, reverseGlow 1s linear forwards, blink 1s infinite linear";
        }

        // Extract the email content using a regular expression
        const emailContentRegex = /sendEmail\("([^"]+)"\)/g;
        const emailContentMatches = gen.textContent.match(emailContentRegex);
        
        console.log(emailContentMatches);
        
        // Check if there are matches
        if (emailContentMatches) {
          // Extract content between quotes and replace any occurrences of '\n' with actual line breaks
          const formattedEmailContent = emailContentMatches.map(match => match.match(/sendEmail\("([^"]+)"\)/)[1].replace(/\\n/g, "\n"));
          console.log(formattedEmailContent);
        
          // Agora você pode fazer o que quiser com o conteúdo extraído
          sendEmail(formattedEmailContent);
        
          // Se você quiser remover as chamadas de sendEmail do texto original
          gen.textContent = gen.textContent.replace(emailContentRegex, "");
        }

        setTimeout(() => {
          fadeInOut(gen, "fadeIn", "flex");
        }, 500);

        messageIndex++;
      } else if (lastTokenFormated.includes("{{user}}") || lastTokenFormated.includes("END_OF_DIALOG")) {
        gen.innerHTML = marked.parse(gen.textContent);
        let historyElement = document.querySelector("#history");
        let historyMessageGroup = document.querySelector(
          "#messageIndex" + messageIndex
        );
        let aiProfileElement = document.createElement("div");
        let userProfileElement = document.createElement("div");

        gen.id = "aiMessage";

        setTimeout(() => {
          historyElement.lastElementChild.scrollIntoView({
            behavior: "smooth",
          });
        }, 0);

        aiProfileElement.id = 'aiProfile';
        historyMessageGroup.appendChild(gen);
        historyMessageGroup.appendChild(aiProfileElement);

        if(gen.textContent.includes("END_OF_DIALOG")){
          gen.textContent = gen.textContent.replace("END_OF_DIALOG","");
        }

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
            let svg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            // set the SVG attributes
            svg.setAttribute("viewBox", "0 -960 960 960");
            // create a path element with the SVG namespace
            let path = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            // set the path attributes
            path.setAttribute(
              "d",
              "M 320 -240 C 298 -240 279.167 -247.833 263.5 -263.5 C 247.833 -279.167 240 -298 240 -320 L 240 -800 C 240 -822 247.833 -840.833 263.5 -856.5 C 279.167 -872.167 298 -880 320 -880 L 800 -880 C 822 -880 840.833 -872.167 856.5 -856.5 C 872.167 -840.833 880 -822 880 -800 L 880 -320 C 880 -298 872.167 -279.167 856.5 -263.5 C 840.833 -247.833 822 -240 800 -240 L 320 -240 Z M 320 -320 L 800 -320 L 800 -800 L 320 -800 L 320 -320 Z M 160 -80 C 138 -80 119.167 -87.833 103.5 -103.5 C 87.833 -119.167 80 -138 80 -160 L 80 -720 L 160 -720 L 160 -160 L 720 -160 L 720 -80 L 160 -80 Z M 320 -800 L 320 -320 L 320 -800 Z"
            );
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
              navigator.clipboard
                .writeText(text)
                .then(() => {
                  // show a success message
                  infoWarning(
                    "Copiado!",
                    "O texto foi copiado para sua área de transferência."
                  );
                })
                .catch((error) => {
                  // show an error message
                  errorWarning("A cópia falhou:", error);
                });
            });
          }
        }

        generating = false;

        // TTS part
        if (enableTTS) {
          playParagraphs(gen);
        } else {
          loadingCircle.style.animation =
            "reverseColor 1s linear forwards, reverseGlow 1s linear forwards, blink 1s infinite linear";
        }

        // Extract the email content using a regular expression
        const emailContentRegex = /sendEmail\("([^"]+)"\)/g;
        const emailContentMatches = gen.textContent.match(emailContentRegex);
        
        console.log(emailContentMatches);
        
        // Check if there are matches
        if (emailContentMatches) {
          // Extract content between quotes and replace any occurrences of '\n' with actual line breaks
          const formattedEmailContent = emailContentMatches.map(match => match.match(/sendEmail\("([^"]+)"\)/)[1].replace(/\\n/g, "\n"));
          console.log(formattedEmailContent);
        
          // Agora você pode fazer o que quiser com o conteúdo extraído
          // sendEmail(formattedEmailContent);
        
          // Se você quiser remover as chamadas de sendEmail do texto original
          gen.textContent = gen.textContent.replace(emailContentRegex, "");
        }

        setTimeout(() => {
          fadeInOut(gen, "fadeIn", "flex");
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

$("#clearHistory").bind("click", function () {
  historyReader(formattedDate);
  let historyElement = document.querySelector("#history");
  infoWarning("Chat resetado!", "O histórico dessa conversa foi limpo!");
  historyElement.style.animation = "fadeOut 0.5s ease-in-out forwards";
  setTimeout(() => {
    $('#history div').not('#messageIndex0, #messageIndex0 *').remove();
    historyElement.style.animation = "fadeIn 0.5s ease-in-out forwards";
  }, 525);
});

document.addEventListener("keydown", function (event) {
  const isShiftPressed = event.shiftKey;
  const isEnterPressed = event.key === "Enter";
  const passwordModalElement = document.querySelector("#ttsModalPassword");
  const settingsModalElement = document.querySelector("#settingsModal");

  if (
    isEnterPressed &&
    !isShiftPressed &&
    passwordModalElement.style.display != "block" &&
    settingsModalElement.style.display != "block"
  ) {
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
      let userProfileElement = document.createElement("div");
      let historyElement = document.querySelector("#history");

      userProfileElement.id = "userProfile";
      userMessageElement.id = "userMessage";
      userMessageElement.innerHTML = marked.parse(
        inputElement.innerText.trim()
      );

      historyMessageGroup.id = "messageIndex" + messageIndex;
      historyMessageGroup.className = "messageGroup";

      historyMessageGroup.appendChild(userMessageElement);
      historyMessageGroup.appendChild(userProfileElement);
      historyElement.appendChild(historyMessageGroup);
      setTimeout(() => {
        historyElement.lastElementChild.scrollIntoView({ behavior: "smooth" });
      }, 0);

      fadeInOut(userMessageElement, "fadeIn", "flex");

      var inputValue = inputElement.innerText.trim();
      console.log(inputValue);

      inputElement.innerHTML = "";
      run(inputValue);
    }
  } else if (
    isEnterPressed &&
    passwordModalElement.style.display == "block" &&
    settingsModalElement.style.display != "block"
  ) {
    event.preventDefault();
    $("#confirmPassword").trigger("click");
  }
});

function fadeInOut(DOMElement, fadeType, displayType) {
  if (fadeType == "fadeOut") {
    DOMElement.style.animation = "fadeOut 0.5s ease-in-out forwards";
    setTimeout(() => {
      DOMElement.style.display = "none";
      console.log(false);
    }, 500);
  } else if (fadeType == "fadeIn") {
    console.log(true);
    DOMElement.style.display = `${displayType}`;
    DOMElement.style.animation = "fadeIn 0.5s ease-in-out forwards";
  }
}

function sendEmail(emailMessage) {
  var data = {
    service_id: "stella_email",
    template_id: "stella_template",
    user_id: "yfMumZ6mND0C_MP2k",
    template_params: {
      username: "Stella",
      "g-recaptcha-response": "03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...",
      message: emailMessage,
    },
  };

  $.ajax("https://api.emailjs.com/api/v1.0/email/send", {
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
  })
    .done(function () {
      infoWarning("Seu email foi enviado!", "Um email foi enviado para o criador de Stella, Stoltz.");
    })
    .fail(function (error) {
      errorWarning("Oops... ", JSON.stringify(error));
    });
}
