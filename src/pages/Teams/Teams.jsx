import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { teamAPI } from "../../services/api";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [memberData, setMemberData] = useState({
    name: "",
    role: "",
    capacity: 3,
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.create(formData);
      setFormData({ name: "", description: "" });
      setShowModal(false);
      fetchTeams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.addMember(selectedTeam._id, memberData);
      setMemberData({ name: "", role: "", capacity: 3 });
      setShowMemberModal(false);
      fetchTeams();
    } catch (error) {
      alert("Failed to add member");
    }
  };

  const handleDeleteTeam = async (id) => {
    if (confirm("Are you sure you want to delete this team?")) {
      try {
        await teamAPI.delete(id);
        fetchTeams();
      } catch (error) {
        alert("Failed to delete team");
      }
    }
  };

  const handleDeleteMember = async (teamId, memberId) => {
    if (confirm("Remove this member from the team?")) {
      try {
        await teamAPI.deleteMember(teamId, memberId);
        fetchTeams();
      } catch (error) {
        alert("Failed to remove member");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg font-semibold">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center gap-3">
              <span className="text-4xl">👥</span>
              Teams
            </h1>
            <p className="text-sm sm:text-base text-base-content/70 mt-2">
              Manage your teams and members
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Team
          </button>
        </div>

        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="bg-base-100 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md">
              <div className="text-6xl sm:text-8xl mb-6">🎯</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                No teams yet
              </h2>
              <p className="text-base-content/60 mb-8 text-sm sm:text-base">
                Create your first team to get started with task management
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary btn-lg gap-2 w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Team
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="card-body p-6">
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="card-title text-xl sm:text-2xl text-primary mb-2">
                        {team.name}
                      </h2>
                      <p className="text-sm text-base-content/70 line-clamp-2">
                        {team.description || "No description"}
                      </p>
                    </div>
                    <div className="badge badge-lg badge-primary gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {team.members.length}
                    </div>
                  </div>

                  <div className="divider my-2">Members</div>

                  {/* Members List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {team.members.length === 0 ? (
                      <div className="text-center py-6 text-base-content/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto mb-2 opacity-30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        <p className="text-sm">No members yet</p>
                      </div>
                    ) : (
                      team.members.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="avatar placeholder">
                              <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                                <span className="text-sm font-bold">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {member.name}
                              </p>
                              <p className="text-xs text-base-content/60 truncate">
                                {member.role}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="badge badge-sm badge-outline">
                                  {member.currentTasks}/{member.capacity} tasks
                                </div>
                                {member.currentTasks > member.capacity && (
                                  <div className="badge badge-sm badge-error">
                                    Overload
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteMember(team._id, member._id)
                            }
                            className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error hover:text-error-content"
                            title="Remove member"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-4 gap-2">
                    <button
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowMemberModal(true);
                      }}
                      className="btn btn-primary btn-sm gap-2 flex-1 sm:flex-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Add Member
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team._id)}
                      className="btn btn-error btn-sm gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Team Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🎯</div>
                <h3 className="font-bold text-2xl">Create New Team</h3>
              </div>

              <form onSubmit={handleCreateTeam}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Team Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Development Team"
                    className="input input-bordered input-lg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Description
                    </span>
                  </label>
                  <textarea
                    placeholder="Brief description of the team's purpose"
                    className="textarea textarea-bordered textarea-lg h-24"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showMemberModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">👤</div>
                <div>
                  <h3 className="font-bold text-2xl">Add Team Member</h3>
                  <p className="text-sm text-base-content/60 mt-1">
                    to {selectedTeam?.name}
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddMember}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Member Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    className="input input-bordered input-lg"
                    value={memberData.name}
                    onChange={(e) =>
                      setMemberData({ ...memberData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-semibold">Role</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Frontend Developer"
                    className="input input-bordered input-lg"
                    value={memberData.role}
                    onChange={(e) =>
                      setMemberData({ ...memberData, role: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Task Capacity (0-5)
                    </span>
                    <span className="label-text-alt badge badge-primary">
                      {memberData.capacity} tasks
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    className="range range-primary"
                    value={memberData.capacity}
                    onChange={(e) =>
                      setMemberData({
                        ...memberData,
                        capacity: parseInt(e.target.value),
                      })
                    }
                  />
                  <div className="flex justify-between text-xs px-2 mt-2">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setShowMemberModal(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--bc) / 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--bc) / 0.3);
        }
      `}</style>
    </div>
  );
};

export default Teams;
