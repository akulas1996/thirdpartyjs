/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
(function() {
  "use strict";
  //$('.wrapper').hide();
  
    var ENTER_KEY_CODE = 13;
    var queryInput, resultDiv, accessTokenInput, sendButton;
  
    window.onload = init;
    var i = 0;
    //var j is for links;
    var j = 0;
    var fromDialogflow = [];
    var fromUser = [];
    var links = [];
  
    function init() {
      deleteMessagesIfTimeExpires();
      queryInput = document.getElementById("q");
      sendButton = document.getElementById("click");
      resultDiv = document.getElementById("msg-insert");
      accessTokenInput = document.getElementById("access_token");
      var setAccessTokenButton = document.getElementById("set_access_token");
  
      queryInput.addEventListener("keydown", queryInputKeyDown);
      sendButton.addEventListener("click", onSendButtonClick);
      //setAccessTokenButton.addEventListener("click", setAccessToken);
      

  
      window.init(accessTokenInput.value);
      console.log(fromDialogflow.length)
      if(localStorage.getItem("responseMessages") === null) {
        fromDialogflow =[];
      } else {
        var retrievedData = localStorage.getItem("responseMessages");
        fromDialogflow = JSON.parse(retrievedData);
      }

      if(localStorage.getItem("queryMessages") != null) {
        var qMessages = localStorage.getItem("queryMessages");
        fromUser = JSON.parse(qMessages);
      }
      else{
        fromUser = [];
      }
      
      
      //alert(fromDialogflow.length);
        i = fromDialogflow.length;

  
      
      console.log(String(fromDialogflow[0]));
      var k = 0;
      for(k = 0; k < fromDialogflow.length; k++){
        createQueryNode(fromUser[k]);
        var node = createResponseNode();
        setResponseFromStorage(fromDialogflow[k], node)

      }
      
    }

    function deleteMessagesIfTimeExpires(){
      var retrievedData = localStorage.getItem("timeStamp");
      var pastTime = JSON.parse(retrievedData);
      //check with the current time. Delete if the time is more than 10 minutes
      var currentTime = new Date();
      currentTime = currentTime.getTime();
      console.log('Current time  => ' +currentTime);
      console.log('TYPE  --> ' + typeof currentTime);
      console.log('pastTime = > ' + retrievedData);

      var difference = (currentTime - retrievedData)/1000;

      
      difference /= 60;
      console.log(Math.abs(Math.round(difference)) + '  <----minute/s');


      var timeDifference = Math.abs(Math.round(difference));
      console.log('Time difference -- > ' + timeDifference);
      if(timeDifference > 1) {
        console.log("Delete All ")
        deleteAll();
      }


    }



  
    function deleteAll(){
      localStorage.removeItem("responseMessages");
      localStorage.removeItem("queryMessages");
      localStorage.removeItem("timeStamp");
    }

    function checkTheCurrentTime(){
      var d = new Date();
      var timeStamp = d.getTime();
      localStorage.setItem("timeStamp", JSON.stringify(timeStamp));
      
    }


    function setResponseFromStorage(response, node){

      node.innerHTML = response;
      
      resultDiv.appendChild(node);
      var d = $('.chat-body');
      console.log(d.height())
      d.scrollTop(d.prop("scrollHeight"));
    }

    function setLinkNodeFromResponse(link){
      var node = document.createElement("a");
      node.className = "msg-receive";
      node.innerHTML = link;
      resultDiv.appendChild(node);
      return node;
  
    }

  
    var arrow = $('#close');
    var textarea = $('.chat-text textarea');

    var chatIcon = $('#chat-icon');


    chatIcon.on('click', function(){
      $('.wrapper').show();
      chatIcon.toggleClass('fa-times-circle fa-minus-circle')
      $('#text-before-icon').hide();
    });


    $( "#chat-icon" )
  .mouseenter(function() {
    var iconDiv=document.getElementById("icon-div");
    iconDiv.innerHTML = '<i class="fas fa-comment" id="chat-icon"></i>'
    console.log('mouse')
    //$("#chat-icon" ).addClass('fas fa-comment');
    //$("#chat-icon" ).removeClass('fas fa-comments');
  })
  .mouseleave(function() {
    var iconDiv=document.getElementById("icon-div");
    iconDiv.innerHTML = '<i class="fas fa-comments" id="chat-icon"></i>'
    console.log('mouse left')
    //$("#chat-icon" ).addClass('fas fa-comments');
    //$("#chat-icon" ).removeClass('fas fa-comment');
  });



  
    arrow.on('click', function(){
      $('.wrapper').hide();
      $('#text-before-icon').show();
      chatIcon.toggleClass('fa-times-circle fa-minus-circle')
    
    });
  
  


    //On send button click
    function onSendButtonClick(event) {

      console.log(event)
  
      var value = queryInput.value;
      queryInput.value = "";
  
      createQueryNode(value);
      var responseNode = createResponseNode();
      
      sendText(value)
      .then(function(response) {
        var result;
        var link;

        try {
          if(response.result.fulfillment.speech === ""){

          if("data" in response.result.fulfillment) {
            console.log("IN LAMBDA")
            console.log(response)
            result = response.result.fulfillment.data.google.richResponse.items[0].simpleResponse.textToSpeech;

              var linkInformation = "Click for more information";
              link = response.result.fulfillment.data.google.richResponse.items[0].simpleResponse.link;

          }else {

            console.log("IN CHATBOT")
            result = response.result.fulfillment.messages[0].payload.chatbot.Message;
            var linkInformation = "Click for more information";
            link = response.result.fulfillment.messages[0].payload.chatbot.link;
          }
          }
          else {
          result = response.result.fulfillment.speech
          }
        } catch(error) {
          result = "Please try again. You can say help, to find out what I can do.";
        }
        setResponseJSON(response);
        
        setResponseOnNode(result, responseNode, link);
      })
        .catch(function(err) {
          setResponseJSON(err);
          var link="http://pixelarchitect.ca"
          setResponseOnNode("Something goes wrong", responseNode, link);
        });
    }
  


  

  function queryInputKeyDown(event) {
    if (event.which !== ENTER_KEY_CODE) {
      return;
    }
    console.log(event)

    var value = queryInput.value;
    queryInput.value = "";

    createQueryNode(value);
    var responseNode = createResponseNode();
    

    sendText(value)
      .then(function(response) {
        var result;
        var link;

        try {
          if(response.result.fulfillment.speech === ""){

          if("data" in response.result.fulfillment) {
            console.log("IN LAMBDA")
            console.log(response)
            result = response.result.fulfillment.data.google.richResponse.items[0].simpleResponse.textToSpeech;

              var linkInformation = "Click for more information";
              link = response.result.fulfillment.data.google.richResponse.items[0].simpleResponse.link;
            

          }else {

            console.log("IN CHATBOT")
            result = response.result.fulfillment.messages[0].payload.chatbot.Message;
            var linkInformation = "Click for more information";
            link = response.result.fulfillment.messages[0].payload.chatbot.link;
            console.log("THIS IS LINK " + link)
          }
          }
          else {
          result = response.result.fulfillment.speech
          }
        } catch(error) {
          result = "Please try again. You can say help, to find out what I can do.";
        }
        setResponseJSON(response);
        
        setResponseOnNode(result, responseNode, link);
      })
      .catch(function(err) {
        setResponseJSON(err);
        var link="http://pixelarchitect.ca"
        setResponseOnNode("Something goes wrong", responseNode, link);
      });
  }





  function createQueryNode(query) {

    var node = document.createElement("div");
    // node.className = "msg-send";
    // node.innerHTML = query;
    // console.log(query);
    fromUser[i] = query;

    // resultDiv.appendChild(node);


    node.innerHTML = '<div class="row msg_container base_sent"><div class="col-md-10 col-xs-10"><div class="messages msg_sent"><p>'+query+'</p><time datetime="2009-11-13T20:00">Timothy • 51 min</time></div></div><div class="col-md-2 col-xs-2 avatar"><i class="fas fa-user" style="font-size: 40px; background-color: #D3D3D3; padding : 5px;"></i></div></div>'
    resultDiv.appendChild(node);
  }



function createLinkButtonNode(){
	var node = document.createElement("a");
    node.className = "msg-receive";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    return node;

	}



function setAccessToken(){
    }


  function createResponseNode() {

    var node = document.createElement("div");
    //node.className = "msg-receive";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    return node;
  }

	function setButtonLinkNodes(response, extraNode, linkAddress){
    	extraNode.innerHTML = response ? response : "[empty response]";
        extraNode.setAttribute("data-actual-response", response);
        console.log("Link addres " + linkAddress);
        extraNode.style.backgroundColor = "royalblue";
        console.log("Link Address -- > " + linkAddress);
        extraNode.setAttribute("href","google.ca");
        links[j] = linkAddress;
        j++;
	}



  


  function setResponseOnNode(response, node, link) {
    node.innerHTML = response ? response : "[empty response]";

    response = response.replace(/\n/g, "<br />");


    node.innerHTML = '<div class="row msg_container base_receive"><div class="col-md-2 col-xs-2 avatar"><i class="fas fa-user" style="font-size: 40px; background-color: #D3D3D3; padding : 5px;"></i></div><div class="col-md-10 col-xs-10"><div class="messages msg_receive"><p>'+response+'</p><time datetime="2009-11-13T20:00">Timothy • 51 min</time></div></div></div>';
    
    if(link != undefined) {
      
      console.log("THE LLLLLLLLINK " + link);

      var linkNode = document.createElement("div");
      //linkNode.className = "msg-receive";
      linkNode.innerHTML = '<div class="row msg_container base_receive"><div class="col-md-2 col-xs-2 avatar"><i class="fas fa-user" style="font-size: 40px; background-color: #D3D3D3; padding : 5px;"></i></div><div class="col-md-10 col-xs-10"><div class="messages msg_receive"><p><a href='+link+'>Click Here for more info</a></p><time datetime="2009-11-13T20:00">Timothy • 51 min</time></div></div></div>';

      //linkNode.innerHTML = '<br> <a href='+link+'>Click Here for more info</a>';
      node.appendChild(linkNode);
    }

    resultDiv.appendChild(node);


    var d = $('.chat-body');
    console.log(d.height())
    d.scrollTop(d.prop("scrollHeight"));

    //push the responses to the browser local storage

    fromDialogflow[i] = node.innerHTML;
    i++;
    checkTheCurrentTime();
 
  }


  function setResponseJSON(response) {
    var node = document.getElementById("jsonResponse");
    console.log(response);
    //node.innerHTML = JSON.stringify(response, null, 2);
  }

  window.onbeforeunload = function(){
    localStorage.setItem("responseMessages", JSON.stringify(fromDialogflow));
    localStorage.setItem("queryMessages", JSON.stringify(fromUser));
    localStorage.setItem("linkNodes", JSON.stringify(links));
 }

    

})();
