import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, User, Mail, Briefcase, Calendar, ExternalLink, RefreshCw, AlertCircle, Clock } from 'lucide-react';

function Admin(props) {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState({});
    const [queueStatus, setQueueStatus] = useState({});
    const [adminId] = useState(() => `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const [error, setError] = useState(null);

    // Fetch pending users from Node.js server
    const fetchFromSQS = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/admin/pending_users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'admin-id': adminId
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Use 'pending' array from backend
            const newFetched = (data.pending || []).map(user => {
                try {
                    return {
                        ...user,
                        body: typeof user.body === 'string' ? JSON.parse(user.body) : user.body
                    };
                } catch (parseError) {
                    return {
                        ...user,
                        body: { error: 'Invalid message format', raw: user.body }
                    };
                }
            });
            // Merge with sessionStorage
            const sessionKey = 'admin_pending_users';
            const prev = JSON.parse(sessionStorage.getItem(sessionKey) || '[]');
            // Use userId or email as unique key
            const all = [...prev, ...newFetched];
            const unique = [];
            const seen = new Set();
            for (const user of all) {
                const key = user.body.user_id || user.body.email;
                if (key && !seen.has(key)) {
                    seen.add(key);
                    unique.push(user);
                }
            }
            sessionStorage.setItem(sessionKey, JSON.stringify(unique));
            setPendingUsers(unique);
        } catch (error) {
            console.error('Error fetching from server:', error);
            setError('Failed to fetch pending users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch queue status
    const fetchQueueStatus = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/queue-status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'admin-id': adminId
                }
            });
            
            if (response.ok) {
                const status = await response.json();
                setQueueStatus(status);
            }
        } catch (error) {
            console.error('Error fetching queue status:', error);
        }
    };

    // When approving/rejecting, also update sessionStorage
    const handleApprove = async (receiptHandle, userId) => {
        if (!receiptHandle) {
            alert('Missing receipt handle. Please refresh the queue.');
            return;
        }
        setProcessing(prev => ({ ...prev, [receiptHandle]: 'approving' }));
        try {
            const response = await fetch('http://localhost:8080/api/admin/approve-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'admin-id': adminId
                },
                body: JSON.stringify({
                    userId,
                    receiptHandle
                })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }
            // Remove from sessionStorage and state
            const sessionKey = 'admin_pending_users';
            const prev = JSON.parse(sessionStorage.getItem(sessionKey) || '[]');
            const filtered = prev.filter(user => user.receiptHandle !== receiptHandle);
            sessionStorage.setItem(sessionKey, JSON.stringify(filtered));
            setPendingUsers(filtered);
            console.log(`User ${userId} approved successfully`);
        } catch (error) {
            console.error('Error approving user:', error);
            alert(`Failed to approve user: ${error.message}`);
            setTimeout(fetchFromSQS, 1000);
        } finally {
            setProcessing(prev => ({ ...prev, [receiptHandle]: null }));
        }
    };

    const handleReject = async (receiptHandle, email) => {
        if (!receiptHandle) {
            alert('Missing receipt handle. Please refresh the queue.');
            return;
        }
        const reason = prompt('Please provide a reason for rejection (optional):');
        setProcessing(prev => ({ ...prev, [receiptHandle]: 'rejecting' }));
        try {
            const response = await fetch('http://localhost:8080/api/admin/reject-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'admin-id': adminId
                },
                body: JSON.stringify({
                    receiptHandle,
                    email,
                    reason
                })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }
            // Remove from sessionStorage and state
            const sessionKey = 'admin_pending_users';
            const prev = JSON.parse(sessionStorage.getItem(sessionKey) || '[]');
            const filtered = prev.filter(user => user.receiptHandle !== receiptHandle);
            sessionStorage.setItem(sessionKey, JSON.stringify(filtered));
            setPendingUsers(filtered);
            console.log(`User ${email} rejected successfully`);
        } catch (error) {
            console.error('Error rejecting user:', error);
            alert(`Failed to reject user: ${error.message}`);
            setTimeout(fetchFromSQS, 1000);
        } finally {
            setProcessing(prev => ({ ...prev, [receiptHandle]: null }));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return 'Invalid date';
        }
    };

    const formatSkills = (skillSets) => {
        if (!skillSets) return [];
        return skillSets.split(',').map(skill => skill.trim()).filter(Boolean);
    };

    const getMessageAge = (timestamp) => {
        if (!timestamp) return '';
        const ageMinutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
        if (ageMinutes < 1) return 'Just now';
        if (ageMinutes < 60) return `${ageMinutes}m ago`;
        const ageHours = Math.floor(ageMinutes / 60);
        if (ageHours < 24) return `${ageHours}h ago`;
        const ageDays = Math.floor(ageHours / 24);
        return `${ageDays}d ago`;
    };

    useEffect(() => {
        fetchFromSQS();
        fetchQueueStatus();
        
        // Set up polling every 30 seconds
        const interval = setInterval(() => {
            fetchFromSQS();
            fetchQueueStatus();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Show error message if body parsing failed
    const isValidMessage = (user) => {
        return user.body && !user.body.error && user.body.artist_name;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-gray-600 mt-1">
                                Review and approve user registrations
                                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    ID: {adminId.split('-')[1]}
                                </span>
                            </p>
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

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{pendingUsers.length}</div>
                            <div className="text-sm text-gray-500">Pending Requests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{queueStatus.availableMessages || 0}</div>
                            <div className="text-sm text-gray-500">Available in Queue</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600">{queueStatus.processingMessages || 0}</div>
                            <div className="text-sm text-gray-500">Being Processed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{queueStatus.localProcessingCache || 0}</div>
                            <div className="text-sm text-gray-500">Local Cache</div>
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
                            <div key={user.receiptHandle} className="bg-white rounded-lg shadow-sm p-6">
                                {/* Message Info Header */}
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        {getMessageAge(user.timestamp)}
                                        {user.receiveCount > 1 && (
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                                Retry #{user.receiveCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        MSG: {user.receiptHandle ? user.receiptHandle.substring(0, 8) : 'N/A'}...
                                    </div>
                                </div>

                                {!isValidMessage(user) ? (
                                    <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
                                        <div className="text-center">
                                            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                            <p className="text-red-700">Invalid message format</p>
                                            <p className="text-sm text-red-600 mt-1">
                                                {user.body?.error || 'Unable to parse message data'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
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
                                                        {user.body.work_title || 'Not specified'}
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
                                            {user.body.skillSets && (
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
                                            )}

                                            {/* Experience */}
                                            {user.body.experience && (
                                                <div className="mt-4">
                                                    <h4 className="font-medium text-gray-900 mb-1">Experience:</h4>
                                                    <p className="text-gray-600">{user.body.experience}</p>
                                                </div>
                                            )}

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
                                                onClick={() => handleApprove(user.receiptHandle, user.body.user_id)}
                                                disabled={processing[user.receiptHandle] || !user.receiptHandle}
                                                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                            >
                                                {processing[user.receiptHandle] === 'approving' ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                                {processing[user.receiptHandle] === 'approving' ? 'Approving...' : 'Approve'}
                                            </button>
                                            
                                            <button
                                                onClick={() => handleReject(user.receiptHandle, user.body.email)}
                                                disabled={processing[user.receiptHandle] || !user.receiptHandle}
                                                className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {processing[user.receiptHandle] === 'rejecting' ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-4 h-4" />
                                                )}
                                                {processing[user.receiptHandle] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                                            </button>

                                            {!user.receiptHandle && (
                                                <div className="text-xs text-red-600 text-center">
                                                    Missing receipt handle
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;