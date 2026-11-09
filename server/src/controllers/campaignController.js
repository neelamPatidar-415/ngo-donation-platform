
import {
  getActiveCampaigns,
  getCampaignDetails,
} from "../services/campaignService.js";

export const getCampaigns = async (req, res, next) => {
  try {
    const category = req.query.category || undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 9));

    const result = await getActiveCampaigns({
      category,
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

export const getCampaign = async (req, res, next) => {
  try {
    const campaign = await getCampaignDetails(req.params.campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: { campaign },
    });
  } catch (error) {
    next(error);
  }
};

