import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import apiClient from '../../api/client';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [repoLink, setRepoLink] = useState(project?.repoLink || '');
  const [meetingLink, setMeetingLink] = useState(project?.meetingLink || '');
  const [storageLink, setStorageLink] = useState(project?.storageLink || '');

  // Reset state when project changes or modal opens
  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setRepoLink(project.repoLink || '');
      setMeetingLink(project.meetingLink || '');
      setStorageLink(project.storageLink || '');
    }
  }, [project, isOpen]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/api/projects/${project.id}`, {
        name,
        description,
        repoLink,
        meetingLink,
        storageLink,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="p-6 space-y-4"
        >
          {mutation.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              Failed to update project. Please try again.
            </div>
          )}

          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              id="edit-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="edit-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow resize-none"
              placeholder="What is this project about?"
            />
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">Integrations (Optional)</h3>

            <div>
              <label htmlFor="edit-repoLink" className="block text-xs font-medium text-slate-500 mb-1">
                Repository Link (e.g., GitHub, GitLab)
              </label>
              <input
                type="url"
                id="edit-repoLink"
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label htmlFor="edit-meetingLink" className="block text-xs font-medium text-slate-500 mb-1">
                Meeting Link (e.g., Zoom, Google Meet)
              </label>
              <input
                type="url"
                id="edit-meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div>
              <label htmlFor="edit-storageLink" className="block text-xs font-medium text-slate-500 mb-1">
                Storage Link (e.g., Google Drive, Figma)
              </label>
              <input
                type="url"
                id="edit-storageLink"
                value={storageLink}
                onChange={(e) => setStorageLink(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
