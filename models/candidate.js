const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
const CandidateSchema = new Schema ({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    id_number: {
        type: String,
        required: true,
    },
    home_address: {
        type: String,
        required: true,
    },
    descpription: {
        type: String,
        required: true,
    },
    election_address: {
        type: String,
        required: true
    }
});
// hash user password before saving into database
CandidateSchema.pre('save', function(cb) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    cb();
});
module.exports = mongoose.model('CandidateList', CandidateSchema)