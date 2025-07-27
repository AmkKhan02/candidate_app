"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Badge } from "./components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Search,
  Filter,
  X,
  Plus,
  MoreHorizontal,
  Calendar,
  Hash,
  Type,
  ToggleLeft,
} from "lucide-react";

// Utility function
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

// Types
interface DataRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  submittedAt: string;
  workAvailability: string;
  annualSalaryExpectation: number;
  workExperience: string;
  education: string;
  skills: string[];
}

interface FilterCondition {
  id: string;
  column: string;
  operator: string;
  value: string;
  dataType: 'text' | 'number' | 'date' | 'boolean';
}

// Filter operators by data type
const FILTER_OPERATORS = {
  text: [
    { value: 'is', label: 'is' },
    { value: 'is_not', label: 'is not' },
    { value: 'contains', label: 'contains' },
    { value: 'does_not_contain', label: 'does not contain' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' },
    { value: 'is_empty', label: 'is empty' },
    { value: 'is_not_empty', label: 'is not empty' },
  ],
  number: [
    { value: 'equals', label: 'is equal to' },
    { value: 'not_equals', label: 'is not equal to' },
    { value: 'greater_than', label: 'is greater than' },
    { value: 'greater_than_equal', label: 'is greater than or equal to' },
    { value: 'less_than', label: 'is less than' },
    { value: 'less_than_equal', label: 'is less than or equal to' },
    { value: 'is_empty', label: 'is empty' },
    { value: 'is_not_empty', label: 'is not empty' },
  ],
  date: [
    { value: 'is', label: 'is' },
    { value: 'is_before', label: 'is before' },
    { value: 'is_after', label: 'is after' },
    { value: 'is_on_or_before', label: 'is on or before' },
    { value: 'is_on_or_after', label: 'is on or after' },
    { value: 'is_empty', label: 'is empty' },
    { value: 'is_not_empty', label: 'is not empty' },
    { value: 'last_7_days', label: 'is in the last 7 days' },
    { value: 'next_30_days', label: 'is in the next 30 days' },
    { value: 'is_today', label: 'is today' },
    { value: 'is_yesterday', label: 'is yesterday' },
    { value: 'is_tomorrow', label: 'is tomorrow' },
  ],
  boolean: [
    { value: 'is_true', label: 'is checked / is true' },
    { value: 'is_false', label: 'is unchecked / is false' },
  ],
};

// Column definitions
const COLUMNS = [
  { key: 'name', label: 'Name', type: 'text' as const },
  { key: 'email', label: 'Email', type: 'text' as const },
  { key: 'phone', label: 'Phone', type: 'text' as const },
  { key: 'location', label: 'Location', type: 'text' as const },
  { key: 'submittedAt', label: 'Submitted At', type: 'date' as const },
  { key: 'workAvailability', label: 'Work Availability', type: 'text' as const },
  { key: 'annualSalaryExpectation', label: 'Annual Salary Expectation', type: 'number' as const },
  { key: 'workExperience', label: 'Work Experience', type: 'text' as const },
  { key: 'education', label: 'Education', type: 'text' as const },
  { key: 'skills', label: 'Skills', type: 'text' as const },
];

// Sample data
const SAMPLE_DATA: DataRow[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        location: 'New York, NY',
        submittedAt: '2024-07-26',
        workAvailability: 'Full-time',
        annualSalaryExpectation: 80000,
        workExperience: '5 years',
        education: "Bachelor's Degree",
        skills: ['React', 'TypeScript', 'Node.js'],
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '098-765-4321',
        location: 'San Francisco, CA',
        submittedAt: '2024-07-25',
        workAvailability: 'Part-time',
        annualSalaryExpectation: 65000,
        workExperience: '3 years',
        education: "Master's Degree",
        skills: ['Vue.js', 'JavaScript', 'CSS'],
    },
];

// Filter logic
function applyFilter(data: DataRow[], condition: FilterCondition): DataRow[] {
  return data.filter(row => {
    let cellValue = row[condition.column as keyof DataRow];
    if (condition.column === 'skills' && Array.isArray(cellValue)) {
      cellValue = cellValue.join(', ');
    }
    const filterValue = condition.value;

    switch (condition.operator) {
      case 'is':
        return String(cellValue).toLowerCase() === filterValue.toLowerCase();
      case 'is_not':
        return String(cellValue).toLowerCase() !== filterValue.toLowerCase();
      case 'contains':
        return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      case 'does_not_contain':
        return !String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      case 'starts_with':
        return String(cellValue).toLowerCase().startsWith(filterValue.toLowerCase());
      case 'ends_with':
        return String(cellValue).toLowerCase().endsWith(filterValue.toLowerCase());
      case 'is_empty':
        return !cellValue || String(cellValue).trim() === '';
      case 'is_not_empty':
        return cellValue && String(cellValue).trim() !== '';
      case 'equals':
        return Number(cellValue) === Number(filterValue);
      case 'not_equals':
        return Number(cellValue) !== Number(filterValue);
      case 'greater_than':
        return Number(cellValue) > Number(filterValue);
      case 'greater_than_equal':
        return Number(cellValue) >= Number(filterValue);
      case 'less_than':
        return Number(cellValue) < Number(filterValue);
      case 'less_than_equal':
        return Number(cellValue) <= Number(filterValue);
      case 'is_true':
        return Boolean(cellValue) === true;
      case 'is_false':
        return Boolean(cellValue) === false;
      default:
        return true;
    }
  });
}

