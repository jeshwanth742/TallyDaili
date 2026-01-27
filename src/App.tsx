import { useBudget } from './hooks/useBudget';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { Layout } from './components/Layout';
import { HistoryView } from './components/HistoryView';
import { Analytics } from './components/Analytics';
import { useBudgetStore } from './store/useBudgetStore';

function App() {
  const { budget, isLoading } = useBudget();
  const { activeTab } = useBudgetStore();

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen w-full flex items-center justify-center">
        <p className="text-primary font-mono animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!budget) return <Onboarding />;

  return (
    <Layout>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'history' && <HistoryView />}
      {activeTab === 'analytics' && <Analytics />}
    </Layout>
  );
}

export default App;
