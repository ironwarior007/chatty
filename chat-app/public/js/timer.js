function submitForm() {
  var field1Value = document.getElementById('field1').value;
  var field2Value = document.getElementById('field2').value;
  var field3Value = document.getElementById('field3').value;

  var punchinBeforeLunch = parseTime(field1Value);
  var punchoutBeforeLunch = parseTime(field2Value);
  var punchinAfterLunch = parseTime(field3Value);

  var totalWorkTimeBeforeLunch = calculateDuration(
    punchinBeforeLunch,
    punchoutBeforeLunch
  );
  var totalWorkTimeAfterLunch = calculateDuration(
    punchinAfterLunch,
    getCurrentTime()
  );
  var totalWorkTime = addDurations(
    totalWorkTimeBeforeLunch,
    totalWorkTimeAfterLunch
  );

  var timeFormatted = formatDuration(totalWorkTime);
  var [hours, minutes] = timeFormatted.split(':');
  var totalTime = {
    hours: parseInt(hours),
    minutes: parseInt(minutes),
  };

  var responseMessage;
  if (compareDurations(totalTime, { hours: 8, minutes: 30 }) < 0) {
    var timeRemaining = subtractDurations({ hours: 8, minutes: 30 }, totalTime);
    var timeRemainingStr = formatDuration(timeRemaining);

    var now = getCurrentTime();
    var duration = {
      hours: timeRemaining.hours,
      minutes: timeRemaining.minutes,
    };
    var futureTime = addDuration(now, duration);
    var futureTimeStr = formatTime(futureTime);

    responseMessage =
      'Time remaining to complete 8.5 hours: ' +
      timeRemainingStr +
      '\nNext time: ' +
      futureTimeStr;
  } else {
    responseMessage = 'You have already completed 8.5 hours of work for today.';
  }

  console.log(responseMessage);

  var timerResultElement = document.getElementById('timer-result');
  timerResultElement.textContent = responseMessage;
}

function parseTime(timeString) {
  var parts = timeString.split(':');
  var hours = parseInt(parts[0]);
  var minutes = parseInt(parts[1]);
  return {
    hours: hours,
    minutes: minutes,
  };
}

function calculateDuration(startTime, endTime) {
  var startMinutes = startTime.hours * 60 + startTime.minutes;
  var endMinutes = endTime.hours * 60 + endTime.minutes;
  var durationMinutes = endMinutes - startMinutes;
  return {
    hours: Math.floor(durationMinutes / 60),
    minutes: durationMinutes % 60,
  };
}

function getCurrentTime() {
  var now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };
}

function formatDuration(duration) {
  var hours = padZero(duration.hours);
  var minutes = padZero(duration.minutes);
  return hours + ':' + minutes;
}

function padZero(num) {
  return num < 10 ? '0' + num : num;
}

function compareDurations(duration1, duration2) {
  if (duration1.hours !== duration2.hours) {
    return duration1.hours - duration2.hours;
  } else {
    return duration1.minutes - duration2.minutes;
  }
}

function subtractDurations(duration1, duration2) {
  var totalMinutes1 = duration1.hours * 60 + duration1.minutes;
  var totalMinutes2 = duration2.hours * 60 + duration2.minutes;
  var resultMinutes = totalMinutes1 - totalMinutes2;
  return {
    hours: Math.floor(resultMinutes / 60),
    minutes: resultMinutes % 60,
  };
}

function addDurations(duration1, duration2) {
  var totalMinutes1 = duration1.hours * 60 + duration1.minutes;
  var totalMinutes2 = duration2.hours * 60 + duration2.minutes;
  var totalMinutes = totalMinutes1 + totalMinutes2;
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

function addDuration(time, duration) {
  var totalMinutes =
    time.hours * 60 + time.minutes + duration.hours * 60 + duration.minutes;
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

function formatTime(time) {
  var hours = time.hours % 12 || 12; // Convert to 12-hour format
  var minutes = padZero(time.minutes);
  var period = time.hours >= 12 ? 'PM' : 'AM';
  return hours + ':' + minutes + ' ' + period;
}