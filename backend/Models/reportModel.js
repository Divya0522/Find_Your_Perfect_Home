const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    default: "", 
  },
  property_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;