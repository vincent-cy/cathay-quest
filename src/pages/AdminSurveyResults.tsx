// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Download, Trash2, Eye } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// interface SurveyResult {
//   userId: string;
//   userName: string;
//   email: string;
//   timestamp: string;
//   completedAt: string;
//   responses: Record<string, string | string[]>;
// }

// export default function AdminSurveyResults() {
//   const [results, setResults] = useState<SurveyResult[]>([]);
//   const [selectedResult, setSelectedResult] = useState<SurveyResult | null>(null);

//   useEffect(() => {
//     // Load from localStorage
//     const saved = localStorage.getItem('surveyResults');
//     if (saved) {
//       setResults(JSON.parse(saved));
//     }
//   }, []);

//   const downloadResults = () => {
//     const dataStr = JSON.stringify(results, null, 2);
//     const dataBlob = new Blob([dataStr], { type: 'application/json' });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `survey-results-${new Date().toISOString().split('T')[0]}.json`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   const deleteResult = (userId: string) => {
//     setResults(results.filter(r => r.userId !== userId));
//     const updated = results.filter(r => r.userId !== userId);
//     localStorage.setItem('surveyResults', JSON.stringify(updated));
//   };

//   const clearAllResults = () => {
//     if (window.confirm('Are you sure you want to clear all survey results?')) {
//       setResults([]);
//       localStorage.removeItem('surveyResults');
//     }
//   };

//   const getResponseLabel = (questionId: string, value: string | string[]) => {
//     const question = [
//       { id: "travel", label: "Travel Interests" },
//       { id: "sustainability", label: "Sustainability" },
//       { id: "activities", label: "Activities" },
//       { id: "frequency", label: "Flight Frequency" },
//       { id: "tripDuration", label: "Trip Duration" },
//       { id: "accessibility", label: "Accessibility" },
//       { id: "rewards", label: "Reward Motivation" },
//       { id: "groupTravel", label: "Travel Group" },
//     ].find(q => q.id === questionId);

//     const displayValue = Array.isArray(value) ? value.join(", ") : value;
//     return { label: question?.label || questionId, value: displayValue };
//   };

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-foreground mb-2">Survey Results</h1>
//           <p className="text-muted-foreground">Total Responses: {results.length}</p>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-3 mb-6">
//           <Button
//             onClick={downloadResults}
//             disabled={results.length === 0}
//             className="flex items-center gap-2"
//           >
//             <Download className="w-4 h-4" />
//             Download JSON
//           </Button>
//           <Button
//             onClick={clearAllResults}
//             variant="destructive"
//             disabled={results.length === 0}
//           >
//             Clear All Results
//           </Button>
//         </div>

//         {/* Results Table */}
//         <Card className="overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-muted">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-sm font-semibold">User ID</th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold">User Name</th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Completed At</th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {results.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
//                       No survey results yet
//                     </td>
//                   </tr>
//                 ) : (
//                   results.map((result) => (
//                     <tr key={result.userId} className="border-t border-border hover:bg-muted/50">
//                       <td className="px-6 py-4 text-sm font-mono">{result.userId}</td>
//                       <td className="px-6 py-4 text-sm">{result.userName}</td>
//                       <td className="px-6 py-4 text-sm">{result.email}</td>
//                       <td className="px-6 py-4 text-sm">{result.completedAt}</td>
//                       <td className="px-6 py-4 text-sm space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelectedResult(result)}
//                           className="inline-flex items-center gap-1"
//                         >
//                           <Eye className="w-3 h-3" />
//                           View
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => deleteResult(result.userId)}
//                           className="inline-flex items-center gap-1"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </div>

//       {/* Detail View Dialog */}
//       <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
//         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//           {selectedResult && (
//             <>
//               <DialogHeader>
//                 <DialogTitle>Survey Response Details</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-6 py-4">
//                 {/* User Info */}
//                 <div className="space-y-2">
//                   <h3 className="font-bold text-foreground">User Information</h3>
//                   <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
//                     <div>
//                       <p className="text-xs text-muted-foreground">User ID</p>
//                       <p className="font-mono text-sm">{selectedResult.userId}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">User Name</p>
//                       <p className="font-semibold text-sm">{selectedResult.userName}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Email</p>
//                       <p className="text-sm">{selectedResult.email}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Completed At</p>
//                       <p className="text-sm">{selectedResult.completedAt}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Survey Responses */}
//                 <div className="space-y-3">
//                   <h3 className="font-bold text-foreground">Survey Responses</h3>
//                   {Object.entries(selectedResult.responses).map(([questionId, value]) => {
//                     const { label, value: displayValue } = getResponseLabel(questionId, value);
//                     return (
//                       <div key={questionId} className="p-3 bg-card border border-border rounded-lg">
//                         <p className="text-xs text-muted-foreground font-semibold mb-1">{label}</p>
//                         <p className="text-sm text-foreground">{displayValue}</p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Eye, Upload } from "lucide-react"; // Make sure to import the Upload icon
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define an interface for our survey data
interface SurveyResult {
  userId: string;
  userName: string;
  email: string;
  timestamp: string;
  completedAt: string;
  responses: Record<string, string | string[]>;
}

