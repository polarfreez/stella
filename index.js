<<<<<<< HEAD
export let enableTTS = false;

// Marked
window.onload = function(){
  const chat_message = document.querySelector("#message");
  chat_message.innerHTML = marked.parse(chat_message.textContent);

  let historyMessageGroup = document.createElement("div");
  let historyElement = document.querySelector("#history");

  historyMessageGroup.id = 'messageIndex0';
  historyMessageGroup.className = 'messageGroup';

  historyElement.appendChild(historyMessageGroup);
}

// Get the hash value without the # character
var hash = window.location.hash.substring(1);

// If the hash value is config, execute the function
if (hash === "config") {
  settingsModal(true);
}

function inputDivDynamic(){
  const inputDiv = document.querySelector("#input");

  // Get all child nodes of inputDiv
  let childNodes = Array.from(inputDiv.childNodes);

  // Filter out text nodes that only contain whitespace and <br> elements
  let nonEmptyNodes = childNodes.filter(node => {
    return !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') && !(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR');
  });

  // If there are no non-empty nodes, clear the inputDiv
  if (nonEmptyNodes.length === 0) {
    inputDiv.innerHTML = '';
  }
}


let allEditableDivs = document.querySelectorAll('div[contenteditable="true"]');

[].forEach.call(allEditableDivs, function (el) {
  el.addEventListener('paste', function(e) {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }, false);
});

$("#input").on("focus", inputDivDynamic);
$("#input").on("blur", inputDivDynamic);

/* Modal */

// Open modal
$(".loading-container").bind("click", function() {
  settingsModal(true);
});

// Close modal
$("#disableTTS").bind("click", function() {
  settingsModal(false);
});


$('.ttsCheckbox').click(function(){
  if(enableTTS && $(this).prop("checked") == false){
      infoWarning("TTS desativado!", "O TTS foi desativado.")
      enableTTS = false;
      $(".ttsCheckbox").prop("checked", false);
  }else  {
    passwordModal(true);
  }
});



$("#confirmPassword").bind("click", function() {
  var passwordConfirm = confirmPassword();
  if(passwordConfirm == true){
    passwordModal(false);
  }
});

$("#closePasswordModal").bind("click", function() {
  passwordModal(false);
});

$("#closeSettingsModal").bind("click", function(){
  settingsModal(false);
  passwordModal(false);
});



export function settingsModal(enable) {
  const modal = document.querySelector("#settingsModal");
  const overlay = document.querySelector('#overlay');
   if (enable){
    window.location.hash = 'config';
    overlay.style.display = 'block';
      modal.style.display = 'block';
      modal.style.animation = 'fadeIn 0.25s ease-in-out forwards';
      // Delaying the animation start to ensure display:block takes effect first
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 260);

      var elementsToEnable = document.querySelectorAll('*:not(#settingsModal, #settingsModal *, #ttsModalPassword, ttsModalPassword *, body, head, html, #overlay, #overlay2)');
      elementsToEnable.forEach(function(element) {
        element.style.pointerEvents = 'none';
        element.style.userSelect = 'none';
      });
  }else {
    remHash();
    overlay.style.display = 'none';
    var elementsToEnable = document.querySelectorAll('*:not(#settingsModal, #settingsModal *, #ttsModalPassword, ttsModalPassword *, body, head, html, #overlay, #overlay2)');
    elementsToEnable.forEach(function(element) {
      element.style.pointerEvents = '';
      element.style.userSelect = '';
    });
    modal.style.animation = 'fadeOut 0.25s ease-in-out forwards';
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.opacity = '0';
    }, 260);
  }
}

export function passwordModal(enable) {
  const modal = document.querySelector("#ttsModalPassword");
  const overlay = document.querySelector("#overlay")
  const overlay2 = document.querySelector("#overlay2");
   if (enable){
    overlay2.style.display = 'block';
    overlay.style.display = 'none';
    modal.style.display = 'block';
    modal.style.animation = 'fadeIn 0.25s ease-in-out forwards';
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 260);

    modal.style.pointerEvents = '';
    modal.style.userSelect = '';

    var elementsToDisable = modal.querySelectorAll('*');
    elementsToDisable.forEach(function (element) {
      element.style.pointerEvents = '';
      element.style.userSelect = '';
    });

    var elementsToDisable = document.querySelectorAll('*:not(#ttsModalPassword, #ttsModalPassword *, body, head, html, #overlay, #overlay2)');
    elementsToDisable.forEach(function(element) {
      element.style.pointerEvents = 'none';
      element.style.userSelect = 'none';
    });


  }else {
    overlay2.style.display = 'none';
    overlay.style.display = 'block';
    var elementsToEnable = document.querySelectorAll('#settingsModal *, #settingsModal');
    elementsToEnable.forEach(function(element) {
      element.style.pointerEvents = '';
      element.style.userSelect = '';
    });

    
    modal.style.animation = 'fadeOut 0.25s ease-in-out forwards';
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.opacity = '0';
    }, 260);
  }
}

function clickOutside(){
  $("#overlay").bind("click", function() {
    settingsModal(false);
  });
  $("#overlay2").bind("click", function() {
    passwordModal(false);
  });
}



