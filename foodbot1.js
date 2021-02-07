const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Payload } =require("dialogflow-fulfillment");
const app = express();

const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var randomstring = require("randomstring"); 
var user_name="";
var usernumber;

app.post("/dialogflow", express.json(), (req, res) => {
    const agent = new WebhookClient({ 
		request: req, response: res 
		});


async function identify_user(agent)
{ 
  const phone_num = agent.parameters['phone_num'];
  console.log(phone_num);
  const client = new MongoClient(url);
  await client.connect();
  const snap = await client.db("foodorder").collection("user_table").findOne({phone_num: phone_num});
  console.log(snap);
  if(snap==null){
	  await agent.add("Re-Enter your phonenumber");

  }
  else
  {
  user_name=snap.username;
  await agent.add("Welcome  "+user_name+"!!  \n We'll show you our available food dishes select anyitem by pressing the approptitate key (BUT) First Tell Us Your Favourite Dish 😋 ThankYou 😄");}
}
/*
async function register_user(agent)
{
  var user_name = agent.parameters.user_name;
  var mobile_num = agent.parameters.pnumber;
  usernumber=mobile_num;
  const client = new MongoClient(url);
  await client.connect();
  const snap = await client.db("proj2").collection("user_table").findOne({mobile_num: mobile_num});
  
  if(snap==null){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("proj2");
        
      var myobj = { username:user_name, mobile_num:mobile_num };
    
        dbo.collection("user_table").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 record inserted");
          db.close();    
        });
     });
    user=user_name;
    usernumber=mobile_num;
    agent.add("Welcome  "+user+"!!  \n How can I help you");
  }
  else
  {
    user=snap.username;
    await agent.end("This mobile number already exists please try registering problem using existing account mr."+user);
  }
}
*/	
function report_issue(agent)
{
 
  var issue_vals={1:"Paneer Butter Masala",2:"Kadai Chicken",3:"Egg Kadai",4:"Paneer Biriyani",5:"Chicken Biriyani",6:"Egg Biriyani",7:"Rumali Roti",8:"Tandoori Roti",9:"Khubani ka Meetha"};
  
  const intent_val=agent.parameters.issue_num;
  
  var val=issue_vals[intent_val];
  
  var trouble_ticket=randomstring.generate(4);
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("foodorder");
    
	var u_name = user_name;    
    var issue_val=  val; 
    var status="pending";

	let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    var time_date=year + "-" + month + "-" + date;

	var myobj = { username:u_name, issue:issue_val,status:status,time_date:time_date,trouble_ticket:trouble_ticket };

    dbo.collection("user_orders").insertOne(myobj, function(err, res) {
    if (err) throw err;
    db.close();    
  });
 });
 agent.add("HURRAY !🤩 Your Order had been placed .Visit the nearest outlet and collect the Order by using the TokenNo. ThankYou 😍" + "Order Name :"+ val +"\nYour Token Number is: "+trouble_ticket);
}

//trying to load rich response
function custom_payload(agent)
{
	var payLoadData=
		{
  "richContent": [
    [
      {
        "type": "list",
        "title": "Paneer Butter Masala",
        "subtitle": "Press '1' for Paneer Butter Masala",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "list",
        "title": "Kadai Chicken",
        "subtitle": "Press '2' for Kadai Chicken",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
	  {
        "type": "divider"
      },
	  {
        "type": "list",
        "title": "Egg Kadai",
        "subtitle": "Press '3' for Egg Kadai",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "list",
        "title": "Paneer Biriyani",
        "subtitle": "Press '4' for Paneer Biriyani",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "list",
        "title": "Chicken Biriyani",
        "subtitle": "Press '5' for Chicken Biriyani",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "list",
        "title": "Egg Biriyani",
        "subtitle": "Press '6' for Egg Biriyani",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "list",
        "title": "Rumali Roti",
        "subtitle": "Press '7' for Rumali Roti",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "list",
        "title": "Tandoori Roti",
        "subtitle": "Press '8' for Tandoori Roti",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "list",
        "title": "Khubani ka Meetha",
        "subtitle": "Press '9' for Khubani ka Meetha",
        "event": {
          "name": "",
          "languageCode": "",
          "parameters": {}
        }
      }
    ]
  ]
}
agent.add(new Payload(agent.UNSPECIFIED,payLoadData,{sendAsMessage:true, rawPayload:true }));
}




var intentMap = new Map();
intentMap.set("ordertaking", identify_user);
intentMap.set("ordertaking - custom - custom", report_issue);
intentMap.set("ordertaking - custom", custom_payload);

agent.handleRequest(intentMap);

});//Closing tag of app.post
app.get('/',(req,res)=>
    {
        res.send("we are leave");
    })

app.listen(process.env.PORT || 8083);

