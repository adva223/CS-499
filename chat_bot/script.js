// Channel ID (this is the limiting factor)
const CLIENT_ID = 'oZN80rv4gygvQ0N4';

const drone = new ScaleDrone(CLIENT_ID, {
  data: { // Will be sent out as clientData via events
    name: getRandomName(),
    color: getRandomColor(),
  },
});

let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected');

  // JOINING ROOM
  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }

    console.log('Successfully joined room');
    chatbot.publish({
      room: 'observable-room',
      message: 'Welcome! What can we help you with today ?',
    });
  });

  room.on('members', m => {
    members = m;
    updateMembersDOM();
  });

  // MEMBER JOINS
  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();

  });

  // MEMBER LEAVES
  room.on('member_leave', ({id}) => {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});

// connection closed flag
drone.on('close', event => {
  console.log('Connection was closed', event);
});

// ERROR
drone.on('error', error => {
  console.error(error);
});

// Code for determining users' names
function getRandomName() { 
  const username = ["You", "Ryan Robey", "Edward Cooley", "Nicole Iuliano", "Admin"];
  return (
    username[1]
  );
}

// random color generator for usernames (will be replaced)
function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

//------------- Document Object Model

const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);

// SENDS MESSAGE
function sendMessage() {
  const value = DOM.input.value;
  if (value === '') {
    return;
  }
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,
  });
}

// CREATE MEMBER ELEMENT
function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}

// UPDATE MEMBERS DOM
function updateMembersDOM() {
  if (members.length >= 2) {
    DOM.membersCount.innerText = `Chatting with CIR Legal Representative.`;
    AI_initiate();
  }
  else{
    DOM.membersCount.innerText = `Assistance bot available. Please choose from the buttons below for an immediate guidance.`;
  }
  DOM.membersList.innerHTML = '';
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

// creates message element
function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;
}

// adds message to DOM (not used by our side)
function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}

// 'AI' stuff (buttons) -- What is said when user click these will change
function AI_initiate() {
  drone.publish({
    room: 'observable-room',
    message: 'Welcome to CIR Legal private chat. Please wait for one of our live lawyers to connect..',
  });
}

function AI_pimalpractice() {
  addChat();
  drone.publish({
    room: 'observable-room',
    message: 'Thank you for reaching out for criminal defense help. Our attorneys aggressively defend criminal cases. Let me get some quick information from you and I will have one of our criminal attorneys reach out to you immediately to discuss your case and defense.',
  });
}

function AI_criminaldefense() {
  drone.publish({
    room: 'observable-room',
    message: 'Thank you for reaching out for criminal defense help. Our attorneys aggressively defend criminal cases. Let me get some quick information from you and I will have one of our criminal attorneys reach out to you immediately to discuss your case and defense. Please respond with a phone number to reach you by, and we will be with you as soon as possible.',
  });
}

function AI_familydivorce() {
  drone.publish({
    room: 'observable-room',
    message: 'Thank you for reaching out about your family case. Our attorneys have helped clients with a wide range of family issues, from custody and timesharing to division of assets and divorce. If you don’t mind, I will get a small bit of information from you and have one of our family law attorneys call you within five-to-ten minutes.',
  });
}

function AI_other() {
  drone.publish({
    room: 'observable-room',
    message: 'Thank you. Our lawyers prefer to call you to discuss your case. They should be able to get in touch with you within ten (10) minutes.  What phone number would you like for them to call?',
  });
}

// SIGN IN PAGE - very simple and not secure for now (database in work)
function signIn()
{
    var input_u = document.getElementById("inputEmail").value;
    var input_p = document.getElementById("inputPassword").value;

    if ((input_u === 'admin') && (input_p === 'password'))
    {
        window.location.href = "./admin.html";
    }
    else {
      window.alert("Username or password incorrect.");
    }
}

// ADMIN PANEL STUFF (in progress)
function addChat()
{
  //var client = document.getElementById('iframeId').contentWindow.document.getElementById('take1')
  //client.style.visibility = "visible";

  window.frames['admin'].contentWindow.document.getElementById('take1').style.visibility = "visible";



}

function takeChat()
{
  window.location.href = "./index.html";
}
