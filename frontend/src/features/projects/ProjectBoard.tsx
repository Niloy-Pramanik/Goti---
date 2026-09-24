import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, MessageSquare, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import CreateIssueModal from '../issues/CreateIssueModal';
import LogProgressModal from '../issues/LogProgressModal';
import LogTimeModal from '../issues/LogTimeModal';

export default function ProjectBoard() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}`);
      return response.data;
    },
  });

  const { data: issues, isLoading: issuesLoading } = useQuery({
    queryKey: ['issues', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}/issues`);
      return response.data;
    },
  });

  const { data: milestones } = useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}/milestones`);
      return response.data;
    },
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers', project?.teamId],
    queryFn: async () => {
      if (!project?.teamId) return [];
      const response = await apiClient.get(`/api/teams/${project.teamId}/members`);
      return response.data;
    },
    enabled: !!project?.teamId,
  });

  const currentUserRole = teamMembers?.find((m: any) => m.userId === user?.id)?.role;
  const canAssign = currentUserRole === 'LEAD' || user?.globalRole === 'SUPER_ADMIN';

  const updateIssueMutation = useMutation({
    mutationFn: async ({ issueId, payload }: { issueId: string, payload: any }) => {
      const response = await apiClient.patch(`/api/issues/${issueId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
      queryClient.invalidateQueries({ queryKey: ['my-issues'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] }); // to refresh milestone progress
    }
  });

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or it was dropped in the same place
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistically update the UI cache immediately
    queryClient.setQueryData(['issues', projectId], (oldData: any[]) => {
      if (!oldData) return [];
      return oldData.map(issue => {
        if (issue.id === draggableId) {
          return { ...issue, status: destination.droppableId };
        }
        return issue;
      });
    });

    // Fire the API call
    updateIssueMutation.mutate({ issueId: draggableId, payload: { status: destination.droppableId } });
  };

  if (projectLoading || issuesLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  const todoIssues = issues?.filter((i: any) => i.status === 'TO_DO') || [];
  const inProgressIssues = issues?.filter((i: any) => i.status === 'IN_PROGRESS') || [];
  const doneIssues = issues?.filter((i: any) => i.status === 'DONE') || [];

  return (
    <div className="relative min-h-[calc(100vh-6rem)] max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Board</h2>
          <p className="text-slate-500 text-sm font-medium">Manage and track project issues</p>
        </div>
        
        {canAssign && (
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Issue
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TO DO Column */}
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-700 mb-4 flex justify-between">
              TO DO <span className="bg-slate-200 text-slate-600 px-2 rounded-full text-xs flex items-center">{todoIssues.length}</span>
            </h3>
            <Droppable droppableId="TO_DO">
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className={`flex-1 space-y-3 min-h-[150px] transition-colors rounded-xl p-1 ${snapshot.isDraggingOver ? 'bg-slate-100/80 ring-2 ring-slate-200 ring-inset' : ''}`}
                >
                  {todoIssues.map((issue: any, index: number) => (
                    <Draggable key={issue.id} draggableId={issue.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.9 : 1
                          }}
                        >
                          <IssueCard 
                            issue={issue} 
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            teamMembers={teamMembers || []}
                            milestones={milestones || []}
                            canAssign={canAssign}
                            currentUser={user}
                            onAssigneeChange={(assigneeId) => updateIssueMutation.mutate({ issueId: issue.id, payload: { assigneeId: assigneeId || null, updateAssigneeId: true } })}
                            onLogProgress={() => { setActiveIssueId(issue.id); setIsLogModalOpen(true); }}
                            onLogTime={() => { setActiveIssueId(issue.id); setIsTimeModalOpen(true); }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {todoIssues.length === 0 && !snapshot.isDraggingOver && (
                    <div className="text-center py-6 text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No issues
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
          
          {/* IN PROGRESS Column */}
          <div className="bg-brand-50/30 rounded-2xl p-4 border border-brand-100 flex flex-col">
            <h3 className="font-bold text-brand-700 mb-4 flex justify-between">
              IN PROGRESS <span className="bg-brand-100 text-brand-600 px-2 rounded-full text-xs flex items-center">{inProgressIssues.length}</span>
            </h3>
            <Droppable droppableId="IN_PROGRESS">
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className={`flex-1 space-y-3 min-h-[150px] transition-colors rounded-xl p-1 ${snapshot.isDraggingOver ? 'bg-brand-100/50 ring-2 ring-brand-200 ring-inset' : ''}`}
                >
                  {inProgressIssues.map((issue: any, index: number) => (
                    <Draggable key={issue.id} draggableId={issue.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.9 : 1
                          }}
                        >
                          <IssueCard 
                            issue={issue} 
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            teamMembers={teamMembers || []}
                            milestones={milestones || []}
                            canAssign={canAssign}
                            currentUser={user}
                            onAssigneeChange={(assigneeId) => updateIssueMutation.mutate({ issueId: issue.id, payload: { assigneeId: assigneeId || null, updateAssigneeId: true } })}
                            onLogProgress={() => { setActiveIssueId(issue.id); setIsLogModalOpen(true); }}
                            onLogTime={() => { setActiveIssueId(issue.id); setIsTimeModalOpen(true); }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {inProgressIssues.length === 0 && !snapshot.isDraggingOver && (
                    <div className="text-center py-6 text-sm text-brand-400 border border-dashed border-brand-200 rounded-xl">
                      No issues
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>

          {/* DONE Column */}
          <div className="bg-green-50/30 rounded-2xl p-4 border border-green-100 flex flex-col">
            <h3 className="font-bold text-green-700 mb-4 flex justify-between">
              DONE <span className="bg-green-100 text-green-600 px-2 rounded-full text-xs flex items-center">{doneIssues.length}</span>
            </h3>
            <Droppable droppableId="DONE">
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className={`flex-1 space-y-3 min-h-[150px] transition-colors rounded-xl p-1 ${snapshot.isDraggingOver ? 'bg-green-100/50 ring-2 ring-green-200 ring-inset' : ''}`}
                >
                  {doneIssues.map((issue: any, index: number) => (
                    <Draggable key={issue.id} draggableId={issue.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.9 : 1
                          }}
                        >
                          <IssueCard 
                            issue={issue} 
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            teamMembers={teamMembers || []}
                            milestones={milestones || []}
                            canAssign={canAssign}
                            currentUser={user}
                            onAssigneeChange={(assigneeId) => updateIssueMutation.mutate({ issueId: issue.id, payload: { assigneeId: assigneeId || null, updateAssigneeId: true } })}
                            onLogProgress={() => { setActiveIssueId(issue.id); setIsLogModalOpen(true); }}
                            onLogTime={() => { setActiveIssueId(issue.id); setIsTimeModalOpen(true); }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {doneIssues.length === 0 && !snapshot.isDraggingOver && (
                    <div className="text-center py-6 text-sm text-green-400 border border-dashed border-green-200 rounded-xl">
                      No issues
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>

        </div>
      </DragDropContext>

      <CreateIssueModal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} projectId={projectId as string} teamId={project.teamId} canAssign={canAssign} />
      {activeIssueId && (
        <>
          <LogProgressModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} issueId={activeIssueId} />
          <LogTimeModal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} issueId={activeIssueId} />
        </>
      )}
    </div>
  );
}

function IssueCard({ issue, dragHandleProps, isDragging, teamMembers, milestones, canAssign, currentUser, onAssigneeChange, onLogProgress, onLogTime }: { issue: any, dragHandleProps: any, isDragging: boolean, teamMembers: any[], milestones: any[], canAssign: boolean, currentUser: any, onAssigneeChange: (id: string) => void, onLogProgress: () => void, onLogTime: () => void }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUG': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'FEATURE': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  return (
    <div className={`bg-white p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-md shadow-slate-200/50 border-slate-200 hover:shadow-xl hover:shadow-brand-100 hover:-translate-y-1 hover:border-brand-200 group ${isDragging ? 'shadow-2xl border-brand-400 ring-4 ring-brand-500/20 rotate-2 scale-105 bg-brand-50' : ''}`}>
      
      {/* Decorative gradient blob at top right */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-brand-100 to-transparent rounded-full blur-xl opacity-60 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-3 group relative z-10">
        <div className="flex gap-2 items-center">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border ${getTypeColor(issue.type)}`}>
            {issue.type}
          </span>
          {issue.milestoneId && (
            <span className="text-[10px] font-bold px-2 py-1 rounded border bg-slate-50 text-slate-500 border-slate-200">
              {milestones.find((m: any) => m.id === issue.milestoneId)?.name || 'Milestone'}
            </span>
          )}
        </div>
        <div {...dragHandleProps} className="text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-grab active:cursor-grabbing p-1.5 -mr-2 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      
      <h4 className="font-extrabold text-slate-900 text-base mb-1.5 leading-snug relative z-10">{issue.title}</h4>
      
      {issue.description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 relative z-10">{issue.description}</p>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/80 relative z-10">
        <div className="flex flex-col gap-2">
          {canAssign && (
            <select 
              value={issue.assigneeId || ''}
              onChange={(e) => onAssigneeChange(e.target.value)}
              className="text-[10px] font-bold bg-slate-100/50 hover:bg-slate-200/80 border-none rounded-lg py-1 pl-2 pr-6 outline-none text-slate-600 cursor-pointer transition-colors shadow-sm appearance-none max-w-[120px] truncate"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .3rem top 50%', backgroundSize: '.6rem auto' }}
            >
              <option value="">Unassigned</option>
              {teamMembers.map(m => (
                <option key={m.userId} value={m.userId}>{m.name}</option>
              ))}
            </select>
          )}

          {!canAssign && issue.assigneeId && (
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {teamMembers.find(m => m.userId === issue.assigneeId)?.name.substring(0, 2).toUpperCase() || 'UN'}
            </div>
          )}
        </div>
        
        <div className="flex gap-1.5 items-center">
          {issue.totalTimeLogged > 0 && (
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded mr-1">
              {Math.floor(issue.totalTimeLogged / 60)}h {issue.totalTimeLogged % 60}m
            </span>
          )}
          
          {!canAssign && currentUser?.id === issue.assigneeId && (
            <>
              <button 
                onClick={onLogProgress}
                className="p-1.5 text-slate-400 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg border border-transparent hover:border-brand-100 transition-all shadow-sm"
                title="Log Progress/Blocker"
              >
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>

              <button 
                onClick={onLogTime}
                className="p-1.5 text-slate-400 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg border border-transparent hover:border-brand-100 transition-all shadow-sm"
                title="Log Time"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
