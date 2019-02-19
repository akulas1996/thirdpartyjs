var wrapper = 
'<div class="input-field col s10" style="display:none">' +
'<input id="access_token" type="text" value="825eeb3cba0d444a891b10cafb445914">' +
'<label for="access_token">Access token</label>' +
'</div>'+
'<div class="wrapper">'+
  '<div>' +
  '<div class="chat-box">' +
    '<div class="chat-head">' +
        '<i class="fas fa-comment" style="font-size:20px; color:white; padding: 15px"> &nbsp; Chat -- Pixel Architect </i>'  +
        '<i class="fas fa-times" id = "close" style="font-size:20px; color:white; padding: 15px; display:inline"> </i>' +

    '</div>' +
    '<div class="chat-body">' +
      '<div id="msg-insert">' +

        
      '</div>' +



      '<div class="chat-text">' +

          '<textarea id="q" class="control-label" style="border: thin red solid;" placeholder="Please input your text here."></textarea> ' +
          '<input type="button" class="click" id="click" value="SEND" >' +

       

      ' </div> ' +
    '</div> ' +
  '</div>' +
  '</div>' +
'</div>';

//fontawsome
var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'http://localhost:8000/PixelArchitect-chatbot_copy/demo/simple/fontawsome/css/all.css';
head.appendChild(link);



//Attaching style sheet
var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link');
link.id   = 'cssId';
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'http://localhost:8000/PixelArchitect-chatbot_copy/demo/simple/chatbot_style.css';
link.media = 'all';
head.appendChild(link);

//Attach demofunctionsScript
var head  = document.getElementsByTagName('head')[0];
var script  = document.createElement('script');
script.src = 'http://localhost:8000/PixelArchitect-chatbot_copy/demo/simple/demoFunctions.js';
head.appendChild(script);

//Attach layout link
var script  = document.createElement('script');
script.src = 'http://localhost:8000/PixelArchitect-chatbot_copy/demo/simple/layout.js';
head.appendChild(script);

//Attach API.AI
var script  = document.createElement('script');
script.src = 'http://localhost:8000/PixelArchitect-chatbot_copy/target/ApiAi.js';
head.appendChild(script);

//JQuery
var script  = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js';
head.appendChild(script);





console.log(wrapper);
var div = document.createElement('div');

div.innerHTML = wrapper;
// set style

// better to use CSS though - just set class
div.setAttribute('class', 'myclass'); // and make sure myclass has some styles in css
document.body.appendChild(div);