/*
Užduotis 2021-07-05 paskaitos, antrai daliai:
 
Sukurkite automobilio rezervacijos plovimui SU AKCIJA komponentą, kuris veiks kaip forma, kurioje vartotojas galės nurodyti:
Vardą ir pavardę;
El. paštą;
Telefono numerį:

Pasirinkti:	
metus (tik 2021);	
mėnesį (tik Liepos);	
dieną (nuo 1 iki 31);		
laiką:
				
valanda (nuo 8:00 iki 16:00)
			
minutes (su 30 min intervalu)
		
Vartotjui pateikus formą, ji bus užregistruojama Backende esančiama pvz. masyve su datų objektais, o kitiems lankytojams jau nebus galima rezervuoti pasidinktos valandos arba jeigi visos valandos užimtos dienos. 

Informaciją apie galimas dienas ir valandas sistema turės imti iš backend'o. 

*/

//Variables
//API
const USERS_URI = 'http://localhost:5000/api/users';
const WORKING_HOURS = 'http://localhost:5000/workingHours';

//DOM Elements
const formElement = document.querySelector('#booking-form');
const appointmentDate = document.querySelector('#appointmentDate');
const appointmentTime = document.querySelector('#appointmentTime');
const successErrorMSG = document.querySelector('#successErrorMSG');
const appointmentTimeOptions = document.querySelector(
  '#appointmentTimeOptions'
);
// Logic
let appointments = [];

//GET all appointments
const getAllAppointments = () => {
  return fetch(USERS_URI)
    .then((res) => res.json())
    .then((data) => {
      appointments = data;
      console.log(appointments);

      //change events
      appointmentDate.addEventListener('change', () => {
        validateTime();
      });
      appointmentTime.addEventListener('change', () => {
        validateTime();
      });
    });
};

//GET all working hours
const getAllTimes = () => {
  return fetch(WORKING_HOURS)
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data);
      populateTimeOptions(data);
    });
};

const populateTimeOptions = (hoursArray) => {
  appointmentTimeOptions.innerHTML = hoursArray.reduce((total, currentHour) => {
    total += `
    <option value=${currentHour}></option>
    `;

    return total;
  }, '');
};

//POST method - submitting registration form
const sendData = (e) => {
  e.preventDefault();

  validateTime();
  if (validateTime() === false) {
    successErrorMSG.innerText = 'Please choose different time!';
    return;
  }

  let user = {
    name: e.target.fullName.value,
    email: e.target.email.value,
    number: e.target.mobileNumber.value,
    data: e.target.appointmentDate.value,
    time: e.target.appointmentTime.value,
  };

  fetch(USERS_URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      successErrorMSG.innerText = data.message;
      formElement.reset();
    })
    .catch((err) => {
      console.log(err);
    });
};

const setCurrentDate = () => {
  let setTodayDate = document.getElementById('appointmentDate');

  let now = new Date();
  let currentDate = [
    now.getFullYear(),
    `-${now.getMonth() < 10 ? '0' : ''}`,
    now.getMonth() + 1,
    `-${now.getDate() < 10 ? '0' : ''}`,
    now.getDate(),
  ].join('');
  console.log(currentDate);
  setTodayDate.value = currentDate;
  setTodayDate.min = currentDate;
};

const validateTime = () => {
  for (user of appointments) {
    if (
      user.data === appointmentDate.value &&
      user.time === appointmentTime.value
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'This time is already taken!',
      });
      successErrorMSG.innerText = 'Please choose different time!';
      return false;
    }
  }
  return true;
};

//------------ Events -----------------------

formElement.addEventListener('submit', sendData);

document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
  getAllAppointments();
  getAllTimes();
});
