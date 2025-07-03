const mongoose = require('mongoose');

const adminLogsSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, minlength: 3, maxlength: 200, unique: true },
    role: { type: String, default: 'admin' },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
}, {
    timestamps: true,
});

const adminLogsModel = mongoose.model("AdminLog", adminLogsSchema,'admin_logs');

module.exports = adminLogsModel;
