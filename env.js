require('dotenv').config();
const {DB_HOST, SECRET_KEY, SEND_GRID_API_KEY,PORT} = process.env

module.exports = {
    DB_HOST, SECRET_KEY, SEND_GRID_API_KEY,PORT
}