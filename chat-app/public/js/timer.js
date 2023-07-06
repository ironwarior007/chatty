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

function validateTime(timeString) {
  // Regular expression to match 12-hour time format
  var regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;

  return regex.test(timeString);
}

function submitForm(
  userName,
  punchinTime,
  punchOutBeforeLunchofoffie,
  punchinLunchAfter
) {
    
  var field1Value = validateTime(punchinTime);;
  var field2Value = validateTime(punchOutBeforeLunchofoffie);
  var field3Value = validateTime(punchinLunchAfter);
  if(!field1Value || !field2Value || !field3Value) throw new Error('getting error');
  
  const punchinBeforeLunchStr = `${punchinTime} AM`;
  const punchinBeforeLunch = getFormattedTime(punchinBeforeLunchStr);
  
  const punchoutBeforeLunchStr = `${punchOutBeforeLunchofoffie} PM`;
  const punchoutBeforeLunch = getFormattedTime(punchoutBeforeLunchStr);
  
  const punchinAfterLunchStr = `${punchinLunchAfter} PM`;
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

    return `Hey ${userName} You can go on this time ${futureTimeStr}`;
    // var timerResultElement = document.getElementById('timer-result');
    // timerResultElement.textContent = responseMessage;
    // console.log(responseMessage);
  } else {
    return `Hey ${userName} You have already completed 8.5 hours of work for today.`;
    // var timerResultElement = document.getElementById('timer-result');
    // timerResultElement.textContent = responseMessage;
  }
}
