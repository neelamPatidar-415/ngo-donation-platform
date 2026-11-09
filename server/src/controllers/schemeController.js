import {
  getPublishedSchemes,
  getSchemeById,
  getSchemeFilters,
} from "../services/schemeService.js";

export const getSchemes = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 9));

    const result = await getPublishedSchemes({
      need: req.query.need,
      district: req.query.district,
      search: req.query.search?.trim(),
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchemeDetails = async (req, res, next) => {
  try {
    const scheme = await getSchemeById(req.params.schemeId);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

export const getFilters = async (req, res, next) => {
  try {
    const filters = await getSchemeFilters();

    res.status(200).json({
      success: true,
      data: filters,
    });
  } catch (error) {
    next(error);
  }
};