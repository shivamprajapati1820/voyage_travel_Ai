export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address";
  if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
};

export const validateTripForm = (form) => {
  const errors = {};
  if (!form.destination || form.destination.trim().length < 2) {
    errors.destination = "Please select a destination";
  }
  if (!form.startDate) errors.startDate = "Start date is required";
  if (!form.endDate) errors.endDate = "End date is required";
  if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
    errors.endDate = "End date must be after start date";
  }
  if (!form.budget || Number(form.budget) <= 0) errors.budget = "Enter a valid budget";
  if (!form.travelers || Number(form.travelers) < 1) errors.travelers = "At least 1 traveler required";
  return errors;
};
