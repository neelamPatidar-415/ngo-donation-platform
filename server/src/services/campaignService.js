
import Campaign from "../models/Campaign.js";

export const getActiveCampaigns = async ({ category, page = 1, limit = 9 }) => {
  const filter = { status: "ACTIVE" };

  if (category) {
    filter.category = category;
  }

  const skip = (page - 1) * limit;

  const [campaigns, total] = await Promise.all([
    Campaign.find(filter)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Campaign.countDocuments(filter),
  ]);

  return {
    campaigns,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCampaignDetails = async (campaignId) => {
  return Campaign.findOne({
    campaignId,
    status: "ACTIVE",
  }).select("-__v").lean();
};

