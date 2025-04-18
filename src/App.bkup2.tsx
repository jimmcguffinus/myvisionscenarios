// src/App.tsx - Reverting to known good state (Backup + Dialog Fixes)
import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { parse } from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,      // Keep this import
  DialogDescription // Keep this import
} from '@/components/ui/dialog';
import EditModal from '@/components/EditModal';
import { Scenario } from './types';

async function loadCSVData(): Promise<Scenario[]> {
  console.log('Fetching CSV...');
  const res = await fetch('/vision_scenarios_reduced.csv');
  const text = await res.text();
  const result = parse(text, { header: true, skipEmptyLines: true });
  if (result.errors.length) {
    console.error('CSV parse errors:', result.errors);
    return [];
  }
  const scenarios = (result.data as Scenario[]).filter(r => r.ID && r.Summary);
  console.log('Parsed scenarios:', scenarios.length);
  return scenarios;
}

export default function App() {
  const [data, setData] = useState<Scenario[]>([]);
  const [filtered, setFiltered] = useState<Scenario[]>([]);
  const [sorted, setSorted] = useState<Scenario[]>([]);
  const [query, setQuery] = useState('');
  const [sortCfg, setSortCfg] = useState<{ key: keyof Scenario; direction: 'asc' | 'desc' } | null>(null);
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<Scenario | null>(null);

  useEffect(() => {
    console.log('App mounted - Reverted to Backup State'); // Updated log
    loadCSVData()
      .then(list => {
        console.log('Loaded data count:', list.length);
        setData(list);
        setFiltered(list);
        setSorted(list);
      })
      .catch(() => toast.error('Failed loading data'));
  }, []);

  useEffect(() => {
    if (!data.length) return;
    if (!query) {
      setFiltered(data);
      return;
    }
    const parts = query.split(' AND ').map(s => s.trim());
    setFiltered(
      data.filter(item =>
        parts.every(f => {
          if (f.includes(' -eq ')) {
            const [col, val] = f.split(' -eq ');
            return (
              String(item[col.trim() as keyof Scenario])
                .toLowerCase() ===
              val.trim().replace(/^['"]|['"]$/g, '').toLowerCase()
            );
          }
          if (f.includes(' -gt ')) {
            const [col, val] = f.split(' -gt ');
            return (
              Number(item[col.trim() as keyof Scenario]) >
              Number(val.trim())
            );
          }
          if (f.includes(' -lt ')) {
            const [col, val] = f.split(' -lt ');
            return (
              Number(item[col.trim() as keyof Scenario]) <
              Number(val.trim())
            );
          }
          const kw = f.toLowerCase();
          return (
            item.Summary.toLowerCase().includes(kw) ||
            item.Narrative?.toLowerCase().includes(kw) ||
            item.CuratedWords?.toLowerCase().includes(kw)
          );
        })
      )
    );
  }, [query, data]);

  useEffect(() => {
    let arr = [...filtered];
    if (sortCfg) {
      arr.sort((a, b) => {
        const av = a[sortCfg.key] ?? '';
        const bv = b[sortCfg.key] ?? '';
        if (sortCfg.direction === 'asc') {
          return av < bv ? -1 : av > bv ? 1 : 0;
        } else {
          return av > bv ? -1 : av < bv ? 1 : 0;
        }
      });
    }
    console.log('Sorted data count:', arr.length);
    setSorted(arr);
  }, [sortCfg, filtered]);

  const doSort = (k: keyof Scenario) => {
    let dir: 'asc' | 'desc' = 'asc';
    if (sortCfg?.key === k && sortCfg.direction === 'asc') dir = 'desc';
    setSortCfg({ key: k, direction: dir });
  };
  const onSearch = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const onReset = () => setQuery('');
  const onRow = (itm: Scenario) => {
    console.log('Row clicked:', itm);
    setSel(itm);
    setOpen(true);
  };
  const onSave = (up: Scenario) => {
    if (!up.CuratedWords?.trim()) return toast.error('CuratedWords cannot be empty');
    setData(d => d.map(x => (x.ID === up.ID ? up : x)));
    setOpen(false);
    toast.success(`Saved ${up.ID}`);
  };
  const onDel = useCallback((id: string) => {
    if (!confirm(`Delete ${id}?`)) return;
    setData(d => d.filter(x => x.ID !== id));
    setOpen(false);
    toast.success(`Deleted ${id}`);
  }, []);

  return (
    // Using the App container styles directly again
    <div className="p-4 min-h-screen bg-[#022d17] text-[#d9c7f0]">
      <ToastContainer position="top-right" theme="colored" />
      <h1 className="text-4xl font-extrabold mb-6 text-[#b48ead]">
        Vision Scenarios - Reverted
      </h1>

      {/* Search bar */}
      <div className="flex mb-4 space-x-2">
        <input
          className="flex-1 px-4 py-2 rounded border border-[#5e4b8b] bg-[#0a3a21] text-[#d9c7f0] placeholder-[#a5a0b3]"
          placeholder="Search or filter (e.g. drv -eq 'Y')"
          value={query}
          onChange={onSearch}
        />
        <Button
          onClick={onReset}
          variant="outline"
          className="border-[#5e4b8b] text-[#d9c7f0] hover:bg-[#5e4b8b]/20"
        >
          Reset
        </Button>
      </div>

      {/* Counts */}
      <div className="mb-4 text-[#a5a0b3]">
        Showing <span className="font-semibold text-[#d9c7f0]">{sorted.length}</span> /
        <span className="font-semibold text-[#d9c7f0]">{data.length}</span> scenarios
      </div>

      {/* Table */}
      <Table className="bg-[#043119] border border-[#5e4b8b]">
        <TableHeader className="bg-[#01220f]">
          <TableRow>
            {[
              { key: 'ID', keyName: 'ID', label: 'ID' },
              { key: 'Summary', keyName: 'Summary', label: 'Summary' },
              { key: 'DangerRanking', keyName: 'DangerRanking', label: 'Danger' },
              { key: 'drv', keyName: 'drv', label: 'drv' },
            ].map(col => (
              <TableHead
                key={col.keyName}
                onClick={() => doSort(col.key as keyof Scenario)}
                className="cursor-pointer px-6 py-3 text-[#cbb9f5] hover:text-[#b48ead] select-none"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
             <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-red-500">
                  No scenarios found or loaded. Check CSV.
                </TableCell>
             </TableRow>
          ) : (
            sorted.map(s => (
              <TableRow
                key={s.ID}
                onClick={() => onRow(s)}
                className="hover:bg-[#064d16] cursor-pointer"
              >
                <TableCell className="px-6 py-2">{s.ID}</TableCell>
                <TableCell
                  className="px-6 py-2 hover:underline hover:shadow-[0_0_8px_#b48ead] transition-shadow"
                  title="Click to edit"
                >
                  {s.Summary}
                </TableCell>
                <TableCell className="px-6 py-2">{s.DangerRanking}</TableCell>
                <TableCell className="px-6 py-2">{s.drv}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Modal - Needs DialogTitle/Description */}
      {sel && (
        <Dialog open={open} onOpenChange={setOpen}>
          {/* Let dialog.tsx handle content styling */}
          <DialogContent className=""> {/* Remove sizing/styling from here */}
            {/* Add Title/Description for accessibility and structure */}
            <DialogTitle>Edit Scenario {sel.ID}</DialogTitle>
            <DialogDescription>Modify the scenario details below.</DialogDescription>
            <EditModal
              scenario={sel}
              onSave={onSave}
              onDelete={onDel}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}