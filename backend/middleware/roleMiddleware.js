/**
 * Role-based authorization middleware
 * Runs after authentication and limits a route to one or more allowed roles.
 * Keeps learner, organizer, and admin capabilities separated at the routing layer.
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return next();
  };
};
