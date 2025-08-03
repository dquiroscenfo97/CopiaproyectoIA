const mongoose = require('mongoose');

const emprendimientoSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessDescription: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  businessTelephone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  businessLocation: {
    type: String,
    required: true,
    trim: true
  },
  loginDate: {
    type: Date,
    required: true
  },
  imagen: {
    type: String,
    default: '/img/default.png'
  },
  aprobado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Emprendimiento', emprendimientoSchema);