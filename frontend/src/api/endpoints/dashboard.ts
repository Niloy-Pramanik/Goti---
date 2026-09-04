import apiClient from '../client';

export interface MyIssue {
  id: string;
  projectId: string;
  projectName: string;
  teamId: string;
  teamName: string;
  orgId: string;
  orgName: string;
  milestoneId: string | null;
  assigneeId: string | null;
  type: string;
  status: string;
  title: string;
  description: string;
  createdAt: string;
}

export const getMyIssues = async (): Promise<MyIssue[]> => {
  const response = await apiClient.get('/api/dashboard/my-issues');
  return response.data;
};
