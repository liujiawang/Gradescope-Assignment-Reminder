window.onload = () => {
  // "Add to Calendar" button
  var addToCalendarFaIcon = document.createElement("i");
  addToCalendarFaIcon.id = "addToCalendarFaIcon";
  addToCalendarFaIcon.className = "fa fa-calendar-plus-o";
  addToCalendarFaIcon.setAttribute("aria-hidden", "true");

  var addToCalendarFaIconDiv = document.createElement("div");
  addToCalendarFaIconDiv.id = "addToCalendarFaIconDiv";
  addToCalendarFaIconDiv.className = "sidebar--menuItemIcon";
  addToCalendarFaIconDiv.appendChild(addToCalendarFaIcon);

  var addToCalendarLabelDiv = document.createElement("div");
  addToCalendarLabelDiv.id = "addToCalendarLabelDiv";
  addToCalendarLabelDiv.textContent = "Add to Calender";
  addToCalendarLabelDiv.className = "sidebar--menuItemLabel";

  var addToCalendarAnchor = document.createElement("a");
  addToCalendarAnchor.id = "addToCalendarAnchor";
  addToCalendarAnchor.target = "_blank";
  addToCalendarAnchor.appendChild(addToCalendarFaIconDiv);
  addToCalendarAnchor.appendChild(addToCalendarLabelDiv);

  var addToCalendarListItem = document.createElement("li");
  addToCalendarListItem.className = "sidebar--menuItem";
  addToCalendarListItem.appendChild(addToCalendarAnchor);

  document.querySelector(".sidebar--menu").append(addToCalendarListItem);

  addToCalendarAnchor.addEventListener("click", () => getStatus());

  // declare an object to store the key, value pair: {assignment name: [on time due date, late due date]}
  var assignmentDueDateObject = {};
  
  var courseTitle;

  // TODO: need to work on this in the convertDateAndTime() function
  // declare a set for tracking if the assignment has time left
  // will be used to determine the year in the convertDateAndTime() function
  var timeRemainingSet = new Set();

  function getStatus() {
    // only "no submission" assignments have "submissionStatus--text" class
    var textStatus = document.getElementsByClassName("submissionStatus--text");
    // var searchValue = "No Submission";   // no need to check "No Submission" --> can consider deleting

    for (var i = 0; i < textStatus.length; i++) {
      var currentRow = textStatus[i].parentNode.parentElement;
      // extract assignment name
      var assignmentName =
        currentRow.querySelectorAll('[role="rowheader"]')[0].innerText;
      // extract submission time nodes (could contain late submission due date)
      var submissionTime = currentRow.querySelectorAll(
        ".submissionTimeChart--dueDate"
      );
      var dueDate = []; // [on time due date, late due date]
      if (submissionTime[0] != undefined) {
        dueDate.push(submissionTime[0].innerText);
      }
      // The assignment has late due dates
      if (submissionTime.length > 1) {
        dueDate.push(submissionTime[1].innerText);
      }
      // if the assignment has time remaining, add to the set
      var timeRemaining = currentRow.querySelectorAll(
        ".submissionTimeChart--timeRemaining"
      );
      if (timeRemaining != undefined) {
        timeRemainingSet.add(assignmentName);
      }
      // add assignments and due date to the object
      if (assignmentName[0] != undefined && dueDate[0] != undefined) {
        assignmentDueDateObject[assignmentName] = dueDate;
      }

      // add course title
      courseTitle = document.querySelector(".courseHeader--title").innerText;

    }
    console.log(assignmentDueDateObject);
    console.log(timeRemainingSet);
    console.log(courseTitle);
    createFile();
  }

  var icsFile = null;
  var iCalendar = ""; // iCalendar in format of string

  function createFile() {
    // add beginning to iCalendar
    iCalendar =
      "BEGIN:VCALENDAR\n" +
      "CALSCALE:GREGORIAN\n" +
      "METHOD:PUBLISH\n" +
      "PRODID:-//Test Cal//EN\n" +
      "VERSION:2.0\n";

    // add each assignment to calendar
    Object.entries(assignmentDueDateObject).forEach(([key, value]) => {
      // add the normal due date
      iCalendar += singleEventHelper(
        { start: convertDateAndTime(value[0]) },
        courseTitle + " " + key,
        "Your assignment " + key + " in "+ courseTitle +" is due on this day."
        )

      if (value[1] != undefined ){
        iCalendar += singleEventHelper(
          { start: convertDateAndTime(value[1]) },
          courseTitle + " " + key,
          "Your assignment " + key + " in "+ courseTitle +" is late due on this day."
          )
      }

    });
    
    // add ending to iCalendar
    iCalendar += "END:VCALENDAR";
    addToCalendarAnchor.href = makeIcsFile();
    // download text as ics file
    addToCalendarAnchor.download = "event.ics";
  }

  // note: each event needs to have a unique uid, so we use description here as uid
  function singleEventHelper(date, summary, description) {
    var icsEvent =
      "BEGIN:VEVENT\n" +
      "UID:" +
      description +
      "\n" +
      "DTSTART;VALUE=DATE:" +
      date.start +
      "\n" +
      "DURATION:PT15M" +
      "\n" +
      "SUMMARY:" +
      summary +
      "\n" +
      "DESCRIPTION:" +
      description +
      "\n" +
      "END:VEVENT\n";
    return icsEvent;
  }

  // create a new ics file
  function makeIcsFile() {
    var blob = new File([iCalendar], { type: "text/plain" });
    if (icsFile !== null) {
      window.URL.revokeObjectURL(icsFile);
    }
    icsFile = window.URL.createObjectURL(blob); // create a new blob and attach to href in createFile
    return icsFile;
  }
};

// map month abbreviation to numerical month
var monthMap = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};

const ON_TIME_DUE_DATE_ARRAY_LENGTH = 4;

function convertDateAndTime(date) {
  // get today's year and month
  let today = new Date();
  let todayYear = today.getFullYear();

  let dateArray = date.split(" ");
  let year, month, day, time, reformattedDate;
  // normal due date
  if (dateArray.length == ON_TIME_DUE_DATE_ARRAY_LENGTH) {
    month = monthMap[dateArray[0]];
    day = dateArray[1];
    time = dateArray[3];
    minute = time.split(":")[1].slice(0, 2);
    if (time.slice(-2) == "PM") {
      hour = String(Number(time.split(":")[0]) + 12);
    } else {
      hour = time.split(":")[0];
    }
    // late due date
  } else {
    month = monthMap[dateArray[3]];
    day = dateArray[4];
    time = dateArray[6];
    minute = time.split(":")[1].slice(0, 2);
    if (time.slice(-2) == "PM") {
      hour = String(Number(time.split(":")[0]) + 12);
    } else {
      hour = time.split(":")[0];
    }
  }

  // TODO: need to reconsider which year to use

  reformattedDate = todayYear + month + day + "T" + hour + minute + "00";
  console.log(reformattedDate);
  return reformattedDate;
}
