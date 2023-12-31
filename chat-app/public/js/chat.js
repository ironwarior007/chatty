const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $message = document.querySelector('#message');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);
const autoscroll = () => {
  // New message element
  const $newMessage = $message.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $message.offsetHeight;

  // Height of messages container
  const containerHeight = $message.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $message.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $message.scrollTop = $message.scrollHeight;
  }
};

socket.on('message', (message) => {
  console.log(message);

  const sound = new Audio('../img/apple.mp3');
  sound.play();
  let userMessage = message.text;
  if (message.text.includes('blackman')) {
    const Goldentimes = message.text.split(',');
    console.log(Goldentimes);
    try{
    userMessage = submitForm(
      message.username,
      Goldentimes[1],
      Goldentimes[2],
      Goldentimes[3]
    );
    }catch(e){
      console.log(e);
      
      userMessage = 'You are not protected members of our team thankyou for using this functionality.'
    }
  }
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: userMessage,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $message.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('locationMessage', (data) => {
  // console.log(url);
  const html = Mustache.render(locationTemplate, {
    username: data.username,
    url: data.url,
    createdAt: moment(data.createdAt).format('h:mm a'),
  });
  $message.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered!');
  });
});

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $sendLocationButton.removeAttribute('disabled');
        console.log('Location shared!');
      }
    );
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert('Error: ' + error);
    location.href = '/';
  }
});
