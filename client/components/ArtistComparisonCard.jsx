import React from 'react';
import { Target, BookOpen, Zap, LineChart, Users, Award,Check, ArrowRight, Star, Rocket, Shield } from 'lucide-react';

function ArtistComparisonCard(props) {
    return (
        <div className="grid md:grid-cols-2 gap-8">
        {/* Platform Comparison Cards */}
        <div className="p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
          <h3 className="text-lg font-semibold text-gray-400 mb-4">Traditional Platforms</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-gray-400">
              <span className="text-red-400 mt-1">✕</span>
              <span>Manual project searching and bidding wars</span>
            </li>
            <li className="flex items-start gap-3 text-gray-400">
              <span className="text-red-400 mt-1">✕</span>
              <span>Success based solely on review numbers</span>
            </li>
            <li className="flex items-start gap-3 text-gray-400">
              <span className="text-red-400 mt-1">✕</span>
              <span>Limited growth opportunities beyond freelancing</span>
            </li>
            <li className="flex items-start gap-3 text-gray-400">
              <span className="text-red-400 mt-1">✕</span>
              <span>Basic portfolio displays without AI enhancement</span>
            </li>
            <li className="flex items-start gap-3 text-gray-400">
              <span className="text-red-400 mt-1">✕</span>
              <span>Focus on transactions over artist development</span>
            </li>
          </ul>
        </div>

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
          </ul>
        </div>
      </div>
    );
}

export default ArtistComparisonCard;