import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]  
});

const User = mongoose.model('User', userSchema);

export default User;
