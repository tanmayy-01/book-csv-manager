import { Check, Edit3, X } from "lucide-react";
import { useState } from "react";

const EditableCell = ({ value, onSave, isModified }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        />
        <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
          <Check size={14} />
        </button>
        <button onClick={handleCancel} className="p-1 text-red-600 hover:bg-red-50 rounded">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-between group cursor-pointer p-2 rounded ${isModified ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-gray-50'}`}
      onClick={() => setIsEditing(true)}
    >
      <span className={`text-sm ${isModified ? 'text-yellow-800 font-medium' : 'text-gray-900'}`}>
        {value}
      </span>
      <Edit3 size={12} className="opacity-0 group-hover:opacity-50 text-gray-400" />
    </div>
  );
};

export default EditableCell;