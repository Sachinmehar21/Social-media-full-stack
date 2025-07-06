const mongoose = require('mongoose');

const uri = 'mongodb+srv://sachinmehar:sachin@clusterx.8b5ja9l.mongodb.net/x?retryWrites=true&w=majority&appName=Clusterx';

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('Connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  }); 