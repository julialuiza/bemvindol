import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String },
  last_name: { type: String },
  birth_date: { type: String },
  sex: { type: String},
  cpf: { type: String},
  rg: { type: String}, 
  cep: String,
  adress: String,
  adress_number: Number,
  adress_district: String,
  adress_city: String,
  adress_state: String,
  email: {type: String},
  phone_number: {type:String},
  telephone_number: {type:String},
  password: {type: String}, 
})

export default mongoose.models.User || mongoose.model('User', UserSchema)