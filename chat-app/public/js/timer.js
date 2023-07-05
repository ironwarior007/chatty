function getFormattedTime(timeStr) {
  const [time, period] = timeStr.split(' ');
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr);
  if (period.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  }
  const minute = parseInt(minuteStr);
  return { hour, minute };
}

function getCurrentTime() {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
}

function formatTime(hours, minutes) {
  const formattedHour = hours.toString().padStart(2, '0');
  const formattedMinute = minutes.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMinute}`;
}

function submitForm() {
  var field1Value = document.getElementById('field1').value;
  var field2Value = document.getElementById('field2').value;
  var field3Value = document.getElementById('field3').value;
  
  const punchinBeforeLunchStr = `${field1Value} AM`;
  const punchinBeforeLunch = getFormattedTime(punchinBeforeLunchStr);

  const punchoutBeforeLunchStr = `${field2Value} PM`;
  const punchoutBeforeLunch = getFormattedTime(punchoutBeforeLunchStr);

  const punchinAfterLunchStr = `${field3Value} PM`;
  const punchinAfterLunch = getFormattedTime(punchinAfterLunchStr);

  const currentTime = getCurrentTime();
  const totalHoursWorkedBeforeLunch =
    punchoutBeforeLunch.hour - punchinBeforeLunch.hour;
  const totalMinutesWorkedBeforeLunch =
    punchoutBeforeLunch.minute - punchinBeforeLunch.minute;
  const totalHoursWorkedAfterLunch = currentTime.hour - punchinAfterLunch.hour;
  const totalMinutesWorkedAfterLunch =
    currentTime.minute - punchinAfterLunch.minute;

  let totalHoursWorked =
    totalHoursWorkedBeforeLunch + totalHoursWorkedAfterLunch;
  let totalMinutesWorked =
    totalMinutesWorkedBeforeLunch + totalMinutesWorkedAfterLunch;

  if (totalMinutesWorked < 0) {
    totalMinutesWorked += 60;
    totalHoursWorked--;
  }

  const totalWorkedTimeStr = formatTime(totalHoursWorked, totalMinutesWorked);

  if (
    totalHoursWorked < 8 ||
    (totalHoursWorked === 8 && totalMinutesWorked < 30)
  ) {
    const remainingHours = 8 - totalHoursWorked;
    const remainingMinutes = 30 - totalMinutesWorked;
    const remainingTimeStr = formatTime(remainingHours, remainingMinutes);

    const currentTime = new Date();
    const futureTime = new Date(
      currentTime.getTime() + (remainingHours * 60 + remainingMinutes) * 60000
    );
    const futureTimeStr = futureTime.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    
    responseMessage = `I don't know this time ${futureTimeStr}`
    var timerResultElement = document.getElementById('timer-result');
    timerResultElement.textContent = responseMessage;
    console.log(responseMessage);
    

  } else {
    responseMessage = 'You have already completed 8.5 hours of work for today.';
    var timerResultElement = document.getElementById('timer-result');
    timerResultElement.textContent = responseMessage;

  }
}
