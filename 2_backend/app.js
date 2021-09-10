const express = require('express');
const cors = require('cors');

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Data
let users = [];

//SEND all registering users
app.get('/api/users', (req, res) => {
  res.json(users);
});

//SEND all working hours
app.get('/workingHours', (req, res) => {
  let workingHours = [];
  for (i = 8; i < 17; i++) {
    workingHours.push(i < 10 ? `0${i}:00` : `${i}:00`);
    workingHours.push(i < 10 ? `0${i}:30` : `${i}:30`);
  }
  res.json(workingHours);
});

//POST
app.post('/api/users', (req, res) => {
  //   -- validation for chosen time
  if (!req.body.name || !req.body.email || !req.body.number) {
    res.status(400).json({
      message: 'Please fill in all the fields!',
    });
    return;
  }

  //if validation passes and chosen time is free
  let user = {
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    data: req.body.data,
    time: req.body.time,
  };
  users.push(user);

  res.json({
    users: users,
    message: 'Your appointment registered!',
  });
});

//Starting server
app.listen(5000, () => console.log('Server is running on 5000'));
