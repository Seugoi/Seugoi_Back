const express = require('express');
const app = express();
const port = 3008;
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');

app.use('/user', userRouter);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });