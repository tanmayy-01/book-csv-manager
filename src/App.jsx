import React, { useCallback, useMemo, useRef, useState } from "react";
import { generateFakeBooks } from "./utils/dataGenerator";
import * as Papa from 'papaparse';
import { downloadCSV } from "./utils/csvUtils";
import LoadingSpinner from "./components/LoadingSpinner";
import StatsBar from "./components/StatusBar";
import EditableCell from "./components/EditableCell";
import { Upload, Download, RotateCcw, Search, Filter, BookOpen, Plus} from "lucide-react";

const App = () => {
  // State Management
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterGenre, setFilterGenre] = useState('');
  const fileInputRef = useRef(null);

  // Generate fake data on component mount
  React.useEffect(() => {
    const fakeData = generateFakeBooks(10000);
    setData(fakeData);
    setOriginalData([...fakeData]);
  }, []);

  // File Upload Handler
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      complete: (results) => {
        try {
          const processedData = results.data
            .filter(row => row.Title && row.Author) // Filter out empty rows
            .map((row, index) => ({
              id: index + 1,
              Title: row.Title || '',
              Author: row.Author || '',
              Genre: row.Genre || '',
              PublishedYear: row.PublishedYear || '',
              ISBN: row.ISBN || '',
              isModified: false
            }));
          
          setData(processedData);
          setOriginalData([...processedData]);
          setCurrentPage(1);
        } catch (error) {
          console.error(error)
          alert('Error processing CSV file. Please check the format.');
        } finally {
          setLoading(false);
        }
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        alert('Error reading CSV file: ' + error.message);
        setLoading(false);
      }
    });
  }, []);

  // Load fake data
  const loadFakeData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const fakeData = generateFakeBooks(10000);
      setData(fakeData);
      setOriginalData([...fakeData]);
      setCurrentPage(1);
      setLoading(false);
    }, 1000);
  }, []);

  // Reset all edits
  const resetAllEdits = useCallback(() => {
    setData([...originalData]);
    setCurrentPage(1);
  }, [originalData]);

  // Cell edit handler
  const handleCellEdit = useCallback((rowIndex, column, newValue) => {
    setData(prevData => {
      const newData = [...prevData];
      const actualIndex = (currentPage - 1) * rowsPerPage + rowIndex;
      if (newData[actualIndex]) {
        newData[actualIndex] = {
          ...newData[actualIndex],
          [column]: newValue,
          isModified: true
        };
      }
      return newData;
    });
  }, [currentPage, rowsPerPage]);

  // Sorting handler
  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesGenre = !filterGenre || item.Genre === filterGenre;
      return matchesSearch && matchesGenre;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, filterGenre, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Get unique genres for filter
  const uniqueGenres = useMemo(() => 
    [...new Set(data.map(item => item.Genre))].filter(Boolean).sort(),
    [data]
  );

  // Count modified records
  const modifiedCount = data.filter(item => item.isModified).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Book CSV Manager</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload, edit, filter, and manage your book collection data with ease. 
            Edit cells directly, filter by genre, sort columns, and download your changes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload CSV
            </button>
            
            <button
              onClick={loadFakeData}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-2" />
              Generate Sample Data
            </button>
            
            <button
              onClick={resetAllEdits}
              disabled={modifiedCount === 0}
              className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset All Edits
            </button>
            
            <button
              onClick={() => downloadCSV(data, 'books_edited.csv')}
              disabled={data.length === 0}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md cursor-pointer"
            >
              <Download className="w-5 h-5 mr-2" />
              Download CSV
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {data.length > 0 && (
          <>
            {/* Statistics */}
            <StatsBar
              totalRows={data.length}
              filteredRows={filteredAndSortedData.length}
              currentPage={currentPage}
              totalPages={totalPages}
              modifiedCount={modifiedCount}
            />

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search books, authors, genres..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="">All Genres</option>
                    {uniqueGenres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Title', 'Author', 'Genre', 'PublishedYear', 'ISBN'].map(column => (
                        <th
                          key={column}
                          onClick={() => handleSort(column)}
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{column}</span>
                            {sortConfig.key === column && (
                              <span className="text-blue-600">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.map((row, index) => (
                      <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${row.isModified ? 'bg-yellow-25' : ''}`}>
                        <td className="px-6 py-2 border-r">
                          <EditableCell
                            value={row.Title}
                            onSave={(newValue) => handleCellEdit(index, 'Title', newValue)}
                            isModified={row.isModified}
                          />
                        </td>
                        <td className="px-6 py-2 border-r">
                          <EditableCell
                            value={row.Author}
                            onSave={(newValue) => handleCellEdit(index, 'Author', newValue)}
                            isModified={row.isModified}
                          />
                        </td>
                        <td className="px-6 py-2 border-r">
                          <EditableCell
                            value={row.Genre}
                            onSave={(newValue) => handleCellEdit(index, 'Genre', newValue)}
                            isModified={row.isModified}
                          />
                        </td>
                        <td className="px-6 py-2 border-r">
                          <EditableCell
                            value={row.PublishedYear}
                            onSave={(newValue) => handleCellEdit(index, 'PublishedYear', newValue)}
                            isModified={row.isModified}
                          />
                        </td>
                        <td className="px-6 py-2">
                          <EditableCell
                            value={row.ISBN}
                            onSave={(newValue) => handleCellEdit(index, 'ISBN', newValue)}
                            isModified={row.isModified}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredAndSortedData.length)} to{' '}
                      {Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)} of{' '}
                      {filteredAndSortedData.length} results
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`cursor-pointer px-4 py-2 text-sm rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {data.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Data Available</h3>
            <p className="text-gray-500 mb-6">Upload a CSV file or generate sample data to get started.</p>
            <div className="space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Upload CSV
              </button>
              <button
                onClick={loadFakeData}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                Generate Sample Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;