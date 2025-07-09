import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, User, Mail, Briefcase, Calendar, ExternalLink, RefreshCw } from 'lucide-react';

function Admin(props) {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState({});

    // Fetch pending users from Node.js server
    const fetchFromSQS = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/admin/pending_users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Parse the JSON string in the body field
            const processedMessages = (data.messages || []).map(message => ({
                ...message,
                body: typeof message.body === 'string' ? JSON.parse(message.body) : message.body
            }));
            
            // Only update the list if it's empty (first load), otherwise keep existing pendingUsers
            setPendingUsers(prev => prev.length === 0 ? processedMessages : prev);
        } catch (error) {
            console.error('Error fetching from server:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (messageId, userId) => {
        setProcessing(prev => ({ ...prev, [messageId]: 'approving' }));
        
        try {
            const response = await fetch('/api/admin/approve-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Remove from pending list on success
            setPendingUsers(prev => prev.filter(user => user.messageId !== messageId));
            
            console.log(`User ${userId} approved successfully`);
        } catch (error) {
            console.error('Error approving user:', error);
            alert('Failed to approve user. Please try again.');
        } finally {
            setProcessing(prev => ({ ...prev, [messageId]: null }));
        }
    };

    const handleReject = async (messageId, userId) => {
        setProcessing(prev => ({ ...prev, [messageId]: 'rejecting' }));
        
        try {
            const response = await fetch('/api/admin/reject-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messageId,
                    userId,
                    action: 'reject'
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Remove from pending list on success
            setPendingUsers(prev => prev.filter(user => user.messageId !== messageId));
            
            console.log(`User ${userId} rejected successfully`);
        } catch (error) {
            console.error('Error rejecting user:', error);
            alert('Failed to reject user. Please try again.');
        } finally {
            setProcessing(prev => ({ ...prev, [messageId]: null }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatSkills = (skillSets) => {
        if (!skillSets) return [];
        return skillSets.split(',').map(skill => skill.trim());
    };

    useEffect(() => {
        fetchFromSQS();
        
        // Set up polling every 30 seconds
        const interval = setInterval(fetchFromSQS, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-gray-600 mt-1">Review and approve user registrations</p>
                        </div>
                        <button
                            onClick={fetchFromSQS}
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Queue
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{pendingUsers.length}</div>
                            <div className="text-sm text-gray-500">Pending Requests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">0</div>
                            <div className="text-sm text-gray-500">Approved Today</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">0</div>
                            <div className="text-sm text-gray-500">Rejected Today</div>
                        </div>
                    </div>
                </div>

                {/* User Cards */}
                <div className="space-y-4">
                    {loading && pendingUsers.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">Loading pending requests...</p>
                        </div>
                    ) : pendingUsers.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">No pending requests</p>
                        </div>
                    ) : (
                        pendingUsers.map((user) => (
                            <div key={user.messageId} className="bg-white rounded-lg shadow-sm p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* User Info */}
                                    <div className="lg:col-span-2">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{user.body.artist_name}</h3>
                                                <p className="text-gray-600 flex items-center gap-1 mt-1">
                                                    <Briefcase className="w-4 h-4" />
                                                    {user.body.work_title}
                                                </p>
                                                <p className="text-gray-600 flex items-center gap-1 mt-1">
                                                    <Mail className="w-4 h-4" />
                                                    {user.body.email}
                                                </p>
                                                <p className="text-gray-500 flex items-center gap-1 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(user.body.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="mt-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Skills:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {formatSkills(user.body.skillSets).map((skill, index) => (
                                                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Experience */}
                                        <div className="mt-4">
                                            <h4 className="font-medium text-gray-900 mb-1">Experience:</h4>
                                            <p className="text-gray-600">{user.body.experience || 'Not specified'}</p>
                                        </div>

                                        {/* Social Links */}
                                        <div className="mt-4 flex gap-4">
                                            {user.body.linkedin_url && (
                                                <a 
                                                    href={user.body.linkedin_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    LinkedIn
                                                </a>
                                            )}
                                            {user.body.instagram_url && (
                                                <a 
                                                    href={user.body.instagram_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-pink-600 hover:text-pink-800"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Instagram
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => handleApprove(user.messageId, user.body.user_id)}
                                            disabled={processing[user.messageId]}
                                            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {processing[user.messageId] === 'approving' ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4" />
                                            )}
                                            {processing[user.messageId] === 'approving' ? 'Approving...' : 'Approve'}
                                        </button>
                                        
                                        <button
                                            onClick={() => handleReject(user.messageId, user.body.user_id)}
                                            disabled={processing[user.messageId]}
                                            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {processing[user.messageId] === 'rejecting' ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            {processing[user.messageId] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;