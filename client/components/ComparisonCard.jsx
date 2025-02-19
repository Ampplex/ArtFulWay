import React from 'react';
import { Check, X } from 'lucide-react';

function ComparisonCard() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Traditional Platforms Card */}
      <div className="p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
        <h3 className="text-lg font-semibold text-gray-400 mb-4">Traditional Platforms</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>Manual project searching and bidding wars</span>
          </li>
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>Success based solely on review numbers</span>
          </li>
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>Limited growth opportunities beyond freelancing</span>
          </li>
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>Basic portfolio displays without AI enhancement</span>
          </li>
          <li className="flex items-start gap-3 text-gray-400">
            <X className="text-red-400 mt-1 w-5 h-5" />
            <span>Focus on transactions over artist development</span>
          </li>
        </ul>
      </div>

      {/* ArtfulWay Advantage Card */}
      <div className="p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">ArtfulWay Advantage</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>AI-powered project matching with instant notifications</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Skill-based opportunities with verified quality assurance</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Career paths including full-time positions and partnerships</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>AI-enhanced portfolios with market insights</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Comprehensive artist development program and mentorship</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Advanced AI tools for businesses: ad generation, targeting, and analytics</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Educational resources: guides, training, and AI portfolio-building tools</span>
          </li>
          <li className="flex items-start gap-3 text-gray-200">
            <Check className="text-green-400 mt-1 w-5 h-5" />
            <span>Specialized talent pool for niche creative fields</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ComparisonCard;