import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, Building2, Users, CheckCircle, AlertCircle, LayoutGrid, Shield } from 'lucide-react';
import apiClient from '../api/client';
import { useAuthStore } from '../store/authStore';

interface InvitationDetails {
  organizationName: string;
  organizationDescription: string;
  email: string;
  role: string;
  expiresAt: string;
  accepted: boolean;
  teamInvite: boolean;
  teamName: string;
}

export default function InviteAccept() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { token: authToken } = useAuthStore();
  const [error, setError] = useState('');

  const { data: invite, isLoading: inviteLoading, error: inviteError } = useQuery<InvitationDetails>({
    queryKey: ['invite', token],
    queryFn: async () => {
      const response = await apiClient.get(`/api/invites/${token}`);
      return response.data;
    },
    enabled: !!token,
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/api/invites/${token}/accept`);
    },
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to accept invitation');
    },
  });

  useEffect(() => {
    if (invite?.accepted) {
      setError('This invitation has already been accepted');
    }
  }, [invite]);

  if (inviteLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (inviteError || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Invitation</h1>
          <p className="text-slate-500 mb-6">
            This invitation link is invalid or has expired.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center gap-2 text-slate-900 font-bold text-2xl tracking-tight mb-6">
              <LayoutGrid className="w-8 h-8 text-brand-600" />
              Goti
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                invite.teamInvite 
                  ? 'bg-purple-100' 
                  : 'bg-brand-100'
              }`}>
                {invite.teamInvite ? (
                  <Users className="w-8 h-8 text-purple-600" />
                ) : (
                  <Building2 className="w-8 h-8 text-brand-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                You're Invited!
              </h1>
              <p className="text-slate-500 text-sm">
                {invite.teamInvite ? (
                  <>Join <strong>{invite.teamName}</strong> team at <strong>{invite.organizationName}</strong></>
                ) : (
                  <>Join <strong>{invite.organizationName}</strong> on Goti</>
                )}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Anyone with this link can register or sign in to join.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  {invite.teamInvite ? (
                    <Users className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Building2 className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {invite.teamInvite ? invite.teamName : invite.organizationName}
                  </p>
                  {invite.teamInvite && (
                    <p className="text-xs text-slate-500">{invite.organizationName}</p>
                  )}
                  {!invite.teamInvite && invite.organizationDescription && (
                    <p className="text-xs text-slate-500">{invite.organizationDescription}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Role: <strong className="text-slate-700">{invite.role}</strong>
                </span>
                <span>•</span>
                <span>Expires: {new Date(invite.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-4 border border-red-100">
                {error}
              </div>
            )}

            {invite.accepted ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Already accepted</span>
                </div>
                <Link
                  to="/dashboard"
                  className="block w-full bg-slate-900 text-white text-center py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : authToken ? (
              <button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {acceptMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Accept Invitation
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to={`/register?invite=${token}`}
                  className="block w-full bg-slate-900 text-white text-center py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
                >
                  Register to Accept
                </Link>
                <Link
                  to={`/login?invite=${token}`}
                  className="block w-full bg-slate-50 text-slate-900 text-center py-3 rounded-xl font-medium hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Sign In to Accept
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
