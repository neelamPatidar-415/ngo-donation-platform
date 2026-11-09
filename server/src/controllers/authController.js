
import { registerDonor, loginDonor } from "../services/authService.js";

export const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

export const register = async (req, res, next) => {
  try {
    const result = await registerDonor(req.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginDonor(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