// Define a type for the expected API response
interface ApiResponse {
  status: "success" | "error";
  message: string;
  details?: string;
}

export default function AdminSurveyResults() {
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SurveyResult | null>(
    null
  );

  const [isPushing, setIsPushing] = useState(false);
  const [pushMessage, setPushMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("surveyResults");
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  const pushToDynamoDB = async () => {
    if (results.length === 0) {
      setPushMessage("No results to push.");
      return;
    }

    setIsPushing(true);
    setPushMessage("Pushing results to the database...");

    try {
      const response = await fetch("http://localhost:5000/api/push-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results),
      });

      // Explicitly type the response data
      const responseData = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(
          responseData.message || "An unknown error occurred on the server."
        );
      }

      setPushMessage(`Success: ${responseData.message}`);
      // FIX: Catch error as 'unknown' for better type safety
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      // FIX: Check the type of the error before using it
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Failed to push to DynamoDB:", errorMessage);
      setPushMessage(`Error: ${errorMessage}`);
    } finally {
      setIsPushing(false);
    }
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `survey-results-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteResult = (userId: string) => {
    const updated = results.filter((r) => r.userId !== userId);
    setResults(updated);
    localStorage.setItem("surveyResults", JSON.stringify(updated));
  };

  const clearAllResults = () => {
    if (window.confirm("Are you sure you want to clear all survey results?")) {
      setResults([]);
      localStorage.removeItem("surveyResults");
    }
  };

  // FIX: Added an explicit return type to prevent the 'void' error
  const getResponseLabel = (
    questionId: string,
    value: string | string[]
  ): { label: string; value: string } => {
    const question = [
      { id: "travel", label: "Travel Interests" },
      { id: "sustainability", label: "Sustainability" },
      { id: "activities", label: "Activities" },
      { id: "frequency", label: "Flight Frequency" },
      { id: "tripDuration", label: "Trip Duration" },
      { id: "accessibility", label: "Accessibility" },
      { id: "rewards", label: "Reward Motivation" },
      { id: "groupTravel", label: "Travel Group" },
    ].find((q) => q.id === questionId);

    const displayValue = Array.isArray(value) ? value.join(", ") : value;

    // Using optional chaining `?.` ensures we don't crash if `question` is not found
    return { label: question?.label || questionId, value: displayValue };
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Survey Results
          </h1>
          <p className="text-muted-foreground">
            Total Responses: {results.length}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={downloadResults}
            disabled={results.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </Button>

          <Button
            onClick={pushToDynamoDB}
            disabled={results.length === 0 || isPushing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isPushing ? "Pushing to DB..." : "Push to DB"}
          </Button>

          <Button
            onClick={clearAllResults}
            variant="destructive"
            disabled={results.length === 0}
          >
            Clear All Results
          </Button>
        </div>

        {/* Display feedback message */}
        {pushMessage && (
          <div
            className={`p-3 rounded-md text-sm mb-4 ${
              pushMessage.startsWith("Error")
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {pushMessage}
          </div>
        )}

        {/* Results Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* ... your table header ... */}
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Completed At
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* ... your table body ... */}
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No survey results yet
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr
                      key={result.userId}
                      className="border-t border-border hover:bg-muted/50"
                    >
                      <td className="px-6 py-4 text-sm font-mono">
                        {result.userId}
                      </td>
                      <td className="px-6 py-4 text-sm">{result.userName}</td>
                      <td className="px-6 py-4 text-sm">{result.email}</td>
                      <td className="px-6 py-4 text-sm">
                        {result.completedAt}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedResult(result)}
                          className="inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteResult(result.userId)}
                          className="inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Detail View Dialog ... remains unchanged */}
      <Dialog
        open={!!selectedResult}
        onOpenChange={() => setSelectedResult(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedResult && (
            <>
              <DialogHeader>
                <DialogTitle>Survey Response Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* User Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">
                    User Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-mono text-sm">
                        {selectedResult.userId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User Name</p>
                      <p className="font-semibold text-sm">
                        {selectedResult.userName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{selectedResult.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Completed At
                      </p>
                      <p className="text-sm">{selectedResult.completedAt}</p>
                    </div>
                  </div>
                </div>

                {/* Survey Responses */}
                <div className="space-y-3">
                  <h3 className="font-bold text-foreground">
                    Survey Responses
                  </h3>
                  {Object.entries(selectedResult.responses).map(
                    ([questionId, value]) => {
                      const { label, value: displayValue } = getResponseLabel(
                        questionId,
                        value
                      );
                      return (
                        <div
                          key={questionId}
                          className="p-3 bg-card border border-border rounded-lg"
                        >
                          <p className="text-xs text-muted-foreground font-semibold mb-1">
                            {label}
                          </p>
                          <p className="text-sm text-foreground">
                            {displayValue}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
