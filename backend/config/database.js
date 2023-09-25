
const mongoose = require('mongoose');

const connectDatabase = () => {

    mongoose.connect(process.env.DB_LOCAL_URI,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con => {
        console.log(`DB Connected with host: ${con.connection.host}`);
    }).catch(error => {
        console.error('DB Connection Error:', error);
    });
}

module.exports = connectDatabase;
