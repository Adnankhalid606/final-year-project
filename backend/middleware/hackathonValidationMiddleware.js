/**
 * Standardize client-facing validation errors for hackathon payload checks.
 */
const sendValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

/**
 * Validate date values before database writes.
 * Prevents malformed schedule fields from reaching persistence and query logic.
 */
const isValidDate = (value) => {
  if (!value) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

/**
 * Validate optional external registration links.
 * Empty values are allowed, but malformed URLs are rejected.
 */
const isValidUrl = (value) => {
  if (!value) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Shared hackathon payload validation
 * Enforces required fields and schedule rules for both create and update operations.
 * Rejects invalid data before controller execution to keep database records consistent.
 */
const validateHackathonPayload = (req, res, next) => {
  const { title, description, registration_link: registrationLink, start_date: startDate, end_date: endDate } =
    req.body;

  if (!title || !String(title).trim()) {
    return sendValidationError(res, "Title is required");
  }

  if (!description || !String(description).trim()) {
    return sendValidationError(res, "Description is required");
  }

  if (!isValidUrl(registrationLink)) {
    return sendValidationError(res, "Registration link must be a valid URL");
  }

  if (!isValidDate(startDate)) {
    return sendValidationError(res, "Start date must be a valid date");
  }

  if (!isValidDate(endDate)) {
    return sendValidationError(res, "End date must be a valid date");
  }

  if (new Date(endDate) <= new Date(startDate)) {
    return sendValidationError(res, "End date must be after start date");
  }

  next();
};

/**
 * Create validation middleware
 * Applied to new hackathon submissions.
 */
export const validateCreateHackathon = validateHackathonPayload;

/**
 * Update validation middleware
 * Reuses the same business rules for edited hackathon listings.
 */
export const validateUpdateHackathon = validateHackathonPayload;
