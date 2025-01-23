const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role'); // Import Sequelize models
const User = require('../models/User');

class AuthController {
  // Test endpoint
  test(req, res) {
    console.log("Test API called...");
    return res.status(200).send("Hello");
  }

  // Register a new user
// Register a new user
async register(req, res) {
    const { username, password, role } = req.body; // Now including role in the request body
  
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required.' });
    }
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Check if the provided role exists in the Role table
      const foundRole = await Role.findOne({ where: { role_name: role } });
      if (!foundRole) {
        return res.status(400).json({ message: 'Invalid role provided.' });
      }
  
      // Create the user, now including the role_id
      const user = await User.create({ 
        username, 
        password: hashedPassword, 
        role_id: foundRole.id // Pass the role_id of the found role
      });
  
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed.' });
    }
  }
  
// Login and generate JWT with role
async login(req, res) {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    try {
      // Fetch the user along with the role from the database
      const user = await User.findOne({
        where: { username },
        include: {
          model: Role, // Assuming the 'Role' model is properly associated with 'User'
          attributes: ['role_name'], // Include the role name
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
    //   // Ensure the user has at least one role before generating the token
    //   if (!user.roles[0] || user.Role.length === 0) {
    //     return res.status(400).json({ message: 'User does not have a role assigned.' });
    //   }
  
    //   // Get the user's role (assuming it's stored in an associated Role model)
    //   const role_name = user.Role.role_name;


    // console.log();
        // Ensure the user has at least one role before generating the token
        if (!user.Role || user.Role.length === 0) {
            return res.status(400).json({ message: 'User does not have a role assigned.' });
          }
      
          // Get the user's role (assuming it's stored in an associated Role model)
          const role = user.Role.role_name;

  
      // Generate JWT with user details and role
      const token = jwt.sign(
        { id: user.id, username: user.username, role: role }, // Include the role in the JWT payload
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed.' });
    }
  }
  

  // Example protected route: Get user profile
  async home(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username'], // Select only necessary fields
        include: {
          model: Role,
          attributes: ['role_name'], // Include roles

        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to show home page.'});
    }
  }

}

module.exports = AuthController;
