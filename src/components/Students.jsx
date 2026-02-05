export default function Students({ students = [] }) {
  if (!students.length) return null;

  return (
    <div className="my-24">
      <div className="max-h-[400px] overflow-y-auto overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-base-200 z-10">
            <tr className="text-left border-b border-base-300">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Ism</th>
              <th className="px-4 py-3 font-semibold">Familiya</th>
              <th className="px-4 py-3 font-semibold">Bosqich</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {students.map((s, i) => (
              <tr key={i} className="hover:bg-base-200 transition-colors">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{s.first_name}</td>
                <td className="px-4 py-3">{s.last_name}</td>
                <td className="px-4 py-3">{s.group_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
