import "./App.css";
import Route from "./pages/route";
import { UserProvider } from "./pages/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Route />
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
