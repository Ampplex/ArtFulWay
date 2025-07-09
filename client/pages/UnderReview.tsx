import React from 'react';
import { Clock, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UnderReview(props) {
    const user_id = useSelector((state: any) => state.auth.user_id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkVerification = async () => {
            if (!user_id) return;
            const url = `http://localhost:8080/api/artist/checkArtistVerification/${user_id}`;
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) throw new Error("Failed to check verification status");
                const data = await response.json();
                if (data.isVerified) {
                    navigate("/artist_dashboard");
                }
            } catch (error) {
                // Optionally handle error
            } finally {
                setLoading(false);
            }
        };
        checkVerification();
    }, [user_id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-600">Checking verification...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                        ArtfulWay
                    </div>
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Account Under Review
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        We're currently reviewing your account to ensure the best experience 
                        for all our users. This process typically takes 1-2 business days.
                    </p>

                    {/* Status Steps */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium text-gray-700">Account Created</span>
                            </div>
                            <span className="text-xs text-green-600 font-medium">Complete</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                                <span className="text-sm font-medium text-purple-700">Under Review</span>
                            </div>
                            <span className="text-xs text-purple-600 font-medium">In Progress</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
                            <div className="flex items-center space-x-3">
                                <AlertCircle className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">Account Activated</span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">Pending</span>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                        <ul className="text-sm text-gray-600 space-y-1 text-left">
                            <li>• Our team will verify your account details</li>
                            <li>• You'll receive an email once review is complete</li>
                            <li>• Your account will be activated automatically</li>
                        </ul>
                    </div>

                    {/* Contact Support */}
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        <span>Questions? Contact us at</span>
                        <a href="mailto:support@artfulway.com" className="text-purple-600 hover:text-purple-700 font-medium">
                            support@artfulway.in
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnderReview;