import { withAuth } from "@clerk/nextjs";

const Dashboard = () => {
  return <div>Welcome to the Dashboard</div>;
};

export default withAuth(Dashboard);
