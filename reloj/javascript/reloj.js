const updateClock = () => {
  const now     = new Date();   /*constructor Date crea objeto que representa la fecha y hora. 
  Tiene varios métodos: hora, minutos, segundos, día, mes, año. */ 
  const hours   = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  /*para el 0 delante de los números 1-9*/ 
  const formattedHours   = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

  const timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  const dateElement    = document.getElementById('date');
  const messageElement = document.getElementById('message');
  const timeElement    = document.getElementById('time');
  const dateString = formatDate(now);

  dateElement.innerText    = dateString;
  timeElement.innerText    = timeString;
  
  /*para que salga el mensaje solo en la página principal del reloj*/ 
  const index = document.getElementById('index')
  if (!index) {

    const message = getMessage(hours);
    messageElement.innerText = message;
  }
}

const formatDate = (date) => {
  const day   = date.getDate();
  const month = date.getMonth() + 1; // Los meses comienzan desde 0
  const year  = date.getFullYear();

  const formattedDay = day < 10 ? '0' + day : day;
  const formattedMonth = month < 10 ? '0' + month : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
}

const getMessage = (hours) => {
  if (hours >= 0 && hours <= 7) {
      return "Es hora de descansar. Apaga y sigue mañana";
  } else if (hours > 7 && hours <= 12) {
      return "Buenos días, desayuna fuerte y a darle al código";
  } else if (hours > 12 && hours <= 14) {
      return "Echa un rato más pero no olvides comer";
  } else if (hours > 14 && hours <= 16) {
      return "Espero que hayas comido";
  } else if (hours > 16 && hours <= 18) {
      return "Buenas tardes, el último empujón";
  } else if (hours > 18 && hours <= 22) {
      return "Esto ya son horas extras, piensa en parar pronto";
  } else {
      return "Buenas noches, es hora de pensar en parar y descansar";
  }
}

setInterval(updateClock, 1000); 
updateClock();
