
import User from "../models/User.js";
import Scheme from "../models/Scheme.js";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";

export const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalDonors,
      totalSchemes,
      publishedSchemes,
      totalCampaigns,
      activeCampaigns,
      totalDonations,
      successfulDonations,
      donationTotals,
      recentDonations,
    ] = await Promise.all([
      User.countDocuments({ role: "DONOR" }),
      Scheme.countDocuments(),
      Scheme.countDocuments({ status: "PUBLISHED" }),
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: "ACTIVE" }),
      Donation.countDocuments(),
      Donation.countDocuments({ paymentStatus: "SUCCESS" }),
      Donation.aggregate([
        { $match: { paymentStatus: "SUCCESS" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Donation.find({ paymentStatus: "SUCCESS" })
        .populate("donor", "name email")
        .populate("campaign", "title campaignId")
        .sort({ paidAt: -1 })
        .limit(5)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalDonors,
          totalSchemes,
          publishedSchemes,
          totalCampaigns,
          activeCampaigns,
          totalDonations,
          successfulDonations,
          totalAmountRaised: donationTotals[0]?.total || 0,
        },
        recentDonations,
      },
    });
  } catch (error) {
    next(error);
  }
};
