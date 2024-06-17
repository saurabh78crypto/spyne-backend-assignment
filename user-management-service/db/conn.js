import mongoose from 'mongoose';

const  { CON_URL } = process.env

mongoose.connect(CON_URL)
.then(() => {
    console.log('Connection Successful');
}).catch((err) => console.log('Connection Unsuccessful'));
    
