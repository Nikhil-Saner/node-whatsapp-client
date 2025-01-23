const Role = require('../models/Role'); // Import Role model

// Middleware to check if user has the required role
function checkRole(requiredRole) {
  return async (req, res, next) => {
    try {
      const user = await req.user; // Assuming user info is in req.user (set by JWT middleware)

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userRole = await Role.findOne({ where: { role_name: user.role } });

      if (!userRole || userRole.role_name !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
      }

      // If the user has the required role, proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

module.exports = checkRole;
