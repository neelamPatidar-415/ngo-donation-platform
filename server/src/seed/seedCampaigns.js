
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Campaign from "../models/Campaign.js";

const campaigns = [
  {
    campaignId: "CMP-001",
    title: {
      en: "Women's Livelihood Support",
      hi: "महिलाओं की आजीविका सहायता",
    },
    summary: {
      en: "Support women in building sustainable sources of income.",
      hi: "महिलाओं को आय के स्थायी साधन बनाने में सहयोग दें।",
    },
    description: {
      en: "An illustrative campaign supporting livelihood opportunities and skill development for women.",
      hi: "महिलाओं के लिए आजीविका के अवसरों और कौशल विकास में सहयोग देने वाला एक उदाहरण अभियान।",
    },
    category: "Livelihood",
    goalAmount: 500000,
    raisedAmount: 125000,
    status: "ACTIVE",
    impact: {
      en: "Intended to support livelihood and skill-development activities.",
      hi: "आजीविका और कौशल विकास गतिविधियों में सहयोग का उद्देश्य।",
    },
  },
  {
    campaignId: "CMP-002",
    title: {
      en: "Women's Health Awareness",
      hi: "महिला स्वास्थ्य जागरूकता",
    },
    summary: {
      en: "Help improve access to health awareness and education.",
      hi: "स्वास्थ्य जागरूकता और शिक्षा तक पहुंच बेहतर बनाने में मदद करें।",
    },
    description: {
      en: "An illustrative campaign focused on women's health awareness and community education.",
      hi: "महिला स्वास्थ्य जागरूकता और सामुदायिक शिक्षा पर केंद्रित एक उदाहरण अभियान।",
    },
    category: "Health",
    goalAmount: 300000,
    raisedAmount: 90000,
    status: "ACTIVE",
    impact: {
      en: "Intended to support awareness and educational activities.",
      hi: "जागरूकता और शैक्षिक गतिविधियों में सहयोग का उद्देश्य।",
    },
  },
  {
    campaignId: "CMP-003",
    title: {
      en: "Education Support for Girls",
      hi: "बालिकाओं की शिक्षा में सहयोग",
    },
    summary: {
      en: "Contribute towards educational opportunities for girls.",
      hi: "बालिकाओं के लिए शैक्षिक अवसरों में योगदान दें।",
    },
    description: {
      en: "An illustrative campaign to support access to learning resources and educational activities.",
      hi: "शिक्षण संसाधनों और शैक्षिक गतिविधियों तक पहुंच में सहयोग देने वाला एक उदाहरण अभियान।",
    },
    category: "Education",
    goalAmount: 400000,
    raisedAmount: 150000,
    status: "ACTIVE",
    impact: {
      en: "Intended to support educational resources and activities.",
      hi: "शैक्षिक संसाधनों और गतिविधियों में सहयोग का उद्देश्य।",
    },
  },
];

const seedCampaigns = async () => {
  try {
    await connectDB();

    for (const campaign of campaigns) {
      await Campaign.updateOne(
        { campaignId: campaign.campaignId },
        { $set: campaign },
        { upsert: true, runValidators: true }
      );
    }

    console.log("Campaigns seeded successfully.");
  } catch (error) {
    console.error("Campaign seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedCampaigns();
