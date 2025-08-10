// components/SummarySkeleton.jsx
export default function SummarySkeleton() {
  return (
    <div className="animate-pulse p-4 mb-4 border rounded-lg">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
}
