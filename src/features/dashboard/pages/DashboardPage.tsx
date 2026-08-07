export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back. Here's an overview of your workspace.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <h2 className="mt-3 text-3xl font-semibold">24</h2>
          <p className="mt-1 text-sm text-emerald-600">+3 this month</p>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <h2 className="mt-3 text-3xl font-semibold">1,248</h2>
          <p className="mt-1 text-sm text-emerald-600">+12.5%</p>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <h2 className="mt-3 text-3xl font-semibold">$18.4k</h2>
          <p className="mt-1 text-sm text-emerald-600">+8.2%</p>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
          <h2 className="mt-3 text-3xl font-semibold">82%</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            41 of 50 completed
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-2xl border bg-card p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Recent Activity</h2>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">New project created</p>
                <p className="text-sm text-muted-foreground">
                  Marketing Website
                </p>
              </div>
              <span className="text-sm text-muted-foreground">2h ago</span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Invoice paid</p>
                <p className="text-sm text-muted-foreground">
                  Acme Corporation
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New team member</p>
                <p className="text-sm text-muted-foreground">
                  Sarah joined the workspace
                </p>
              </div>
              <span className="text-sm text-muted-foreground">3d ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Quick Actions</h2>

          <div className="mt-6 space-y-3">
            <button className="w-full rounded-xl border px-4 py-3 text-left transition hover:bg-muted">
              Create Project
            </button>

            <button className="w-full rounded-xl border px-4 py-3 text-left transition hover:bg-muted">
              Invite Team
            </button>

            <button className="w-full rounded-xl border px-4 py-3 text-left transition hover:bg-muted">
              View Reports
            </button>

            <button className="w-full rounded-xl border px-4 py-3 text-left transition hover:bg-muted">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
