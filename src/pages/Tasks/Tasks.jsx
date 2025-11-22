/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { projectAPI, taskAPI } from "../../services/api";

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filterProject, setFilterProject] = useState(
    searchParams.get("project") || ""
  );
  const [filterMember, setFilterMember] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedMember: { memberId: "", name: "Unassigned" },
    priority: "Medium",
    status: "Pending",
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [overloadedMember, setOverloadedMember] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsRes = await projectAPI.getAll();
      setProjects(projectsRes.data);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const params = {};
      if (filterProject) params.project = filterProject;
      if (filterMember) params.member = filterMember;

      const response = await taskAPI.getAll(params);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    if (!loading) fetchTasks();
  }, [filterProject, filterMember]);

  const handleProjectChange = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    setSelectedProject(project);
    setFormData({
      ...formData,
      project: projectId,
      assignedMember: { memberId: "", name: "Unassigned" },
    });
    setShowWarning(false);
  };

  const handleMemberChange = (memberId) => {
    if (!selectedProject) return;

    const member = selectedProject.team.members.find((m) => m._id === memberId);

    if (member && member.currentTasks >= member.capacity) {
      setOverloadedMember(member);
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    setFormData({
      ...formData,
      assignedMember: {
        memberId: memberId,
        name: member ? member.name : "Unassigned",
      },
    });
  };

  const handleAutoAssign = () => {
    if (!selectedProject) return;

    const members = selectedProject.team.members;
    let minLoad = Infinity;
    let selectedMember = null;

    members.forEach((member) => {
      const load = member.currentTasks / member.capacity;
      if (load < minLoad) {
        minLoad = load;
        selectedMember = member;
      }
    });

    if (selectedMember) {
      setFormData({
        ...formData,
        assignedMember: {
          memberId: selectedMember._id,
          name: selectedMember.name,
        },
      });
      setShowWarning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        await taskAPI.update(editTask._id, formData);
      } else {
        await taskAPI.create(formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      alert("Failed to save task");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      project: "",
      assignedMember: { memberId: "", name: "Unassigned" },
      priority: "Medium",
      status: "Pending",
    });
    setShowModal(false);
    setEditTask(null);
    setSelectedProject(null);
    setShowWarning(false);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project._id,
      assignedMember: task.assignedMember,
      priority: task.priority,
      status: task.status,
    });
    const project = projects.find((p) => p._id === task.project._id);
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this task?")) {
      try {
        await taskAPI.delete(id);
        fetchData();
      } catch (error) {
        alert("Failed to delete task");
      }
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "badge-info",
      Medium: "badge-warning",
      High: "badge-error",
    };
    return colors[priority] || "badge-ghost";
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "badge-ghost",
      "In Progress": "badge-info",
      Done: "badge-success",
    };
    return colors[status] || "badge-ghost";
  };

  const getPriorityIcon = (priority) => {
    if (priority === "High") return "🔴";
    if (priority === "Medium") return "🟡";
    return "🟢";
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus && task.status !== filterStatus) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-accent"></span>
          <p className="mt-4 text-lg font-semibold">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-accent flex items-center gap-3">
              <span className="text-4xl">✅</span>
              Tasks
            </h1>
            <p className="text-sm sm:text-base text-base-content/70 mt-2">
              Manage and track your tasks
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-accent btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            disabled={projects.length === 0}
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
            Create Task
          </button>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body p-4 sm:p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Project</span>
                </label>
                <select
                  className="select select-bordered select-sm sm:select-md"
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered select-sm sm:select-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Priority</span>
                </label>
                <select
                  className="select select-bordered select-sm sm:select-md"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-control">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Actions</span>
                  </label>
                </div>
                <button
                  onClick={() => {
                    setFilterProject("");
                    setFilterStatus("");
                    setFilterPriority("");
                  }}
                  className="btn btn-outline btn-sm sm:btn-md"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid/List */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-base-100 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md text-center">
              <div className="text-6xl sm:text-8xl mb-6">📁</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                No Projects Yet
              </h2>
              <p className="text-base-content/60 mb-8 text-sm sm:text-base">
                Create a project first to start adding tasks
              </p>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-base-100 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md text-center">
              <div className="text-6xl sm:text-8xl mb-6">📝</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                No tasks found
              </h2>
              <p className="text-base-content/60 mb-8 text-sm sm:text-base">
                Create your first task or adjust filters
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-accent btn-lg gap-2"
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
                Create Task
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="card-body p-6">
                  {/* Task Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="card-title text-lg flex-1 min-w-0 break-words">
                      {getPriorityIcon(task.priority)} {task.title}
                    </h3>
                    <div className="dropdown dropdown-end">
                      <label
                        tabIndex={0}
                        className="btn btn-ghost btn-sm btn-circle"
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
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <a onClick={() => handleEdit(task)}>
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => handleDelete(task._id)}
                            className="text-error"
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
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`badge ${getPriorityColor(
                        task.priority
                      )} badge-sm`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`badge ${getStatusColor(
                        task.status
                      )} badge-sm`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="divider my-2"></div>

                  {/* Task Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                      <span className="font-semibold">Project:</span>
                      <span className="truncate">{task.project?.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="font-semibold">Assigned:</span>
                      <span className="truncate">
                        {task.assignedMember?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Task Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6 sticky top-0 bg-base-100 pb-4 border-b z-10">
                <div className="text-4xl">✍️</div>
                <h3 className="font-bold text-2xl">
                  {editTask ? "Edit Task" : "Create New Task"}
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Task Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Design landing page"
                    className="input input-bordered input-lg"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
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
                    placeholder="Detailed description of the task..."
                    className="textarea textarea-bordered textarea-lg h-24"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-semibold">Project</span>
                  </label>
                  <select
                    className="select select-bordered select-lg"
                    value={formData.project}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProject && (
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Assign to Member
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="select select-bordered flex-1"
                        value={formData.assignedMember.memberId}
                        onChange={(e) => handleMemberChange(e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {selectedProject.team.members.map((member) => (
                          <option key={member._id} value={member._id}>
                            {member.name} ({member.currentTasks}/
                            {member.capacity})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAutoAssign}
                        className="btn btn-secondary"
                      >
                        Auto-assign
                      </button>
                    </div>

                    {showWarning && overloadedMember && (
                      <div className="alert alert-warning mt-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <span>
                          {overloadedMember.name} has{" "}
                          {overloadedMember.currentTasks} tasks but capacity is{" "}
                          {overloadedMember.capacity}. Assign anyway?
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Priority</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="Low">🟢 Low</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="High">🔴 High</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Status</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="In Progress">🔄 In Progress</option>
                      <option value="Done">✅ Done</option>
                    </select>
                  </div>
                </div>

                <div className="modal-action sticky bottom-0 bg-base-100 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent gap-2">
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
                    {editTask ? "Update" : "Create"} Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
