"use strict";
const markyourcalendarObj = ((p_availability) => {
  let l_currentDate = new Date();
  const selectedDateObjects = [];
  $("#picker").markyourcalendar({
    serverData: p_availability,
    availability: [
      ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
    ],
    startDate: new Date(
      l_currentDate.getFullYear(),
      l_currentDate.getMonth(),
      l_currentDate.getDate()
    ),
    isMultiple: true,
    weekdays: ["sun", "mon", "tue", "wed", "thurs", "fri", "sat"],
    hideSlots: function (p_date) {
      if (
        p_date.getDay() == 0 ||
        p_date.getDay() == 6 ||
        p_date <
          new Date(
            l_currentDate.getFullYear(),
            l_currentDate.getMonth(),
            l_currentDate.getDate()
          )
      ) {
        return true;
      }
      return false;
    },
    setSlotTaken: function (p_date, p_time) {
      let l_filter = this.serverData.filter(function (item) {
        let l_date = new Date(item.date),
          l_time = item.time;
        if (p_date.getTime() == l_date.getTime() && p_time == l_time) {
          return true;
        }
      });
      if (l_filter.length) {
        return " cls-a-disable";
      } else {
        return "";
      }
    },
    onClick: function (ev, data, dataObject) {
      selectedDateObjects.length = 0;
      selectedDateObjects.push(...dataObject);
    },
    onClickNavigator: function (ev, instance) {
      instance.setAvailability([
        ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      ]);
    },
  });
  return { selectedDateObjects };
})(l_availability);

function submitAppointments() {
  let data = markyourcalendarObj.selectedDateObjects.map((item) => {
    return {
      ...item,
      date: item.date,
    };
  });
  fetch("/appointment", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ data_appointments: data }),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
