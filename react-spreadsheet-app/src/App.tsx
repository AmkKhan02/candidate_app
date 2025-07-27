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
  Star,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  FileText,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";

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
  workAvailability: 'Full-time' | 'Part-time';
  annualSalaryExpectation: number;
  workExperience: string;
  education: string;
  skills: string[];
  status: 'New' | 'Reviewed' | 'Interview Scheduled' | 'Rejected' | 'Hired';
  starred: boolean;
  notes: string;
  rating: number;
  rank: number;
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
  ],
  boolean: [
    { value: 'is_true', label: 'is checked / is true' },
    { value: 'is_false', label: 'is unchecked / is false' },
  ],
};

// Column definitions
const COLUMNS = [
  { key: 'rank', label: 'Rank', type: 'number' as const },
  { key: 'starred', label: '★', type: 'boolean' as const },
  { key: 'name', label: 'Name', type: 'text' as const },
  { key: 'status', label: 'Status', type: 'text' as const },
  { key: 'rating', label: 'Rating', type: 'number' as const },
  { key: 'location', label: 'Location', type: 'text' as const },
  { key: 'submittedAt', label: 'Submitted At', type: 'date' as const },
  { key: 'workAvailability', label: 'Availability', type: 'text' as const },
  { key: 'annualSalaryExpectation', label: 'Salary', type: 'number' as const },
  { key: 'workExperience', label: 'Experience', type: 'text' as const },
  { key: 'skills', label: 'Skills', type: 'text' as const },
  { key: 'notes', label: 'Notes', type: 'text' as const },
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
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'SQL', 'Docker'],
        status: 'New',
        starred: true,
        notes: 'Strong candidate with relevant experience in our tech stack.',
        rating: 4,
        rank: 1,
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
        skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML5', 'Sass'],
        status: 'Reviewed',
        starred: false,
        notes: '',
        rating: 3,
        rank: 2,
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
      case 'is': return String(cellValue).toLowerCase() === filterValue.toLowerCase();
      case 'is_not': return String(cellValue).toLowerCase() !== filterValue.toLowerCase();
      case 'contains': return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      case 'does_not_contain': return !String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      case 'starts_with': return String(cellValue).toLowerCase().startsWith(filterValue.toLowerCase());
      case 'ends_with': return String(cellValue).toLowerCase().endsWith(filterValue.toLowerCase());
      case 'is_empty': return !cellValue || String(cellValue).trim() === '';
      case 'is_not_empty': return cellValue && String(cellValue).trim() !== '';
      case 'equals': return Number(cellValue) === Number(filterValue);
      case 'not_equals': return Number(cellValue) !== Number(filterValue);
      case 'greater_than': return Number(cellValue) > Number(filterValue);
      case 'greater_than_equal': return Number(cellValue) >= Number(filterValue);
      case 'less_than': return Number(cellValue) < Number(filterValue);
      case 'less_than_equal': return Number(cellValue) <= Number(filterValue);
      case 'is_true': return Boolean(cellValue) === true;
      case 'is_false': return Boolean(cellValue) === false;
      default: return true;
    }
  });
}