// Filter Component
function FilterConditionComponent({
  condition,
  onUpdate,
  onRemove,
}: {
  condition: FilterCondition;
  onUpdate: (condition: FilterCondition) => void;
  onRemove: () => void;
}) {
  const column = COLUMNS.find(col => col.key === condition.column);
  const operators = FILTER_OPERATORS[condition.dataType] || [];
  const needsValue = !['is_empty', 'is_not_empty', 'is_true', 'is_false'].includes(condition.operator);

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <Select
        value={condition.column}
        onValueChange={(value) => {
          const newColumn = COLUMNS.find(col => col.key === value);
          if (newColumn) {
            onUpdate({
              ...condition,
              column: value,
              dataType: newColumn.type,
              operator: FILTER_OPERATORS[newColumn.type][0].value,
              value: '',
            });
          }
        }}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COLUMNS.map(col => (
            <SelectItem key={col.key} value={col.key}>
              {col.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(value) => onUpdate({ ...condition, operator: value })}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operators.map(op => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {needsValue && (
        <Input
          placeholder="Value"
          value={condition.value}
          onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
          className="w-32"
        />
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Main Component
function SpreadsheetApp() {
  const [data, setData] = useState<DataRow[]>(SAMPLE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Apply search and filters
  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchQuery) {
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    filters.forEach(filter => {
      if (filter.column && filter.operator && (filter.value || ['is_empty', 'is_not_empty', 'is_true', 'is_false'].includes(filter.operator))) {
        result = applyFilter(result, filter);
      }
    });

    return result;
  }, [data, searchQuery, filters]);

  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: Date.now().toString(),
      column: COLUMNS[0].key,
      operator: FILTER_OPERATORS[COLUMNS[0].type][0].value,
      value: '',
      dataType: COLUMNS[0].type,
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (id: string, updatedFilter: FilterCondition) => {
    setFilters(filters.map(filter => filter.id === id ? updatedFilter : filter));
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const deleteRow = (id: string) => {
    setData(data.filter(row => row.id !== id));
  };

  const duplicateRow = (id: string) => {
    const rowToDuplicate = data.find(row => row.id === id);
    if (rowToDuplicate) {
      const duplicatedRow = { ...rowToDuplicate, id: Date.now().toString() };
      setData([...data, duplicatedRow]);
    }
  };

  const editRow = (id: string) => {
    // Placeholder for edit functionality
    console.log("Editing row:", id);
  };

  const deleteSelectedRows = () => {
    const newData = data.filter(row => !selectedRows.has(row.id));
    setData(newData);
    setSelectedRows(new Set());
  };

  const toggleRowSelection = (id: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(row => row.id)));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Candidate Processing</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Import
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button onClick={addFilter} variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search across all columns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Active Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters([])}
              className="text-muted-foreground"
            >
              Clear All
            </Button>
          </div>
          <div className="space-y-2">
            {filters.map(filter => (
              <FilterConditionComponent
                key={filter.id}
                condition={filter}
                onUpdate={(updated) => updateFilter(filter.id, updated)}
                onRemove={() => removeFilter(filter.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredData.length} of {data.length} rows
          {selectedRows.size > 0 && ` (${selectedRows.size} selected)`}
        </span>
        <div className="flex items-center">
          {selectedRows.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSelectedRows}
              className="mr-2"
            >
              Delete ({selectedRows.size})
            </Button>
          )}
          {(searchQuery || filters.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilters([]);
              }}
            >
              Reset all filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              {COLUMNS.map(column => (
                <TableHead key={column.key} className="font-medium">
                  <div className="flex items-center gap-2">
                    {column.type === 'text' && <Type className="h-4 w-4" />}
                    {column.type === 'number' && <Hash className="h-4 w-4" />}
                    {column.type === 'date' && <Calendar className="h-4 w-4" />}
                    {column.label === 'Skills' && <ToggleLeft className="h-4 w-4" />}
                    {column.label}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(row => (
              <TableRow
                key={row.id}
                className={cn(
                  "hover:bg-muted/50",
                  selectedRows.has(row.id) && "bg-muted/30"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={() => toggleRowSelection(row.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.submittedAt}</TableCell>
                <TableCell>{row.workAvailability}</TableCell>
                <TableCell>${row.annualSalaryExpectation.toLocaleString()}</TableCell>
                <TableCell>{row.workExperience}</TableCell>
                <TableCell>{row.education}</TableCell>
                <TableCell>{(row.skills || []).join(', ')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => editRow(row.id)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateRow(row.id)}>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteRow(row.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No data matches your current filters.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setFilters([]);
            }}
            className="mt-4"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default SpreadsheetApp;
