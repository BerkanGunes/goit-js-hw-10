// CSS imports are removed since we're loading them directly in HTML
// Get references to DOM elements
const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

// Variable to store the selected date
let userSelectedDate = null;
// Variable to store interval ID
let countdownInterval = null;

// Make sure flatpickr is loaded from CDN before initializing
document.addEventListener('DOMContentLoaded', () => {
  if (typeof flatpickr === 'undefined') {
    console.error('Flatpickr is not loaded. Check network tab for errors.');
    return;
  }
  
  // Initialize flatpickr with options
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      const currentDate = new Date();

      // Check if selected date is in the future
      if (selectedDate <= currentDate) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
          position: 'topCenter',
        });
        startButton.disabled = true;
      } else {
        userSelectedDate = selectedDate;
        startButton.disabled = false;
      }
    },
  };

  // Initialize flatpickr
  flatpickr(datetimePicker, options);
});

// Function to add leading zeros to numbers
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Function to convert milliseconds to days, hours, minutes, seconds
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Function to update timer display
function updateTimerUI(timeObj) {
  daysEl.textContent = addLeadingZero(timeObj.days);
  hoursEl.textContent = addLeadingZero(timeObj.hours);
  minutesEl.textContent = addLeadingZero(timeObj.minutes);
  secondsEl.textContent = addLeadingZero(timeObj.seconds);
}

// Start countdown timer when Start button is clicked
startButton.addEventListener("click", () => {
  // Disable Start button and datetime picker once countdown starts
  startButton.disabled = true;
  datetimePicker.disabled = true;

  // Start the countdown
  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const timeRemaining = userSelectedDate - currentTime;

    // If countdown reaches zero or goes negative, stop the timer
    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    // Calculate and update the timer display
    const timeObj = convertMs(timeRemaining);
    updateTimerUI(timeObj);
  }, 1000);
});
