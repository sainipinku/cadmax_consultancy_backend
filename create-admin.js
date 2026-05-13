const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin.model.js');

mongoose.connect('mongodb://localhost:27017/cadmax')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if admin exists


      
      const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
      
      if (!existingAdmin) {
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin@123456', 10);
        const newAdmin = new Admin({
          email: 'admin@gmail.com',
          password: hashedPassword
        });
        
        await newAdmin.save();
        console.log('Admin created successfully!');
      } else {
        console.log('Admin already exists');
      }
      
      // Test login
      const testAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
      const isMatch = await bcrypt.compare('admin@123456', testAdmin.password);
      console.log('Password match:', isMatch);
      
    } catch (error) {
      console.error('Error:', error);
    }
    
    mongoose.connection.close();
  })
  .catch(err => console.error('MongoDB connection error:', err));
