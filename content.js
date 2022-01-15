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
      dueDate.push(submissionTime[0].innerText);
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
  }
};
