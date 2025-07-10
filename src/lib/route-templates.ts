
import React from "react";
import { Facebook } from "lucide-react";
import { GoogleIcon, TikTokIcon } from "@/components/icons";

export interface RouteTemplate {
    id: string;
    name: string;
    icon: React.ReactNode;
    slug: string;
    blockedIps: string[];
    blockedUserAgents: string[];
    allowedCountries: string[];
    blockFacebookBots: boolean;
    aiMode: boolean;
    enableEmergency: boolean;
}

export const ROUTE_TEMPLATES: RouteTemplate[] = [
    {
        id: "facebook",
        name: "Facebook Ads",
        icon: React.createElement(Facebook, { className: "text-blue-600" }),
        slug: "fb-campanha-xyz",
        blockedIps: [
            "66.220.144.0/20",
            "69.63.176.0/20",
            "69.171.224.0/19",
            "157.240.0.0/16",
        ],
        blockedUserAgents: [
            "facebookexternalhit",
            "Facebot",
            "FacebookBot",
            "crawler",
            "AdsBot-Facebook",
            "Mozilla/5.0 (compatible; AdsBot/1.0; +http://www.facebook.com/)",
        ],
        allowedCountries: ["BR", "PT"],
        blockFacebookBots: true,
        aiMode: true,
        enableEmergency: true,
    },
    {
        id: "google",
        name: "Google Ads",
        icon: React.createElement(GoogleIcon),
        slug: "google-campanha-xyz",
        blockedIps: [
            "66.249.64.0/19",
            "64.233.160.0/19",
            "72.14.192.0/18"
        ],
        blockedUserAgents: [
            "Googlebot",
            "AdsBot-Google",
            "Googlebot-Image",
            "Googlebot-News",
            "Mediapartners-Google",
            "Mozilla/5.0 (Linux; Android...) AppleWebKit/... (compatible; Google AdsBot)",
        ],
        allowedCountries: ["BR", "AR", "CL"],
        blockFacebookBots: false,
        aiMode: true,
        enableEmergency: true,
    },
    {
        id: "tiktok",
        name: "TikTok Ads",
        icon: React.createElement(TikTokIcon),
        slug: "tiktok-campanha-abc",
        blockedIps: [
            "47.246.0.0/16",
            "203.0.113.0/24"
        ],
        blockedUserAgents: [
            "TikTokBot",
            "ByteDanceSpider",
            "AdsBot-TikTok",
            "Mozilla/5.0 (compatible; TikTokBot/1.0; +http://www.tiktok.com/bot.html)",
        ],
        allowedCountries: ["BR", "MX"],
        blockFacebookBots: false,
        aiMode: true,
        enableEmergency: true,
    },
];
