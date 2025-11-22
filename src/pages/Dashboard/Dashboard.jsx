import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import { dashboardAPI } from "../../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reassigning, setReassigning] = useState(false);
  const [message, setMessage] = useState("");

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleReassignTasks = async () => {
    setReassigning(true);
    setMessage("");

    try {
      const response = await dashboardAPI.reassignTasks();
      setMessage(response.data.message);
      await fetchStats();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reassign tasks");
    } finally {
      setReassigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-lg">Welcome, {user?.name}!</p>
      </div>

      {message && (
        <div className="alert alert-success mb-6">
          <span>{message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Projects</div>
          <div className="stat-value text-primary">
            {stats?.totalProjects || 0}
          </div>
          <div className="stat-actions">
            <Link to="/projects" className="btn btn-sm btn-primary">
              View Projects
            </Link>
          </div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Tasks</div>
          <div className="stat-value text-secondary">
            {stats?.totalTasks || 0}
          </div>
          <div className="stat-actions">
            <Link to="/tasks" className="btn btn-sm btn-secondary">
              View Tasks
            </Link>
          </div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Quick Actions</div>
          <div className="stat-actions mt-4 flex flex-col gap-2">
            <button
              onClick={handleReassignTasks}
              className={`btn btn-accent btn-sm ${
                reassigning ? "loading" : ""
              }`}
              disabled={reassigning}
            >
              Reassign Tasks
            </button>
            <Link to="/teams" className="btn btn-sm">
              Manage Teams
            </Link>
          </div>
        </div>
      </div>

      {/* Team Summary */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Team Summary</h2>

          {stats?.teamSummary?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No teams created yet</p>
              <Link to="/teams" className="btn btn-primary">
                Create Your First Team
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {stats?.teamSummary?.map((team) => (
                <div key={team.teamId} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3">{team.teamName}</h3>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Role</th>
                          <th>Current Tasks</th>
                          <th>Capacity</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.members.map((member) => (
                          <tr
                            key={member.memberId}
                            className={
                              member.isOverloaded
                                ? "bg-error bg-opacity-10"
                                : ""
                            }
                          >
                            <td>{member.name}</td>
                            <td>{member.role}</td>
                            <td>{member.currentTasks}</td>
                            <td>{member.capacity}</td>
                            <td>
                              {member.isOverloaded ? (
                                <span className="badge badge-error">
                                  Overloaded
                                </span>
                              ) : member.currentTasks === member.capacity ? (
                                <span className="badge badge-warning">
                                  Full
                                </span>
                              ) : (
                                <span className="badge badge-success">
                                  Available
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Reassignments */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Reassignments</h2>

          {stats?.recentLogs?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No recent reassignments
            </p>
          ) : (
            <div className="space-y-2">
              {stats?.recentLogs?.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Task "{log.taskTitle}" reassigned
                    </p>
                    <p className="text-sm text-gray-600">
                      From: {log.fromMember?.name || "Unassigned"} → To:{" "}
                      {log.toMember.name}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