clickOutside();

/* TTS */

function setVolume(audioElement){
  $(audioElement).on('timeupdate', function() {				
    var vol = 1,
    interval = 200; // 200ms interval
    if (audioElement.currentTime >= audioElement.duration * 0.99) {
        if (audioElement.volume == 1) {
            var intervalID = setInterval(function() {
	        // Reduce volume by 0.05 as long as it is above 0
	        // This works as long as you start with a multiple of 0.05!
	        if (vol > 0) {
	            vol -= 0.05;
	            // limit to 2 decimal places
                    // also converts to string, works ok
                    audioElement.volume = vol.toFixed(2);
	        } else {
	            // Stop the setInterval when 0 is reached
	            clearInterval(intervalID);
	        }
            }, interval);
        }
    }
});
}


const voiceId = 'CaTHjV84MxieZtIYEDMt';

export function tts(text, enable, password) {
  if (enable){
    const textToSpeech = async (inputText) => {
      const response = await fetch('https://stella-backend.vercel.app/text-to-speech', {
        method: 'POST',
        mode: "no-cors",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({ text: inputText, voice_id: voiceId, password: password })
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      return response.body; // Return the ReadableStream
    };
    
    const generateAudio = async (inputText) => {
      const audioStream = await textToSpeech(inputText);
      const audio = new Audio();
      // create a blob URL from the audio stream
      const blob = await new Response(audioStream).blob();
      const url = URL.createObjectURL(blob);
      // assign the blob URL to the src property
      audio.src = url;
      setVolume(audio);
      
      return audio;
    };

    return generateAudio(text);
  }
}







export function successfulWarning(boldText, text){
    var warning = document.querySelector("#successfulWarning");
    var bold = warning.querySelector("strong");
    var normalText = warning.querySelector(".alert").lastChild;
    var fadeSpeed = 5000;
    normalText.textContent = ' ' + text;
    bold.textContent = boldText;
    warning.style.opacity = '0';
    warning.style.display = 'block';
    warning.style.animation = "fadeIn 0.5s ease-in-out forwards";
    warning.style.opacity = '1';
    $("#closeSuccessfulWarning").bind("click", function() {
      fadeSpeed = 0;
      setTimeout(() => {
        warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
      }, fadeSpeed);
      
    setTimeout(() => {
        warning.style.display = 'none';
      }, fadeSpeed + 400);
    });

    setTimeout(() => {
        warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
      }, fadeSpeed);
      
    setTimeout(() => {
        warning.style.display = 'none';
      }, fadeSpeed + 400);
}

export function infoWarning(boldText, text){
  var warning = document.querySelector("#infoWarning");
  var bold = warning.querySelector("strong");
  var normalText = warning.querySelector(".alert").lastChild;
  var fadeSpeed = 5000;
  normalText.textContent = ' ' + text;
  bold.textContent = boldText;
  warning.style.opacity = '0';
  warning.style.display = 'block';
  warning.style.animation = "fadeIn 0.5s ease-in-out forwards";
  warning.style.opacity = '1';
  $("#closeInfoWarning").bind("click", function() {
    fadeSpeed = 0;
    setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
  });

  setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
}

export function alertWarning(boldText, text){
  var warning = document.querySelector("#alertWarning");
  var bold = warning.querySelector("strong");
  var normalText = warning.querySelector(".alert").lastChild;
  var fadeSpeed = 5000;
  normalText.textContent = ' ' + text;
  bold.textContent = boldText;
  warning.style.opacity = '0';
  warning.style.display = 'block';
  warning.style.animation = "fadeIn 0.5s ease-in-out forwards";
  warning.style.opacity = '1';
  $("#closeAlertWarning").bind("click", function() {
    fadeSpeed = 0;
    setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
  });

  setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
}

export function errorWarning(boldText, text){
  var warning = document.querySelector("#errorWarning");
  var bold = warning.querySelector("strong");
  var normalText = warning.querySelector(".alert").lastChild;
  var fadeSpeed = 5000;
  normalText.textContent = ' ' + text;
  bold.textContent = boldText;
  warning.style.opacity = '0';
  warning.style.display = 'block';
  warning.style.animation = "fadeIn 0.5s ease-in-out forwards";
  warning.style.opacity = '1';
  $("#closeErrorWarning").bind("click", function() {
    fadeSpeed = 0;
    setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
  });

  setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
}

export async function testPassword() {
  const passwordInput = document.getElementById('ttsPassword').value;

  try {
    const response = await fetch('https://stella-backend.vercel.app/test-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: passwordInput }),
    });

    const result = await response.json();

    // Handle the result
    if (result.success) {
      // Password is correct
      console.log('Password is correct');
      // You can use the result variable in your code or assign it to a boolean variable
      const isPasswordCorrect = true;
      console.log('isPasswordCorrect:', isPasswordCorrect);
    } else {
      // Password is incorrect
      console.error('Incorrect password');
      // You can use the result variable in your code or assign it to a boolean variable
      const isPasswordCorrect = false;
      console.log('isPasswordCorrect:', isPasswordCorrect);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export function confirmPassword() {
  const ttsPassword = '@Rafafa2105';
  const passwordInput = document.querySelector("#ttsPassword").value;
  if (passwordInput == ttsPassword){
      enableTTS = true;
      successfulWarning("Senha correta!", "O TTS está ativado agora.");
      $(".ttsCheckbox").prop("checked", true);
      passwordModal(false);
  }else{
      enableTTS = false;
      errorWarning("Senha incorreta!", "Tente novamente.");
      $(".ttsCheckbox").prop("checked", false);
  }
}


jQuery( document).ready(function($){
	var copyid = 0;
	$('pre').each(function(){
		copyid++;
		$(this).attr( 'data-copyid', copyid).wrap( '<div class="pre-wrapper"/>');
		$(this).parent().css( 'margin', $(this).css( 'margin') );
		$('<button class="copy-snippet">Copy</button>').insertAfter( $(this) ).data( 'copytarget',copyid );
	});

	$('body').on( 'click', '.copy-snippet', function(ev){
		ev.preventDefault();

		var $copyButton = $(this);

		$pre = $(document).find('pre[data-copyid=' + $copyButton.data('copytarget' ) + ']');
		if ( $pre.length ) {
			var textArea = document.createElement("textarea");

			// Place in top-left corner of screen regardless of scroll position.
			textArea.style.position = 'fixed';
			textArea.style.top = 0;
			textArea.style.left = 0;

			// Ensure it has a small width and height. Setting to 1px / 1em
			// doesn't work as this gives a negative w/h on some browsers.
			textArea.style.width = '2em';
			textArea.style.height = '2em';
			
			// We don't need padding, reducing the size if it does flash render.
			textArea.style.padding = 0;

			// Clean up any borders.
			textArea.style.border = 'none';
			textArea.style.outline = 'none';
			textArea.style.boxShadow = 'none';

			// Avoid flash of white box if rendered for any reason.
			textArea.style.background = 'transparent';

			//Set value to text to be copied
			textArea.value = $pre.html();

			document.body.appendChild(textArea);
			textArea.select();

			try {
				document.execCommand('copy');
				$copyButton.text( 'Copied').prop('disabled', true);;
			} catch (err) {
				$copyButton.text( 'FAILED: Could not copy').prop('disabled', true);;
			}
			setTimeout(function(){
				$copyButton.text( 'Copy').prop('disabled', false);;
			}, 3000);
		}
	});
});
    
 

window.onhashchange = function(){
  switch(location.hash) {
    case '#config':
      settingsModal(true);
    break;
  }
}

function remHash() {
  var uri = window.location.toString();
  if (uri.indexOf("#") > 0) {
     var clean_uri = uri.substring(0, uri.indexOf("#"));
     window.history.replaceState({}, document.title, clean_uri);
  }
}


=======
var a0_0x2262f6=a0_0x5210;(function(_0x149b04,_0x1d8820){var _0x2d1da8=a0_0x5210,_0x4e3877=_0x149b04();while(!![]){try{var _0x3e3355=parseInt(_0x2d1da8(0xcd))/0x1+parseInt(_0x2d1da8(0x88))/0x2*(-parseInt(_0x2d1da8(0x98))/0x3)+parseInt(_0x2d1da8(0xad))/0x4+parseInt(_0x2d1da8(0x97))/0x5+-parseInt(_0x2d1da8(0xe5))/0x6+parseInt(_0x2d1da8(0xbb))/0x7*(parseInt(_0x2d1da8(0x90))/0x8)+-parseInt(_0x2d1da8(0xd8))/0x9;if(_0x3e3355===_0x1d8820)break;else _0x4e3877['push'](_0x4e3877['shift']());}catch(_0x5b01eb){_0x4e3877['push'](_0x4e3877['shift']());}}}(a0_0x570f,0x4898c));export let enableTTS=![];function a0_0x5210(_0x3cf65e,_0x301104){var _0x570f48=a0_0x570f();return a0_0x5210=function(_0x5210df,_0x142f60){_0x5210df=_0x5210df-0x7a;var _0x2607d1=_0x570f48[_0x5210df];return _0x2607d1;},a0_0x5210(_0x3cf65e,_0x301104);}window['onload']=function(){var _0x22ec01=a0_0x5210;const _0x1ad885=document[_0x22ec01(0xc6)](_0x22ec01(0xa4));_0x1ad885[_0x22ec01(0xf0)]=marked['parse'](_0x1ad885[_0x22ec01(0xb1)]);let _0x35cc6f=document[_0x22ec01(0xa5)](_0x22ec01(0xc3)),_0x42c618=document[_0x22ec01(0xc6)](_0x22ec01(0xea));_0x35cc6f['id']='messageIndex0',_0x35cc6f[_0x22ec01(0xe9)]=_0x22ec01(0xbd),_0x42c618[_0x22ec01(0xbe)](_0x35cc6f);};var hash=window[a0_0x2262f6(0xec)][a0_0x2262f6(0xc8)]['substring'](0x1);hash==='config'&&settingsModal(!![]);function inputDivDynamic(){var _0x127465=a0_0x2262f6;const _0x3b09bd=document[_0x127465(0xc6)]('#input');let _0x56f6fd=Array['from'](_0x3b09bd[_0x127465(0x9f)]),_0x3abfa4=_0x56f6fd[_0x127465(0xe3)](_0x18b6a4=>{var _0xa55288=_0x127465;return!(_0x18b6a4[_0xa55288(0x8e)]===Node['TEXT_NODE']&&_0x18b6a4[_0xa55288(0xb1)][_0xa55288(0xb2)]()==='')&&!(_0x18b6a4['nodeType']===Node[_0xa55288(0xba)]&&_0x18b6a4[_0xa55288(0xde)]==='BR');});_0x3abfa4['length']===0x0&&(_0x3b09bd[_0x127465(0xf0)]='');}let allEditableDivs=document[a0_0x2262f6(0xfb)](a0_0x2262f6(0x93));[][a0_0x2262f6(0xef)][a0_0x2262f6(0xf8)](allEditableDivs,function(_0x587bac){var _0xcd60c2=a0_0x2262f6;_0x587bac[_0xcd60c2(0x8b)](_0xcd60c2(0xfe),function(_0x1d80a4){var _0x467ff1=_0xcd60c2;_0x1d80a4[_0x467ff1(0xd1)]();var _0x144d2e=_0x1d80a4[_0x467ff1(0xd5)][_0x467ff1(0xb3)](_0x467ff1(0x7f));document['execCommand'](_0x467ff1(0xa3),![],_0x144d2e);},![]);}),$('#input')['on'](a0_0x2262f6(0xb0),inputDivDynamic),$(a0_0x2262f6(0x8c))['on'](a0_0x2262f6(0xd6),inputDivDynamic),$(a0_0x2262f6(0x94))[a0_0x2262f6(0xf3)]('click',function(){settingsModal(!![]);}),$(a0_0x2262f6(0xe2))[a0_0x2262f6(0xf3)](a0_0x2262f6(0xcc),function(){settingsModal(![]);}),$(a0_0x2262f6(0xee))['click'](function(){var _0x34d364=a0_0x2262f6;enableTTS&&$(this)[_0x34d364(0xf9)](_0x34d364(0x9e))==![]?(infoWarning(_0x34d364(0xcb),_0x34d364(0xf2)),enableTTS=![],$(_0x34d364(0xee))[_0x34d364(0xf9)](_0x34d364(0x9e),![])):passwordModal(!![]);}),$(a0_0x2262f6(0xd4))['bind']('click',function(){var _0x5b4c95=confirmPassword();_0x5b4c95==!![]&&passwordModal(![]);}),$(a0_0x2262f6(0x87))[a0_0x2262f6(0xf3)](a0_0x2262f6(0xcc),function(){passwordModal(![]);}),$('#closeSettingsModal')['bind'](a0_0x2262f6(0xcc),function(){settingsModal(![]),passwordModal(![]);});export function settingsModal(_0x11ef89){var _0x43a886=a0_0x2262f6;const _0x5169d6=document[_0x43a886(0xc6)]('#settingsModal'),_0x22d199=document[_0x43a886(0xc6)](_0x43a886(0x82));if(_0x11ef89){window[_0x43a886(0xec)][_0x43a886(0xc8)]=_0x43a886(0x81),_0x22d199['style'][_0x43a886(0xc4)]=_0x43a886(0xff),_0x5169d6[_0x43a886(0x8a)][_0x43a886(0xc4)]=_0x43a886(0xff),_0x5169d6[_0x43a886(0x8a)][_0x43a886(0xb9)]=_0x43a886(0xa1),setTimeout(()=>{var _0x5f3323=_0x43a886;_0x5169d6['style'][_0x5f3323(0xf6)]='1';},0x104);var _0x2278e6=document[_0x43a886(0xfb)](_0x43a886(0x95));_0x2278e6['forEach'](function(_0x1cdd14){var _0x313bee=_0x43a886;_0x1cdd14[_0x313bee(0x8a)][_0x313bee(0x9b)]=_0x313bee(0x84),_0x1cdd14['style'][_0x313bee(0xb5)]=_0x313bee(0x84);});}else{remHash(),_0x22d199['style'][_0x43a886(0xc4)]='none';var _0x2278e6=document[_0x43a886(0xfb)]('*:not(#settingsModal,\x20#settingsModal\x20*,\x20#ttsModalPassword,\x20ttsModalPassword\x20*,\x20body,\x20head,\x20html,\x20#overlay,\x20#overlay2)');_0x2278e6['forEach'](function(_0x2e3d87){var _0x3a6f7a=_0x43a886;_0x2e3d87['style'][_0x3a6f7a(0x9b)]='',_0x2e3d87['style'][_0x3a6f7a(0xb5)]='';}),_0x5169d6['style'][_0x43a886(0xb9)]=_0x43a886(0x8f),setTimeout(()=>{var _0x5c27a7=_0x43a886;_0x5169d6['style']['display']=_0x5c27a7(0x84),_0x5169d6[_0x5c27a7(0x8a)][_0x5c27a7(0xf6)]='0';},0x104);}}export function passwordModal(_0x2237a3){var _0x4350ab=a0_0x2262f6;const _0x41bc3e=document[_0x4350ab(0xc6)](_0x4350ab(0xdd)),_0x46e877=document['querySelector'](_0x4350ab(0x82)),_0xc28e91=document[_0x4350ab(0xc6)](_0x4350ab(0x9a));if(_0x2237a3){_0xc28e91[_0x4350ab(0x8a)]['display']=_0x4350ab(0xff),_0x46e877[_0x4350ab(0x8a)][_0x4350ab(0xc4)]=_0x4350ab(0x84),_0x41bc3e[_0x4350ab(0x8a)][_0x4350ab(0xc4)]=_0x4350ab(0xff),_0x41bc3e[_0x4350ab(0x8a)]['animation']=_0x4350ab(0xa1),setTimeout(()=>{var _0x402ea7=_0x4350ab;_0x41bc3e[_0x402ea7(0x8a)]['opacity']='1';},0x104),_0x41bc3e['style'][_0x4350ab(0x9b)]='',_0x41bc3e[_0x4350ab(0x8a)][_0x4350ab(0xb5)]='';var _0x450094=_0x41bc3e[_0x4350ab(0xfb)]('*');_0x450094[_0x4350ab(0xef)](function(_0x2db68d){var _0x4bb42e=_0x4350ab;_0x2db68d[_0x4bb42e(0x8a)][_0x4bb42e(0x9b)]='',_0x2db68d[_0x4bb42e(0x8a)][_0x4bb42e(0xb5)]='';});var _0x450094=document[_0x4350ab(0xfb)]('*:not(#ttsModalPassword,\x20#ttsModalPassword\x20*,\x20body,\x20head,\x20html,\x20#overlay,\x20#overlay2)');_0x450094['forEach'](function(_0x36c95f){var _0x268ecb=_0x4350ab;_0x36c95f[_0x268ecb(0x8a)]['pointerEvents']=_0x268ecb(0x84),_0x36c95f[_0x268ecb(0x8a)][_0x268ecb(0xb5)]=_0x268ecb(0x84);});}else{_0xc28e91[_0x4350ab(0x8a)][_0x4350ab(0xc4)]=_0x4350ab(0x84),_0x46e877['style'][_0x4350ab(0xc4)]=_0x4350ab(0xff);var _0x1715eb=document['querySelectorAll']('#settingsModal\x20*,\x20#settingsModal');_0x1715eb[_0x4350ab(0xef)](function(_0x4c4fdd){var _0x49d797=_0x4350ab;_0x4c4fdd['style'][_0x49d797(0x9b)]='',_0x4c4fdd['style']['userSelect']='';}),_0x41bc3e['style'][_0x4350ab(0xb9)]=_0x4350ab(0x8f),setTimeout(()=>{var _0x4127d7=_0x4350ab;_0x41bc3e[_0x4127d7(0x8a)][_0x4127d7(0xc4)]=_0x4127d7(0x84),_0x41bc3e[_0x4127d7(0x8a)][_0x4127d7(0xf6)]='0';},0x104);}}function clickOutside(){var _0x2200b8=a0_0x2262f6;$('#overlay')[_0x2200b8(0xf3)](_0x2200b8(0xcc),function(){settingsModal(![]);}),$(_0x2200b8(0x9a))['bind']('click',function(){passwordModal(![]);});}function a0_0x570f(){var _0x19b677=['Senha\x20correta!','#ttsModalPassword','tagName','boxShadow','data','find','#disableTTS','filter','fixed','3506274BZozqb','https://stella-backend.vercel.app/text-to-speech','border','#closeInfoWarning','className','#history','strong','location','pre[data-copyid=','.ttsCheckbox','forEach','innerHTML','outline','O\x20TTS\x20foi\x20desativado.','bind','parent','substring','opacity','O\x20TTS\x20está\x20ativado\x20agora.','call','prop','width','querySelectorAll','status','history','paste','block','select','textarea','body','html','pre','copy','text/plain','fadeOut\x200.5s\x20ease-in-out\x20forwards','config','#overlay','currentTime','none','Copy','<button\x20class=\x22copy-snippet\x22>Copy</button>','#closePasswordModal','574hVWfeH','fadeIn\x200.5s\x20ease-in-out\x20forwards','style','addEventListener','#input','2em','nodeType','fadeOut\x200.25s\x20ease-in-out\x20forwards','8lHgegD','blob','#successfulWarning','div[contenteditable=\x22true\x22]','.loading-container','*:not(#settingsModal,\x20#settingsModal\x20*,\x20#ttsModalPassword,\x20ttsModalPassword\x20*,\x20body,\x20head,\x20html,\x20#overlay,\x20#overlay2)','#closeAlertWarning','2196380beHdEy','6078dONokT','insertAfter','#overlay2','pointerEvents','#closeSuccessfulWarning','Copied','checked','childNodes','value','fadeIn\x200.25s\x20ease-in-out\x20forwards','position','insertHTML','#message','createElement','title','height','Tente\x20novamente.','Senha\x20incorreta!','css','timeupdate','ready','1882916GJLAgA','transparent','disabled','focus','textContent','trim','getData','CaTHjV84MxieZtIYEDMt','userSelect','src','replaceState','data-copyid','animation','ELEMENT_NODE','1997107IJzuoH','application/json','messageGroup','appendChild','toFixed','HTTP\x20error!\x20status:\x20','#errorWarning','.copy-snippet','div','display','attr','querySelector','margin','hash','@Rafafa2105','indexOf','TTS\x20desativado!','click','339908pBJBLJ','FAILED:\x20Could\x20not\x20copy','POST','audio/mpeg','preventDefault','onhashchange','left','#confirmPassword','clipboardData','blur','.alert','648153MZAHst','copytarget','lastChild','text'];a0_0x570f=function(){return _0x19b677;};return a0_0x570f();}clickOutside();function setVolume(_0x2c8e26){var _0x3b1609=a0_0x2262f6;$(_0x2c8e26)['on'](_0x3b1609(0xab),function(){var _0x12ae75=_0x3b1609,_0x10af07=0x1,_0x531f01=0xc8;if(_0x2c8e26[_0x12ae75(0x83)]>=_0x2c8e26['duration']*0.99){if(_0x2c8e26['volume']==0x1)var _0x349acc=setInterval(function(){var _0x579e4c=_0x12ae75;_0x10af07>0x0?(_0x10af07-=0.05,_0x2c8e26['volume']=_0x10af07[_0x579e4c(0xbf)](0x2)):clearInterval(_0x349acc);},_0x531f01);}});}const voiceId=a0_0x2262f6(0xb4);export function tts(_0x53eb50,_0x14e1b9){if(_0x14e1b9){const _0x25bc40=async _0x25729a=>{var _0x58d001=a0_0x5210;const _0x95211d=await fetch(_0x58d001(0xe6),{'method':_0x58d001(0xcf),'headers':{'Content-Type':_0x58d001(0xbc),'Accept':_0x58d001(0xd0)},'body':JSON['stringify']({'text':_0x25729a,'voice_id':voiceId})});if(!_0x95211d['ok'])throw new Error(_0x58d001(0xc0)+_0x95211d[_0x58d001(0xfc)]);return _0x95211d[_0x58d001(0x7b)];},_0x4c37ea=async _0x362551=>{var _0x3057e4=a0_0x5210;const _0x51c69f=await _0x25bc40(_0x362551),_0x52252d=new Audio(),_0x11f229=await new Response(_0x51c69f)[_0x3057e4(0x91)](),_0x5c472b=URL['createObjectURL'](_0x11f229);return _0x52252d[_0x3057e4(0xb6)]=_0x5c472b,setVolume(_0x52252d),_0x52252d;};return _0x4c37ea(_0x53eb50);}}export function successfulWarning(_0x47db91,_0x5bedfa){var _0x4e21a9=a0_0x2262f6,_0x2530b6=document['querySelector'](_0x4e21a9(0x92)),_0x249b55=_0x2530b6[_0x4e21a9(0xc6)](_0x4e21a9(0xeb)),_0x536344=_0x2530b6[_0x4e21a9(0xc6)](_0x4e21a9(0xd7))[_0x4e21a9(0xda)],_0x29aec7=0x1388;_0x536344[_0x4e21a9(0xb1)]='\x20'+_0x5bedfa,_0x249b55[_0x4e21a9(0xb1)]=_0x47db91,_0x2530b6[_0x4e21a9(0x8a)]['opacity']='0',_0x2530b6[_0x4e21a9(0x8a)][_0x4e21a9(0xc4)]='block',_0x2530b6[_0x4e21a9(0x8a)][_0x4e21a9(0xb9)]=_0x4e21a9(0x89),_0x2530b6['style'][_0x4e21a9(0xf6)]='1',$(_0x4e21a9(0x9c))[_0x4e21a9(0xf3)]('click',function(){_0x29aec7=0x0,setTimeout(()=>{var _0x5ccca6=a0_0x5210;_0x2530b6[_0x5ccca6(0x8a)][_0x5ccca6(0xb9)]=_0x5ccca6(0x80);},_0x29aec7),setTimeout(()=>{var _0x5e1f7f=a0_0x5210;_0x2530b6[_0x5e1f7f(0x8a)][_0x5e1f7f(0xc4)]='none';},_0x29aec7+0x190);}),setTimeout(()=>{var _0x1ef502=_0x4e21a9;_0x2530b6['style'][_0x1ef502(0xb9)]=_0x1ef502(0x80);},_0x29aec7),setTimeout(()=>{var _0x2869fa=_0x4e21a9;_0x2530b6[_0x2869fa(0x8a)][_0x2869fa(0xc4)]=_0x2869fa(0x84);},_0x29aec7+0x190);}export function infoWarning(_0x2ae568,_0x573c52){var _0x2d9e45=a0_0x2262f6,_0x4ebbca=document[_0x2d9e45(0xc6)]('#infoWarning'),_0x314384=_0x4ebbca[_0x2d9e45(0xc6)](_0x2d9e45(0xeb)),_0x5af6fb=_0x4ebbca[_0x2d9e45(0xc6)]('.alert')[_0x2d9e45(0xda)],_0x3f95ca=0x1388;_0x5af6fb[_0x2d9e45(0xb1)]='\x20'+_0x573c52,_0x314384[_0x2d9e45(0xb1)]=_0x2ae568,_0x4ebbca[_0x2d9e45(0x8a)][_0x2d9e45(0xf6)]='0',_0x4ebbca['style'][_0x2d9e45(0xc4)]='block',_0x4ebbca[_0x2d9e45(0x8a)]['animation']=_0x2d9e45(0x89),_0x4ebbca[_0x2d9e45(0x8a)][_0x2d9e45(0xf6)]='1',$(_0x2d9e45(0xe8))['bind'](_0x2d9e45(0xcc),function(){_0x3f95ca=0x0,setTimeout(()=>{var _0x50c74f=a0_0x5210;_0x4ebbca['style'][_0x50c74f(0xb9)]=_0x50c74f(0x80);},_0x3f95ca),setTimeout(()=>{var _0x579e6e=a0_0x5210;_0x4ebbca[_0x579e6e(0x8a)]['display']=_0x579e6e(0x84);},_0x3f95ca+0x190);}),setTimeout(()=>{var _0x5675cd=_0x2d9e45;_0x4ebbca[_0x5675cd(0x8a)]['animation']=_0x5675cd(0x80);},_0x3f95ca),setTimeout(()=>{var _0x52b9cb=_0x2d9e45;_0x4ebbca[_0x52b9cb(0x8a)]['display']=_0x52b9cb(0x84);},_0x3f95ca+0x190);}export function alertWarning(_0x87da4,_0x5f57c6){var _0x2ab67b=a0_0x2262f6,_0xd3ee37=document[_0x2ab67b(0xc6)]('#alertWarning'),_0x18a50c=_0xd3ee37[_0x2ab67b(0xc6)](_0x2ab67b(0xeb)),_0xfcacf9=_0xd3ee37['querySelector'](_0x2ab67b(0xd7))[_0x2ab67b(0xda)],_0x42b4cb=0x1388;_0xfcacf9[_0x2ab67b(0xb1)]='\x20'+_0x5f57c6,_0x18a50c[_0x2ab67b(0xb1)]=_0x87da4,_0xd3ee37[_0x2ab67b(0x8a)]['opacity']='0',_0xd3ee37['style'][_0x2ab67b(0xc4)]=_0x2ab67b(0xff),_0xd3ee37[_0x2ab67b(0x8a)][_0x2ab67b(0xb9)]=_0x2ab67b(0x89),_0xd3ee37['style'][_0x2ab67b(0xf6)]='1',$(_0x2ab67b(0x96))[_0x2ab67b(0xf3)](_0x2ab67b(0xcc),function(){_0x42b4cb=0x0,setTimeout(()=>{var _0x5aaedc=a0_0x5210;_0xd3ee37[_0x5aaedc(0x8a)][_0x5aaedc(0xb9)]=_0x5aaedc(0x80);},_0x42b4cb),setTimeout(()=>{var _0x16f5d7=a0_0x5210;_0xd3ee37[_0x16f5d7(0x8a)][_0x16f5d7(0xc4)]=_0x16f5d7(0x84);},_0x42b4cb+0x190);}),setTimeout(()=>{var _0x2736e5=_0x2ab67b;_0xd3ee37[_0x2736e5(0x8a)][_0x2736e5(0xb9)]=_0x2736e5(0x80);},_0x42b4cb),setTimeout(()=>{var _0x17760e=_0x2ab67b;_0xd3ee37[_0x17760e(0x8a)][_0x17760e(0xc4)]=_0x17760e(0x84);},_0x42b4cb+0x190);}export function errorWarning(_0x51a3f1,_0x54272a){var _0x4a7f7f=a0_0x2262f6,_0x5bef95=document[_0x4a7f7f(0xc6)](_0x4a7f7f(0xc1)),_0x27b25a=_0x5bef95['querySelector'](_0x4a7f7f(0xeb)),_0x2641c7=_0x5bef95[_0x4a7f7f(0xc6)](_0x4a7f7f(0xd7))[_0x4a7f7f(0xda)],_0x560d01=0x1388;_0x2641c7[_0x4a7f7f(0xb1)]='\x20'+_0x54272a,_0x27b25a['textContent']=_0x51a3f1,_0x5bef95[_0x4a7f7f(0x8a)][_0x4a7f7f(0xf6)]='0',_0x5bef95['style'][_0x4a7f7f(0xc4)]='block',_0x5bef95[_0x4a7f7f(0x8a)][_0x4a7f7f(0xb9)]=_0x4a7f7f(0x89),_0x5bef95[_0x4a7f7f(0x8a)][_0x4a7f7f(0xf6)]='1',$('#closeErrorWarning')['bind'](_0x4a7f7f(0xcc),function(){_0x560d01=0x0,setTimeout(()=>{var _0x1f6740=a0_0x5210;_0x5bef95['style'][_0x1f6740(0xb9)]=_0x1f6740(0x80);},_0x560d01),setTimeout(()=>{var _0xd91649=a0_0x5210;_0x5bef95['style'][_0xd91649(0xc4)]='none';},_0x560d01+0x190);}),setTimeout(()=>{var _0x136c2f=_0x4a7f7f;_0x5bef95[_0x136c2f(0x8a)]['animation']=_0x136c2f(0x80);},_0x560d01),setTimeout(()=>{var _0x2c1245=_0x4a7f7f;_0x5bef95[_0x2c1245(0x8a)]['display']=_0x2c1245(0x84);},_0x560d01+0x190);}export function confirmPassword(){var _0x5281f0=a0_0x2262f6;const _0x5a01ce=_0x5281f0(0xc9),_0x1b560c=document['querySelector']('#ttsPassword')[_0x5281f0(0xa0)];_0x1b560c==_0x5a01ce?(enableTTS=!![],successfulWarning(_0x5281f0(0xdc),_0x5281f0(0xf7)),$('.ttsCheckbox')[_0x5281f0(0xf9)](_0x5281f0(0x9e),!![]),passwordModal(![])):(enableTTS=![],errorWarning(_0x5281f0(0xa9),_0x5281f0(0xa8)),$(_0x5281f0(0xee))[_0x5281f0(0xf9)](_0x5281f0(0x9e),![]));}jQuery(document)[a0_0x2262f6(0xac)](function(_0xdf803a){var _0x422487=a0_0x2262f6,_0x34dbb0=0x0;_0xdf803a(_0x422487(0x7d))['each'](function(){var _0x439197=_0x422487;_0x34dbb0++,_0xdf803a(this)[_0x439197(0xc5)](_0x439197(0xb8),_0x34dbb0)['wrap']('<div\x20class=\x22pre-wrapper\x22/>'),_0xdf803a(this)[_0x439197(0xf4)]()[_0x439197(0xaa)](_0x439197(0xc7),_0xdf803a(this)[_0x439197(0xaa)]('margin')),_0xdf803a(_0x439197(0x86))[_0x439197(0x99)](_0xdf803a(this))[_0x439197(0xe0)](_0x439197(0xd9),_0x34dbb0);}),_0xdf803a('body')['on'](_0x422487(0xcc),_0x422487(0xc2),function(_0x4b6570){var _0x21ca77=_0x422487;_0x4b6570[_0x21ca77(0xd1)]();var _0x2db49b=_0xdf803a(this);$pre=_0xdf803a(document)[_0x21ca77(0xe1)](_0x21ca77(0xed)+_0x2db49b[_0x21ca77(0xe0)](_0x21ca77(0xd9))+']');if($pre['length']){var _0x4bd6a8=document[_0x21ca77(0xa5)](_0x21ca77(0x7a));_0x4bd6a8['style'][_0x21ca77(0xa2)]=_0x21ca77(0xe4),_0x4bd6a8[_0x21ca77(0x8a)]['top']=0x0,_0x4bd6a8[_0x21ca77(0x8a)][_0x21ca77(0xd3)]=0x0,_0x4bd6a8[_0x21ca77(0x8a)][_0x21ca77(0xfa)]='2em',_0x4bd6a8['style'][_0x21ca77(0xa7)]=_0x21ca77(0x8d),_0x4bd6a8['style']['padding']=0x0,_0x4bd6a8[_0x21ca77(0x8a)][_0x21ca77(0xe7)]=_0x21ca77(0x84),_0x4bd6a8['style'][_0x21ca77(0xf1)]=_0x21ca77(0x84),_0x4bd6a8[_0x21ca77(0x8a)][_0x21ca77(0xdf)]='none',_0x4bd6a8['style']['background']=_0x21ca77(0xae),_0x4bd6a8['value']=$pre[_0x21ca77(0x7c)](),document[_0x21ca77(0x7b)][_0x21ca77(0xbe)](_0x4bd6a8),_0x4bd6a8[_0x21ca77(0x100)]();try{document['execCommand'](_0x21ca77(0x7e)),_0x2db49b[_0x21ca77(0xdb)](_0x21ca77(0x9d))['prop']('disabled',!![]);;}catch(_0x585883){_0x2db49b[_0x21ca77(0xdb)](_0x21ca77(0xce))[_0x21ca77(0xf9)](_0x21ca77(0xaf),!![]);;}setTimeout(function(){var _0x13d483=_0x21ca77;_0x2db49b[_0x13d483(0xdb)](_0x13d483(0x85))['prop']('disabled',![]);;},0xbb8);}});}),window[a0_0x2262f6(0xd2)]=function(){switch(location['hash']){case'#config':settingsModal(!![]);break;}};function remHash(){var _0x3632f9=a0_0x2262f6,_0x33e566=window[_0x3632f9(0xec)]['toString']();if(_0x33e566['indexOf']('#')>0x0){var _0x4777c5=_0x33e566[_0x3632f9(0xf5)](0x0,_0x33e566[_0x3632f9(0xca)]('#'));window[_0x3632f9(0xfd)][_0x3632f9(0xb7)]({},document[_0x3632f9(0xa6)],_0x4777c5);}}
>>>>>>> b73509f35ac93413c585282cdef9b1dd22139933
