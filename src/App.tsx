
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test component to verify React is working
const TestComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">App is Loading</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TestComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
