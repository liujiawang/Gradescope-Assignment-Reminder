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

  var timeRemainingMap = {}; // a map of assignments that have time remaining ie. not passed due

  function getStatus() {
    // only "no submission" assignments have "submissionStatus--text" class
    var textStatus = document.getElementsByClassName("submissionStatus--text");
    var searchValue = "No Submission";

    for (var i = 0; i < textStatus.length; i++) {
      // we only want to extract the assignments that are not submitted
      if (
        textStatus[i] != undefined &&
        textStatus[i].innerText == searchValue
      ) {
        // console.log(textStatus[i]);
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
        var timeRemaining = currentRow.getElementsByClassName(
          "submissionTimeChart--timeRemaining"
        );
        if (timeRemaining.length != 0) {
          timeRemainingMap[assignmentName] = timeRemaining[0].innerText;
          // console.log("time remaining tag: ", timeRemaining[0]);
        }
        // add assignments and due date to the object
        if (assignmentName[0] != undefined && dueDate[0] != undefined) {
          assignmentDueDateObject[assignmentName] = dueDate;
        }
      }

      // add course title
      courseTitle = document.querySelector(".courseHeader--title").innerText;
    }
    // console.log(assignmentDueDateObject);
    // console.log(timeRemainingMap);
    // console.log(courseTitle);
    createFile();
    // console.log(isLaterThanToday("JAN 15 AT 6:00PM"));
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

    // --> check if in timeRemainingMap
    //          if not, it's a passed due assignment, leave it alone
    //          if so,

    // Senario 1: assignment date < current date
    //          if so, it's a next year assignment -> year ++ & should be added to calendar

    // Senario 2: assignment date > current date
    //          if so, it's a new assignment & should be added to calendar

    // add each assignment to calendar


    Object.entries(assignmentDueDateObject).forEach(([key, value]) => {

      //console.log("key, laterthan", "haskey", key, isLaterThanToday(value[0]), timeRemainingSet.has(key));
      if ((key in timeRemainingMap)) {

        if (timeRemainingMap[key].split(" ")[0] != "Closes") {
          if (!isLaterThanToday(value[0])) {
            let dt = convertDateAndTime(value[0]);
            let newyr = Number(dt[0]) + 1;
            //console.log("dt,newyr", dt, newyr);
            iCalendar += singleEventHelper(
              { start: newyr + dt[1] + dt[2] + "T" + dt[3] + dt[4] + "00" },
              "[" + courseTitle + "] " + key,
              "Your assignment " +
              key +
              " in " +
              courseTitle +
              " is due on this time."
            );
          } else {
            iCalendar += singleEventHelper(
              { start: formatDateFromList(convertDateAndTime(value[0])) },
              "[" + courseTitle + "] " + key,
              "Your assignment " +
              key +
              " in " +
              courseTitle +
              " is due on this time."
            );
          }

          if (value[1] != undefined) {
            console.log("late", timeRemainingMap[key].split(" "));
            if (timeRemainingMap[key].split(" ")[0] == "Closes") {
              if (!isLaterThanToday(value[0])) {
                let dt = convertDateAndTime(value[1]);
                let newyr = Number(dt[0]) + 1;
                //console.log("dt,newyr", dt, newyr);
                iCalendar += singleEventHelper(
                  { start: newyr + dt[1] + dt[2] + "T" + dt[3] + dt[4] + "00" },
                  "[" + courseTitle + "] " + key,
                  "Your assignment " +
                  key +
                  " in " +
                  courseTitle +
                  " is late due on this time."
                );
              } else {
                iCalendar += singleEventHelper(
                  { start: formatDateFromList(convertDateAndTime(value[1])) },
                  "[" + courseTitle + "] " + key,
                  "Your assignment " +
                  key +
                  " in " +
                  courseTitle +
                  " is late due on this time."
                );
              }

            } 
          }

        }
      }


    });

    // add ending to iCalendar
    iCalendar += "END:VCALENDAR";
    addToCalendarAnchor.href = makeIcsFile();
    // download text as ics file
    addToCalendarAnchor.download = courseTitle + " Calendar.ics";
  }

  // note: each event needs to have a unique uid, so we use description here as uid
  function singleEventHelper(date, summary, description) {
    var icsEvent =
      "BEGIN:VEVENT\n" +
      "UID:" +
      date.start +
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
    // get today's year
    let today = new Date();
    let todayYear = today.getFullYear();

    return [todayYear, month, day, hour, minute];
  }

  function formatDateFromList(dateList) {
    return dateList[0] + dateList[1] + dateList[2] + "T" + dateList[3] + dateList[4] + "00";
  }

  function isLaterThanToday(date) {
    let today = new Date();
    let assignmentDate = formatDateFromList(convertDateAndTime(date));
    console.log("converted assignment date: ", assignmentDate);
    assignmentDate =
      assignmentDate.slice(0, 4) +
      "-" +
      assignmentDate.slice(4, 6) +
      "-" +
      assignmentDate.slice(6, 11) +
      ":" +
      assignmentDate.slice(11, 13) +
      ":" +
      assignmentDate.slice(13, 15);
    assignmentDate = new Date(assignmentDate);
    // console.log("today's date", today);
    // console.log("assignment date", assignmentDate);
    return assignmentDate > today;
  }
}
