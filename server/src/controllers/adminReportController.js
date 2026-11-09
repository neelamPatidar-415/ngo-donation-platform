
import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";

const escapeCSV = (value) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

const sendCSV = (res, filename, headers, rows) => {
  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\r\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send("\uFEFF" + csv);
};

// Dashboard report
export const getDonationReport = async (req, res, next) => {
  try {
    const [summary, campaignStats, recentDonations] = await Promise.all([
      Donation.aggregate([
        { $match: { paymentStatus: "SUCCESS" } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalDonations: { $sum: 1 },
            averageDonation: { $avg: "$amount" },
          },
        },
      ]),
      Donation.aggregate([
        { $match: { paymentStatus: "SUCCESS" } },
        {
          $group: {
            _id: "$campaign",
            totalAmount: { $sum: "$amount" },
            donationCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: Campaign.collection.name,
            localField: "_id",
            foreignField: "_id",
            as: "campaign",
          },
        },
        { $unwind: { path: "$campaign", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            campaignId: "$campaign.campaignId",
            title: "$campaign.title",
            totalAmount: 1,
            donationCount: 1,
          },
        },
      ]),
      Donation.find({ paymentStatus: "SUCCESS" })
        .populate("donor", "name email pan")
        .populate("campaign", "campaignId title")
        .sort({ paidAt: -1 })
        .limit(100)
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        summary: summary[0] || {
          totalAmount: 0,
          totalDonations: 0,
          averageDonation: 0,
        },
        campaignStats,
        recentDonations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Export successful donations as CSV
export const exportDonationCSV = async (req, res, next) => {
  try {
    const donations = await Donation.find({ paymentStatus: "SUCCESS" })
      .populate("donor", "name email pan")
      .populate("campaign", "campaignId")
      .sort({ paidAt: -1 })
      .lean();

    const headers = [
      "Donation ID",
      "Donor Name",
      "Donor Email",
      "Donor PAN",
      "Campaign ID",
      "Amount INR",
      "Frequency",
      "Payment Reference",
      "Payment Date",
    ];

    const rows = donations.map((d) => [
      d._id,
      d.donorName || d.donor?.name,
      d.donor?.email,
      d.donorPan || d.donor?.pan,
      d.campaign?.campaignId,
      d.amount,
      d.frequency,
      d.razorpayPaymentId,
      d.paidAt?.toISOString(),
    ]);

    sendCSV(res, "donation-report.csv", headers, rows);
  } catch (error) {
    next(error);
  }
};

// Form 10BD preparation export — not a filed return
export const exportForm10BDData = async (req, res, next) => {
  try {
    const donations = await Donation.find({ paymentStatus: "SUCCESS" })
      .populate("donor", "name email pan")
      .sort({ paidAt: 1 })
      .lean();

    const headers = [
      "Donor Name",
      "Donor PAN",
      "Donation Date",
      "Donation Amount",
      "Mode of Receipt",
      "Donation Reference",
      "Donor Address",
      "Donation Type",
    ];

    const rows = donations.map((d) => [
      d.donorName || d.donor?.name,
      d.donorPan || d.donor?.pan,
      d.paidAt?.toISOString().slice(0, 10),
      d.amount,
      "Electronic",
      d.razorpayPaymentId,
      "", // Address not currently collected
      d.frequency,
    ]);

    sendCSV(res, "form-10bd-preparation.csv", headers, rows);
  } catch (error) {
    next(error);
  }
};
