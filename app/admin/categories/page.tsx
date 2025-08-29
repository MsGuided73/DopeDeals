export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories & Brands</h1>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Category</button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Add Brand</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Categories/brands management UI will appear here.</p>
      </div>
    </div>
  );
}

