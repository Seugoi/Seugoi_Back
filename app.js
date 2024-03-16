const express = require('express');
const app = express();
const port = 3008;
const userRouter = require('./routes/user');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});