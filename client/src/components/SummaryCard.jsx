// components/SummaryCard.jsx
export default function SummaryCard({ text }) {
  return (
    <div className="p-4 mb-4 border rounded-lg bg-white shadow-sm">
      <p className="text-gray-700">{text}</p>
    </div>
  );
}