// Components
function FilterConditionComponent({ condition, onUpdate, onRemove }: { condition: FilterCondition; onUpdate: (condition: FilterCondition) => void; onRemove: () => void; }) {
  const operators = FILTER_OPERATORS[condition.dataType] || [];
  const needsValue = !['is_empty', 'is_not_empty', 'is_true', 'is_false'].includes(condition.operator);

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-background rounded-lg border">
      <Select value={condition.column} onValueChange={(value) => {
        const newColumn = COLUMNS.find(col => col.key === value);
        if (newColumn) onUpdate({ ...condition, column: value, dataType: newColumn.type, operator: FILTER_OPERATORS[newColumn.type][0].value, value: '' });
      }}>
        <SelectTrigger className="w-36 flex-shrink-0"><SelectValue /></SelectTrigger>
        <SelectContent>{COLUMNS.map(col => <SelectItem key={col.key} value={col.key}>{col.label}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={condition.operator} onValueChange={(value) => onUpdate({ ...condition, operator: value })}>
        <SelectTrigger className="w-40 flex-shrink-0"><SelectValue /></SelectTrigger>
        <SelectContent>{operators.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}</SelectContent>
      </Select>
      {needsValue && <Input placeholder="Value" value={condition.value} onChange={(e) => onUpdate({ ...condition, value: e.target.value })} className="w-36 flex-shrink-0" />}
      <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 ml-auto"><X className="h-4 w-4" /></Button>
    </div>
  );
}

function SkillsCell({ skills }: { skills: string[] }) {
  const [showAll, setShowAll] = useState(false);
  if (!skills || skills.length === 0) return <span className="text-muted-foreground">-</span>;
  const displayedSkills = showAll ? skills : skills.slice(0, 3);

  return (
    <div className="flex flex-wrap gap-1 items-center max-w-xs">
      {displayedSkills.map(skill => <Badge key={skill} variant="secondary" className="font-normal">{skill}</Badge>)}
      {skills.length > 3 && (
        <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={(e) => { e.stopPropagation(); setShowAll(!showAll); }}>
          {showAll ? 'Show less' : `+${skills.length - 3} more`}
        </Button>
      )}
    </div>
  );
}

function Rating({ value, onUpdate }: { value: number; onUpdate: (newValue: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={cn("h-4 w-4 cursor-pointer transition-colors", value >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50 hover:text-yellow-400")}
          onClick={(e) => { e.stopPropagation(); onUpdate(star); }}
        />
      ))}
    </div>
  );
}

function CandidateDetailView({ candidate, onUpdate }: { candidate: DataRow; onUpdate: (id: string, key: keyof DataRow, value: any) => void; }) {
  const handleUpdate = (key: keyof DataRow, value: any) => {
    onUpdate(candidate.id, key, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input value={candidate.email} onChange={(e) => handleUpdate('email', e.target.value)} placeholder="Email" className="bg-background" />
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <Input value={candidate.phone} onChange={(e) => handleUpdate('phone', e.target.value)} placeholder="Phone" className="bg-background" />
          </div>
          <div className="flex items-center gap-2 col-span-full">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input value={candidate.location} onChange={(e) => handleUpdate('location', e.target.value)} placeholder="Location" className="bg-background" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Professional Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Input value={candidate.workExperience} onChange={(e) => handleUpdate('workExperience', e.target.value)} placeholder="Work Experience" className="bg-background" />
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <Input value={candidate.education} onChange={(e) => handleUpdate('education', e.target.value)} placeholder="Education" className="bg-background" />
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Input type="number" value={candidate.annualSalaryExpectation} onChange={(e) => handleUpdate('annualSalaryExpectation', Number(e.target.value))} placeholder="Salary Expectation" className="bg-background" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Skills</h3>
        <Input
          value={candidate.skills.join(', ')}
          onChange={(e) => handleUpdate('skills', e.target.value.split(',').map(s => s.trim()))}
          placeholder="Skills (comma-separated)"
          className="bg-background"
        />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Notes</h3>
        <textarea
          className="w-full bg-transparent p-2 rounded-lg min-h-[80px] border"
          value={candidate.notes}
          onChange={(e) => handleUpdate('notes', e.target.value)}
          placeholder="No notes yet."
        />
      </div>
    </div>
  );
}

// Main Component
function SpreadsheetApp() {
  const [data, setData] = useState<DataRow[]>(SAMPLE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStarred, setShowStarred] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: keyof DataRow; direction: 'ascending' | 'descending' } | null>({ key: 'submittedAt', direction: 'descending' });
  const [activeCandidate, setActiveCandidate] = useState<DataRow | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnKey: string } | null>(null);

  const displayedCandidate = activeCandidate ? data.find(c => c.id === activeCandidate.id) : null;

  const filteredData = useMemo(() => {
    let result = data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (showStarred) {
      result = result.filter(row => row.starred);
    }

    filters.forEach(filter => {
      if (filter.column && filter.operator && (filter.value || !['is_empty', 'is_not_empty', 'is_true', 'is_false'].includes(filter.operator))) {
        result = applyFilter(result, filter);
      }
    });
    return result;
  }, [data, searchQuery, filters, showStarred]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof DataRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const addFilter = () => setFilters([...filters, { id: Date.now().toString(), column: 'name', operator: 'contains', value: '', dataType: 'text' }]);
  const updateFilter = (id: string, updated: FilterCondition) => setFilters(filters.map(f => f.id === id ? updated : f));
  const removeFilter = (id: string) => setFilters(filters.filter(f => f.id !== id));
  const deleteRow = (id: string) => setData(data.filter(row => row.id !== id));
  const duplicateRow = (id: string) => {
    const row = data.find(r => r.id === id);
    if (row) setData([...data, { ...row, id: Date.now().toString() }]);
  };
  const toggleRowSelection = (id: string) => {
    const newSelection = new Set(selectedRows);
    newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
    setSelectedRows(newSelection);
  };
  const toggleAllRows = () => setSelectedRows(selectedRows.size === sortedData.length ? new Set() : new Set(sortedData.map(r => r.id)));
  const updateRow = (id: string, key: keyof DataRow, value: any) => setData(data.map(row => row.id === id ? { ...row, [key]: value } : row));

  const handleAddCandidate = () => {
    const newCandidate: DataRow = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      location: '',
      submittedAt: new Date().toISOString().split('T')[0],
      workAvailability: 'Full-time',
      annualSalaryExpectation: 0,
      workExperience: '',
      education: '',
      skills: [],
      status: 'New',
      starred: false,
      notes: '',
      rating: 0,
      rank: Math.max(...data.map(r => r.rank), 0) + 1,
    };
    setData([...data, newCandidate]);
    setActiveCandidate(newCandidate);
  };

  const checkRank = (rank: number, id: string) => {
    if (rank < 1) return false;
    return !data.some(row => row.rank === rank && row.id !== id);
  };

  const bulkUpdateStatus = (status: DataRow['status']) => {
    setData(data.map(row => selectedRows.has(row.id) ? { ...row, status } : row));
    setSelectedRows(new Set());
  };

  const bulkDelete = () => {
    setData(data.filter(row => !selectedRows.has(row.id)));
    setSelectedRows(new Set());
  };

  const exportToCsv = () => {
    const headers = COLUMNS.map(c => c.label).join(',');
    const rows = sortedData.map(row =>
      COLUMNS.map(col => {
        const value = row[col.key as keyof DataRow];
        if (Array.isArray(value)) {
          return `"${value.join(', ')}"`;
        }
        return `"${value}"`;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'candidates.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 bg-background text-foreground">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Candidate Pipeline</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Import</Button>
          <Button variant="outline" size="sm" onClick={exportToCsv}>Export</Button>
          <Button onClick={addFilter} variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filter</Button>
          <Button size="sm" onClick={handleAddCandidate}><Plus className="h-4 w-4 mr-2" />Add Candidate</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, skill, location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          {searchQuery && <Button variant="ghost" size="icon" onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"><X className="h-4 w-4" /></Button>}
        </div>
        <Button
          variant={showStarred ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setShowStarred(!showStarred)}
          className="h-9 w-9"
        >
          <Star className={cn("h-4 w-4", showStarred ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
        </Button>
        {selectedRows.size > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-muted p-2 border">
            <span className="text-sm font-medium pl-2">{selectedRows.size} selected</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Update Status
                  <ArrowUpDown className="h-3 w-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => bulkUpdateStatus('New')}>New</DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkUpdateStatus('Reviewed')}>Reviewed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkUpdateStatus('Interview Scheduled')}>Interview Scheduled</DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkUpdateStatus('Hired')}>Hired</DropdownMenuItem>
                <DropdownMenuItem onClick={() => bulkUpdateStatus('Rejected')}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="destructive" size="sm" onClick={bulkDelete}>Delete ({selectedRows.size})</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows(new Set())}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {filters.length > 0 && (
        <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Active Filters</h3>
            <Button variant="link" size="sm" onClick={() => setFilters([])} className="text-primary hover:text-primary/80">Clear All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map(filter => <FilterConditionComponent key={filter.id} condition={filter} onUpdate={(updated) => updateFilter(filter.id, updated)} onRemove={() => removeFilter(filter.id)} />)}
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12 text-center"><Checkbox checked={selectedRows.size > 0 && selectedRows.size === sortedData.length} onCheckedChange={toggleAllRows} /></TableHead>
              {COLUMNS.map(col => (
                <TableHead key={col.key} onClick={() => requestSort(col.key as keyof DataRow)} className="cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    {col.label}
                    {sortConfig?.key === col.key && <ArrowUpDown className="h-3 w-3 text-muted-foreground" />}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map(row => (
              <TableRow key={row.id} onDoubleClick={() => setActiveCandidate(row)} className={cn("cursor-pointer hover:bg-muted/50", selectedRows.has(row.id) && "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/60")}>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}><Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => toggleRowSelection(row.id)} /></TableCell>
                <TableCell onClick={(e) => { e.stopPropagation(); setEditingCell({ rowId: row.id, columnKey: 'rank' }); }}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'rank' ? (
                    <Input
                      autoFocus
                      type="number"
                      defaultValue={row.rank}
                      onBlur={(e) => {
                        const newRank = Number(e.target.value);
                        if (checkRank(newRank, row.id)) {
                          updateRow(row.id, 'rank', newRank);
                        } else {
                          alert("Invalid rank. Rank must be a unique number and greater than 0.");
                        }
                        setEditingCell(null);
                      }}
                      className="h-8 w-16"
                    />
                  ) : (
                    <div className="p-2 border border-transparent hover:border-gray-300 rounded-md w-16 text-center">
                      {row.rank}
                    </div>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}><Star className={cn("h-5 w-5 cursor-pointer", row.starred ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30 hover:text-yellow-400")} onClick={() => updateRow(row.id, 'starred', !row.starred)} /></TableCell>
                <TableCell className="font-medium" onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: 'name' })}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'name' ? (
                    <Input
                      autoFocus
                      defaultValue={row.name}
                      onBlur={(e) => {
                        updateRow(row.id, 'name', e.target.value);
                        setEditingCell(null);
                      }}
                      className="h-8"
                    />
                  ) : (
                    row.name
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select value={row.status} onValueChange={(value) => updateRow(row.id, 'status', value)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Reviewed">Reviewed</SelectItem>
                      <SelectItem value="Interview Scheduled">Interview</SelectItem>
                      <SelectItem value="Hired">Hired</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()} onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: 'rating' })}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'rating' ? (
                    <Input
                      autoFocus
                      type="number"
                      defaultValue={row.rating}
                      onBlur={(e) => {
                        updateRow(row.id, 'rating', Number(e.target.value));
                        setEditingCell(null);
                      }}
                      className="h-8 w-16"
                    />
                  ) : (
                    <Rating value={row.rating} onUpdate={(newRating) => updateRow(row.id, 'rating', newRating)} />
                  )}
                </TableCell>
                <TableCell onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: 'location' })}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'location' ? (
                    <Input
                      autoFocus
                      defaultValue={row.location}
                      onBlur={(e) => {
                        updateRow(row.id, 'location', e.target.value);
                        setEditingCell(null);
                      }}
                      className="h-8"
                    />
                  ) : (
                    row.location
                  )}
                </TableCell>
                <TableCell onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: 'submittedAt' })}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'submittedAt' ? (
                    <Input
                      autoFocus
                      type="date"
                      defaultValue={row.submittedAt}
                      onBlur={(e) => {
                        updateRow(row.id, 'submittedAt', e.target.value);
                        setEditingCell(null);
                      }}
                      className="h-8"
                    />
                  ) : (
                    new Date(row.submittedAt).toLocaleDateString()
                  )}
                </TableCell>
                <TableCell onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: 'workAvailability' })}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'workAvailability' ? (
                    <Select
                      defaultValue={row.workAvailability}
                      onValueChange={(value) => {
                        updateRow(row.id, 'workAvailability', value);
                        setEditingCell(null);
                      }}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={row.workAvailability === 'Full-time' ? 'default' : 'outline'} className="font-medium">{row.workAvailability}</Badge>
                  )}
                </TableCell>
                <TableCell onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: 'annualSalaryExpectation' })}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'annualSalaryExpectation' ? (
                    <Input
                      autoFocus
                      type="number"
                      defaultValue={row.annualSalaryExpectation}
                      onBlur={(e) => {
                        updateRow(row.id, 'annualSalaryExpectation', Number(e.target.value));
                        setEditingCell(null);
                      }}
                      className="h-8"
                    />
                  ) : (
                    `$${row.annualSalaryExpectation.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: 'workExperience' })}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'workExperience' ? (
                    <Input
                      autoFocus
                      defaultValue={row.workExperience}
                      onBlur={(e) => {
                        updateRow(row.id, 'workExperience', e.target.value);
                        setEditingCell(null);
                      }}
                      className="h-8"
                    />
                  ) : (
                    row.workExperience
                  )}
                </TableCell>
                <TableCell><SkillsCell skills={row.skills} /></TableCell>
                <TableCell onDoubleClick={() => setEditingCell({ rowId: row.id, columnKey: 'notes' })}>
                  {editingCell?.rowId === row.id && editingCell?.columnKey === 'notes' ? (
                    <Input
                      autoFocus
                      defaultValue={row.notes}
                      onBlur={(e) => {
                        updateRow(row.id, 'notes', e.target.value);
                        setEditingCell(null);
                      }}
                      className="h-8"
                    />
                  ) : (
                    <div className="w-40 truncate" title={row.notes}>{row.notes || <span className="text-muted-foreground">-</span>}</div>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => duplicateRow(row.id)}>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteRow(row.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{selectedRows.size} of {sortedData.length} rows selected.</span>
        <span>Showing {sortedData.length} of {data.length} total candidates.</span>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No candidates match your criteria.</p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setFilters([]); }} className="mt-4">Clear all filters</Button>
        </div>
      )}

      <Sheet open={!!displayedCandidate} onOpenChange={(open) => !open && setActiveCandidate(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {displayedCandidate && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl">{displayedCandidate.name}</SheetTitle>
                <SheetDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{displayedCandidate.workAvailability}</span>
                    <span className="text-xs">&bull;</span>
                    <span>Applied on {new Date(displayedCandidate.submittedAt).toLocaleDateString()}</span>
                  </div>
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <CandidateDetailView candidate={displayedCandidate} onUpdate={updateRow} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SpreadsheetApp;
