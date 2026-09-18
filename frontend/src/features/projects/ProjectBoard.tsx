import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, MessageSquare, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import apiClient from '../../api/client';
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

  const updateIssueStatusMutation = useMutation({
    mutationFn: async ({ issueId, status }: { issueId: string, status: string }) => {
      const response = await apiClient.patch(`/api/issues/${issueId}`, { status });
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
    updateIssueStatusMutation.mutate({ issueId: draggableId, status: destination.droppableId });
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Issue Board</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage tasks and bugs for {project.name}</p>
        </div>
        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Issue
        </button>
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

      <CreateIssueModal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} projectId={projectId as string} teamId={project.teamId} />
      {activeIssueId && (
        <>
          <LogProgressModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} issueId={activeIssueId} />
          <LogTimeModal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} issueId={activeIssueId} />
        </>
      )}
    </div>
  );
}

function IssueCard({ issue, dragHandleProps, isDragging, onLogProgress, onLogTime }: { issue: any, dragHandleProps: any, isDragging: boolean, onLogProgress: () => void, onLogTime: () => void }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUG': return 'bg-red-50 text-red-600 border-red-100';
      case 'FEATURE': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className={`bg-white p-4 rounded-xl border transition-all ${isDragging ? 'shadow-xl border-brand-300 ring-2 ring-brand-500/20 rotate-1' : 'shadow-sm border-slate-200 hover:shadow-md'}`}>
      <div className="flex justify-between items-start mb-2 group">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${getTypeColor(issue.type)}`}>
          {issue.type}
        </span>
        <div {...dragHandleProps} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 -mr-2">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      <h4 className="font-bold text-slate-900 text-sm mb-1">{issue.title}</h4>
      {issue.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{issue.description}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-500">
          {issue.assigneeId ? 'Assigned' : 'Unassigned'}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onLogTime}
            className="text-slate-400 hover:text-brand-600 transition-colors"
            title="Log Time"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </button>
          <button 
            onClick={onLogProgress}
            className="text-slate-400 hover:text-brand-600 transition-colors"
            title="Log Progress/Blocker"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
