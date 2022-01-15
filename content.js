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

  function getStatus() {
    // only "no submission" assignments have "submissionStatus--text" class
    var textStatus = document.getElementsByClassName("submissionStatus--text");
    // var searchValue = "No Submission";   // no need to check "No Submission" --> can consider deleting

    // declare an object to store the key, value pair: {assignment name: [on time due date, late due date]}
    var assignmentDueDateObject = {};

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
      // add assignments and due date to the object
      if (assignmentName[0] != undefined && dueDate[0] != undefined) {
        assignmentDueDateObject[assignmentName] = dueDate;
      }
    }
    console.log(assignmentDueDateObject);
    createFile();
  }


var icsFile = null;
var iCalendar =  "";

function createFile() {
  iCalendar = 
  "BEGIN:VCALENDAR\n" +
"CALSCALE:GREGORIAN\n" +
"METHOD:PUBLISH\n" +
"PRODID:-//Test Cal//EN\n" +
"VERSION:2.0\n";
  
  iCalendar += singleEventHelper({start: "20220114", end: "20220114"}, "test summary", "test desc");
  iCalendar += singleEventHelper({start: "20220115", end: "20220115"}, "test summary2", "test desc2");
  iCalendar += singleEventHelper({start: "20220116", end: "20220116"}, "test summary3", "test desc3");
  iCalendar += singleEventHelper({start: "20220116", end: "20220116"}, "test summary4", "test desc4");

  // add ending to iCalendar
  iCalendar += "END:VCALENDAR";
  addToCalendarAnchor.href = makeIcsFile();
  addToCalendarAnchor.download = "event.ics";
}

// note: each event needs to have a unique uid
function singleEventHelper(date, summary, description){
  var icsEvent = 
  "BEGIN:VEVENT\n" +
  "UID:" + summary + "\n" +
  "DTSTART;VALUE=DATE:" +
  date.start +
  "\n" +
  "DTEND;VALUE=DATE:" +
  date.end +
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

function makeIcsFile() {
  var blob = new File([iCalendar], { type: "text/plain" });
  if (icsFile !== null) {
    window.URL.revokeObjectURL(icsFile);
  }
  icsFile = window.URL.createObjectURL(blob);
  return icsFile;
}
};
