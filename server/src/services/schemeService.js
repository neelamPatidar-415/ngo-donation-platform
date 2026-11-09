import Scheme from "../models/Scheme.js";

export const getPublishedSchemes = async ({
  need,
  district,
  search,
  page = 1,
  limit = 9,
}) => {
  const filter = { status: "PUBLISHED" };

  if (need) filter.need = need;

  if (district) {
    filter.districts = district;
  }

  if (search) {
    filter.$or = [
      { "title.en": { $regex: search, $options: "i" } },
      { "title.hi": { $regex: search, $options: "i" } },
      { schemeId: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [schemes, total] = await Promise.all([
    Scheme.find(filter)
      .select("-eligibilityRules")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Scheme.countDocuments(filter),
  ]);

  return {
    schemes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSchemeById = async (schemeId) => {
  return Scheme.findOne({
    schemeId,
    status: "PUBLISHED",
  }).lean();
};

export const getSchemeFilters = async () => {
  const [needs, districts] = await Promise.all([
    Scheme.distinct("need", { status: "PUBLISHED" }),
    Scheme.distinct("districts", { status: "PUBLISHED" }),
  ]);

  return { needs, districts };
};