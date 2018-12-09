// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  BasicCard,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// some useful api
const http = require("http");
var https = require("https");
const url1 = "http://hawking.sv.cmu.edu:9023/dataset/temporary"
const url2 = "http://www.google.com"

const url3 = "http://api.worldweatheronline.com/premium/v1/tz.ashx"
var key = "45029481d87e44e59ce230848183011"




// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
// Handle the Dialogflow intent named 'demo4mata'.

//keep ask the same question
app.intent('demo14mata', (conv, {any}) => {

    // conv.ask(` `);
    // return callApi(any).then((output) => {
    // console.log(output);
    // conv.ask(`I found::::` + output);
    // }).catch(() => {
    //     conv.close('Error occurred while trying to get vehicles. Please try again later.');
    // });
    // conv.ask(new Suggestions('Yes', 'No'));

    conv.ask(` `);
    return callMATA(any).then((output) => {
    console.log(output);
    conv.ask(`I found:::` + output);
    }).catch(() => {
        conv.close('Error occurred while trying to get vehicles.. Please try again later.');
    });
    conv.ask(new Suggestions('Yes', 'No'));

});


// call api we need
function callApi (any){
    return new Promise((resolve, reject) => {
        var html = ""
        var url = url3 + "?q=" + any + "&key=" + key;

        http.get(url,(res)=>{

            res.on("data",(data)=>{
                html+=data
            })

            res.on("end",()=>{

              //when cannot find location, turn to google for help
              if (html.indexOf("error") >= 0){
                return callGoogle().then((res) =>{
                    // console.log(res.length);
                    // console.log("ha2");
                    html = res;
                    // console.log(html.length);
                    // console.log("ha3");
                    let output = html;
                    resolve(output);
                  })
              }

                console.log(html)
                let output = html;
                resolve(output);
            })

        }).on("error",(e)=>{
            console.log('something wrong')
        })
    });     //promise
}

//call MATA api
function callMATA(any){
  console.log(any);
  //set up the options
  const options = {
    hostname: 'hawking.sv.cmu.edu',
    port: 9016,
    path: '/opennex/dataset/intentMessager',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(any)
    }
  };

  return new Promise((resolve, reject) => {

    //the variable should be returned
    var html = ""

    const req = https.request(options, (res) => {
      console.log(`status code: ${res.statusCode}`);
      console.log(`status headers: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        html += chunk;
        console.log(`status body: ${chunk}`);
      });
      res.on('end', () => {
        console.log(html)
        let output = html;
        resolve(output);
        console.log('no data in status');
      });
    });

    req.on('error', (e) => {
      console.error(`met problems during requesting: ${e.message}`);
    });

    // 将数据写入到请求主体。
    req.write(any);
    req.end();
  });     //promise
}

//call other api like google when our api cannot fix the problem
function callGoogle(){
  return new Promise ((resolve, reject) =>{
    var html1 = "";
    http.get(url1,(res)=>{
        res.on("data",(data)=>{
            html1+=data
        })
        res.on("end",()=>{

          let res = html1;
          resolve(res);
          console.log(res.length);
          console.log("ha1");
            // console.log(replies);
        })
    }).on("error",(e)=>{
        console.log(`获取数据失败: ${e.message}`)
    })
  });
}

// to get the users' infomation
// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  conv.ask(new Permission({
    context: 'Hi there, to get to know you better',
    permissions: 'NAME'
  }));
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask(`Ok, no worries. What can I do for you?`);
    conv.ask(new Suggestions('Blue', 'Red', 'Green'));
  } else {
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. what can I do for you?`);
    conv.ask(new Suggestions('Blue', 'Red', 'Green'));
  }
});



// Define a mapping of fake color strings to basic card objects.
const colorMap = {
  'indigo taco': {
    title: 'Indigo Taco',
    text: 'Indigo Taco is a subtle bluish tone.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
      accessibilityText: 'Indigo Taco Color',
    },
    display: 'WHITE',
  },
  'pink unicorn': {
    title: 'Pink Unicorn',
    text: 'Pink Unicorn is an imaginative reddish hue.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
      accessibilityText: 'Pink Unicorn Color',
    },
    display: 'WHITE',
  },
  'blue grey coffee': {
    title: 'Blue Grey Coffee',
    text: 'Calling out to rainy days, Blue Grey Coffee brings to mind your favorite coffee shop.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
      accessibilityText: 'Blue Grey Coffee Color',
    },
    display: 'WHITE',
  },
};

// Handle the Dialogflow intent named 'favorite fake color'.
// The intent collects a parameter named 'fakeColor'.
app.intent('favorite fake color', (conv, {fakeColor}) => {
  // Present user with the corresponding basic card and end the conversation.
  conv.close(`Here's the color`, new BasicCard(colorMap[fakeColor]));
});
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
