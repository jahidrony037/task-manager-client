import { useEffect, useState } from "react";

import { Link } from "react-router";
import { projectAPI, teamAPI } from "../../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    team: "",
  });
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, teamsRes] = await Promise.all([
        projectAPI.getAll(),
        teamAPI.getAll(),
      ]);
      setProjects(projectsRes.data);
      setTeams(teamsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      if (editProject) {
        await projectAPI.update(editProject._id, formData);
      } else {
        await projectAPI.create(formData);
      }
      setFormData({ name: "", description: "", team: "" });
      setShowModal(false);
      setEditProject(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save project");
    }
  };

  const handleEditProject = (project) => {
    setEditProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      team: project.team._id,
    });
    setShowModal(true);
  };

  const handleDeleteProject = async (id) => {
    if (
      confirm(
        "Are you sure you want to delete this project? All associated tasks will remain but need reassignment."
      )
    ) {
      try {
        await projectAPI.delete(id);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete project");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", team: "" });
    setEditProject(null);
    setShowModal(false);
  };

  //   const getProjectColor = (index) => {
  //     const colors = [
  //       "primary",
  //       "secondary",
  //       "accent",
  //       "info",
  //       "success",
  //       "warning",
  //     ];
  //     return colors[index % colors.length];
  //   };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <span className="loading loading-spinner loading-lg text-secondary"></span>
            {/* <div className="absolute inset-0 loading loading-spinner loading-lg text-secondary opacity-30 blur-sm"></div> */}
          </div>
          <p className="mt-6 text-lg font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section with Animation */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
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
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Projects
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                    Manage your projects and collaborate with teams
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* View Mode Toggle */}
              <div className="join shadow-lg">
                <button
                  className={`join-item btn btn-sm sm:btn-md ${
                    viewMode === "grid" ? "btn-secondary" : "btn-ghost"
                  }`}
                  onClick={() => setViewMode("grid")}
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  className={`join-item btn btn-sm sm:btn-md ${
                    viewMode === "list" ? "btn-secondary" : "btn-ghost"
                  }`}
                  onClick={() => setViewMode("list")}
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="btn btn-secondary btn-sm sm:btn-md lg:btn-lg gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-linear-to-r from-purple-500 to-pink-500 border-0"
                disabled={teams.length === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
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
                <span className="hidden sm:inline">Create Project</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {projects.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-purple-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
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
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {projects.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Projects
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-blue-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
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
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {teams.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Active Teams
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-pink-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-pink-600 dark:text-pink-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {projects.reduce(
                        (sum, p) => sum + (p.team?.members?.length || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Team Members
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-green-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {
                        projects.filter(
                          (p) =>
                            new Date(p.createdAt) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This Week
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* No Teams Warning */}
        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md text-center border border-gray-100 dark:border-gray-700">
                <div className="text-8xl mb-6 animate-bounce">⚠️</div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  No Teams Yet
                </h2>
                <p className="text-base-content/60 mb-8 text-sm sm:text-base">
                  Create a team first to unlock the power of project
                  collaboration
                </p>
                <Link
                  to="/teams"
                  className="btn btn-lg gap-3 bg-linear-to-r from-purple-500 to-pink-500 border-0 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Create Your First Team
                </Link>
              </div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md text-center border border-gray-100 dark:border-gray-700">
                <div className="text-8xl mb-6 animate-bounce">🚀</div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ready to Launch?
                </h2>
                <p className="text-base-content/60 mb-8 text-sm sm:text-base">
                  Create your first project and start organizing tasks with your
                  team
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-lg gap-3 bg-linear-to-r from-blue-500 to-purple-500 border-0 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
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
                  Create Your First Project
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Projects Display */
          <div
            className={`animate-fade-in ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {projects.map((project, index) =>
              viewMode === "grid" ? (
                /* Grid View */
                <div
                  key={project._id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* Gradient Border Top */}
                  <div
                    className={`h-2 bg-linear-to-r ${
                      index % 6 === 0
                        ? "from-purple-500 to-pink-500"
                        : index % 6 === 1
                        ? "from-blue-500 to-cyan-500"
                        : index % 6 === 2
                        ? "from-green-500 to-emerald-500"
                        : index % 6 === 3
                        ? "from-orange-500 to-red-500"
                        : index % 6 === 4
                        ? "from-yellow-500 to-orange-500"
                        : "from-pink-500 to-purple-500"
                    }`}
                  ></div>

                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`p-3 rounded-xl shadow-lg bg-linear-to-br ${
                          index % 6 === 0
                            ? "from-purple-500 to-pink-500"
                            : index % 6 === 1
                            ? "from-blue-500 to-cyan-500"
                            : index % 6 === 2
                            ? "from-green-500 to-emerald-500"
                            : index % 6 === 3
                            ? "from-orange-500 to-red-500"
                            : index % 6 === 4
                            ? "from-yellow-500 to-orange-500"
                            : "from-pink-500 to-purple-500"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
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
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(project.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    <div className="divider my-3"></div>

                    {/* Team Info Card */}
                    <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-purple-600 dark:text-purple-400"
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
                        </div>
                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                          Team:
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {project.team?.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-600 dark:text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {project.team?.members?.length || 0} Members
                          </span>
                        </div>

                        {/* Team Members Avatars */}
                        {project.team?.members?.length > 0 && (
                          <div className="flex -space-x-3">
                            {project.team.members
                              .slice(0, 4)
                              .map((member, idx) => (
                                <div
                                  key={idx}
                                  className="avatar placeholder"
                                  title={member.name}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-linear-to-br ${
                                      idx % 4 === 0
                                        ? "from-purple-500 to-pink-500"
                                        : idx % 4 === 1
                                        ? "from-blue-500 to-cyan-500"
                                        : idx % 4 === 2
                                        ? "from-green-500 to-emerald-500"
                                        : "from-orange-500 to-red-500"
                                    } text-white shadow-lg`}
                                  >
                                    <span className="text-xs font-bold">
                                      {member.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            {project.team.members.length > 4 && (
                              <div className="avatar placeholder">
                                <div className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-400 dark:bg-gray-600 text-white shadow-lg">
                                  <span className="text-xs font-bold">
                                    +{project.team.members.length - 4}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/tasks?project=${project._id}`}
                        className="flex-1 btn btn-sm bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white shadow-lg hover:shadow-xl transition-all gap-2"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="btn btn-sm btn-ghost text-error gap-2"
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
              ) : (
                /* List View */
                <div
                  key={project._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl shadow-lg bg-linear-to-br ${
                        index % 6 === 0
                          ? "from-purple-500 to-pink-500"
                          : index % 6 === 1
                          ? "from-blue-500 to-cyan-500"
                          : index % 6 === 2
                          ? "from-green-500 to-emerald-500"
                          : index % 6 === 3
                          ? "from-orange-500 to-red-500"
                          : index % 6 === 4
                          ? "from-yellow-500 to-orange-500"
                          : "from-pink-500 to-purple-500"
                      } flex-shrink-0`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
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
                    </div>

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                        {project.description || "No description"}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
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
                          {project.team?.name}
                        </span>
                        <span className="flex items-center gap-1">
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
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          {project.team?.members?.length || 0} members
                        </span>
                        <span className="flex items-center gap-1">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Team Avatars */}
                    {project.team?.members?.length > 0 && (
                      <div className="flex -space-x-2 flex-shrink-0">
                        {project.team.members.slice(0, 5).map((member, idx) => (
                          <div
                            key={idx}
                            className="avatar placeholder"
                            title={member.name}
                          >
                            <div
                              className={`w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-800 bg-linear-to-br ${
                                idx % 4 === 0
                                  ? "from-purple-500 to-pink-500"
                                  : idx % 4 === 1
                                  ? "from-blue-500 to-cyan-500"
                                  : idx % 4 === 2
                                  ? "from-green-500 to-emerald-500"
                                  : "from-orange-500 to-red-500"
                              } text-white shadow-lg`}
                            >
                              <span className="text-sm font-bold">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {project.team.members.length > 5 && (
                          <div className="avatar placeholder">
                            <div className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-400 dark:bg-gray-600 text-white shadow-lg">
                              <span className="text-sm font-bold">
                                +{project.team.members.length - 5}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        to={`/tasks?project=${project._id}`}
                        className="btn btn-sm bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white shadow-lg gap-2"
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span className="hidden sm:inline">Tasks</span>
                      </Link>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="btn btn-sm btn-ghost"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="btn btn-sm btn-ghost text-error"
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
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Create/Edit Project Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-gray-800 dark:text-white">
                    {editProject ? "Edit Project" : "Create New Project"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {editProject
                      ? "Update project details"
                      : "Set up your new project"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateProject}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                      Project Name
                    </span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., E-commerce Website Redesign"
                    className="input input-bordered input-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                      Description
                    </span>
                  </label>
                  <textarea
                    placeholder="Describe the project goals, scope, and key deliverables..."
                    className="textarea textarea-bordered textarea-lg h-32 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <label className="label">
                    <span className="label-text-alt text-gray-500 dark:text-gray-400">
                      A clear description helps team members understand the
                      project better
                    </span>
                  </label>
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                      Assign Team
                    </span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <select
                    className="select select-bordered select-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
                    value={formData.team}
                    onChange={(e) =>
                      setFormData({ ...formData, team: e.target.value })
                    }
                    required
                  >
                    <option value="">Choose a team for this project</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name} - {team.members.length} member
                        {team.members.length !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <label className="label">
                    <span className="label-text-alt text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Team members will be able to work on tasks in this project
                    </span>
                  </label>
                </div>

                <div className="modal-action pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white shadow-lg gap-2"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {editProject ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Projects;
