import React from 'react';
import { Check, X } from 'lucide-react';

function ClientComparisonCard() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Traditional Platforms Card */}
      <div className="p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
        <h3 className="text-lg font-semibold text-gray-400 mb-4">Traditional Platforms</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>Manual talent search with no quality assurance</span>
          </li>
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>Limited access to specialized talent pools</span>
          </li>
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>No AI tools for ad generation or performance analytics</span>
          </li>
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>Time-consuming project posting and artist selection</span>
          </li>
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>No dedicated support for client satisfaction</span>
          </li>
        </ul>
      </div>

      {/* ArtfulWay Advantage Card */}
      <div className="p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">ArtfulWay Advantage</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>AI-powered talent matching with verified quality assurance</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Access to a specialized talent pool for niche creative fields</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Advanced AI tools for ad generation, targeting, and analytics</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Efficient project posting with instant artist notifications</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Dedicated quality assurance team for client satisfaction</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Analytics dashboard for tracking ad performance and optimization</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Subscription plans for premium tools and services</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Partnership opportunities for exclusive hiring</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ClientComparisonCard;