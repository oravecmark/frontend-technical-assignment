import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface LabelsFormProps {
  onComplete: (data: LabelsFormData) => void;
  onValidationFail?: () => void;
  initialData?: LabelsFormData;
}

export interface LabelsFormData {
  labels: Label[];
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

function LabelsForm({ onComplete, onValidationFail, initialData }: LabelsFormProps) {
  const defaultLabels: Label[] = [
    { id: '1', name: 'High Priority', color: '#EF4444' },
    { id: '2', name: 'Revenue', color: '#10B981' },
    { id: '3', name: 'Expense', color: '#F59E0B' },
  ];

  const [labels, setLabels] = useState<Label[]>(initialData?.labels || defaultLabels);
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch colors from API
  const { data: colors, isLoading: loadingColors } = useQuery({
    queryKey: ['colors'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/color');
      return res.json();
    },
  });

  const handleAddLabel = () => {
    const newErrors: Record<string, string> = {};

    if (!newLabelName.trim()) {
      newErrors.labelName = 'Label name is required';
    }
    if (!selectedColor) {
      newErrors.color = 'Please select a color';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newLabel: Label = {
      id: Date.now().toString(),
      name: newLabelName.trim(),
      color: selectedColor,
    };

    setLabels((prev) => [...prev, newLabel]);
    setNewLabelName('');
    setSelectedColor('');
    setErrors({});
  };

  const handleRemoveLabel = (id: string) => {
    setLabels((prev) => prev.filter((label) => label.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ labels });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Labels */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Current Labels</h4>
        <p className="text-xs text-gray-500 mb-3">
          Labels help you categorize and filter accounts, transactions, and reports
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {labels.map((label) => (
            <div
              key={label.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200"
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
              <span>{label.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveLabel(label.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Label */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Label</h4>

        <div className="grid grid-cols-[1fr,auto,auto] gap-3 items-start">
          {/* Label Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label Name</label>
            <input
              type="text"
              value={newLabelName}
              onChange={(e) => {
                setNewLabelName(e.target.value);
                if (errors.labelName) setErrors((prev) => ({ ...prev, labelName: '' }));
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.labelName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter label name"
            />
            {errors.labelName && <p className="text-red-500 text-sm mt-1">{errors.labelName}</p>}
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex gap-2">
              {loadingColors ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : (
                colors?.map((color: any) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color.hex);
                      if (errors.color) setErrors((prev) => ({ ...prev, color: '' }));
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.hex ? 'border-gray-900 scale-110' : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))
              )}
            </div>
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
          </div>

          {/* Add Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 invisible">Add</label>
            <button
              type="button"
              onClick={handleAddLabel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Complete Setup Button */}
      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Complete Setup
        </button>
      </div>
    </form>
  );
}

export default LabelsForm;
