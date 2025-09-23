const StatsBar = ({ totalRows, filteredRows, currentPage, totalPages, modifiedCount }) => (
  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-blue-600">{totalRows.toLocaleString()}</div>
        <div className="text-sm text-gray-600">Total Records</div>
      </div>
      <div className="bg-green-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-green-600">{filteredRows.toLocaleString()}</div>
        <div className="text-sm text-gray-600">Filtered</div>
      </div>
      <div className="bg-purple-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-purple-600">{currentPage}</div>
        <div className="text-sm text-gray-600">Current Page</div>
      </div>
      <div className="bg-orange-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-orange-600">{totalPages}</div>
        <div className="text-sm text-gray-600">Total Pages</div>
      </div>
      <div className="bg-red-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-red-600">{modifiedCount}</div>
        <div className="text-sm text-gray-600">Modified</div>
      </div>
    </div>
  </div>
);

export default StatsBar;