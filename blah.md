
```markdown
--- START: src/main.tsx ---
```

```tsx
// src/main.tsx - CORRECT version for routing
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.tsx'; // App will define routes
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

```markdown
--- END: src/main.tsx ---
```


```markdown
--- START: src/App.tsx ---
```

```tsx
// src/App.tsx - CLEANED - Router Definition Only
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScenarioListPage from './pages/ScenarioListPage';

function App() {
  // No console logs needed here
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ScenarioListPage />} />
        {/* Other routes */}
      </Route>
    </Routes>
  );
}

export default App;
```

```markdown
--- END: src/App.tsx ---
```


```markdown
--- START: src/components/Layout.tsx ---
```

```tsx
// src/components/Layout.tsx - CLEANED + Visual Timestamp
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  // Visual Timestamp
  const deploymentTimestamp = "2025-04-22_T22:15Z"; // <<< UPDATE THIS MANUALLY >>>

  return (
    <div className="min-h-screen bg-[#022d17] text-[#d9c7f0] p-4">
      <ToastContainer position="top-right" theme="colored" />
      <header className="mb-6">
         <h1 className="text-4xl font-extrabold text-[#b48ead]">
           Vision Scenarios (TOC Layout)
         </h1>
         {/* Display Timestamp */}
         <p className="text-xs text-[#a5a0b3] mt-1">Deployed: {deploymentTimestamp}</p>
         <nav className="mt-2 border-b border-[#5e4b8b] pb-2">
            <span className="mr-4 text-[#a5a0b3]">Nav Placeholder:</span>
         </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

```markdown
--- END: src/components/Layout.tsx ---
```


```markdown
--- START: src/pages/ScenarioListPage.tsx ---
```

```tsx
// src/pages/ScenarioListPage.tsx - FULL Logic & JSX Restored
import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { parse } from 'papaparse';
import { toast } from 'react-toastify';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead, // Ensure this is used
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import EditModal from '@/components/EditModal';
import { Scenario } from '../types';

async function loadCSVData(): Promise<Scenario[]> {
  // Keep error log
  const res = await fetch('/vision_scenarios_reduced.csv');
  const text = await res.text();
  const result = parse(text, { header: true, skipEmptyLines: true });
  if (result.errors.length) {
    console.error('ListPage: CSV parse errors:', result.errors);
    return [];
  }
  const scenarios = (result.data as Scenario[]).filter(r => r.ID && r.Summary);
  return scenarios;
}

export default function ScenarioListPage() {
  const [data, setData] = useState<Scenario[]>([]);
  const [filtered, setFiltered] = useState<Scenario[]>([]);
  const [sorted, setSorted] = useState<Scenario[]>([]);
  const [query, setQuery] = useState('');
  const [sortCfg, setSortCfg] = useState<{ key: keyof Scenario; direction: 'asc' | 'desc' } | null>(null); // Keep setSortCfg
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<Scenario | null>(null);

  useEffect(() => {
    loadCSVData()
      .then(list => {
        setData(list);
        setFiltered(list);
        setSorted(list);
      })
      .catch(() => toast.error('Failed loading data'));
  }, []);

  // Filter useEffect - RESTORED FULL LOGIC
  useEffect(() => {
    if (!data.length) return;
    if (!query) {
      setFiltered(data);
      return;
    }
    const parts = query.split(' AND ').map(s => s.trim());
    setFiltered(
      data.filter(item => // Use 'item'
        parts.every(f => {
          if (f.includes(' -eq ')) {
            const [col, val] = f.split(' -eq ');
            return (
              String(item[col.trim() as keyof Scenario]) // Use 'item'
                .toLowerCase() ===
              val.trim().replace(/^['"]|['"]$/g, '').toLowerCase()
            );
          }
          if (f.includes(' -gt ')) {
            const [col, val] = f.split(' -gt ');
            return (
              Number(item[col.trim() as keyof Scenario]) > // Use 'item'
              Number(val.trim())
            );
          }
          if (f.includes(' -lt ')) {
            const [col, val] = f.split(' -lt ');
            return (
              Number(item[col.trim() as keyof Scenario]) < // Use 'item'
              Number(val.trim())
            );
          }
          const kw = f.toLowerCase(); // Use 'kw'
          // Use 'item' and 'kw'
          return (
            item.Summary.toLowerCase().includes(kw) ||
            (item.Narrative && item.Narrative.toLowerCase().includes(kw)) || // Add null check for optional fields
            (item.CuratedWords && item.CuratedWords.toLowerCase().includes(kw)) // Add null check for optional fields
          );
        })
      )
    );
  }, [query, data]);

  // Sort useEffect - RESTORED FULL LOGIC
  useEffect(() => {
    let arr = [...filtered];
    if (sortCfg) {
      arr.sort((a, b) => {
        const av = a[sortCfg.key] ?? ''; // Use sortCfg.key
        const bv = b[sortCfg.key] ?? ''; // Use sortCfg.key
        if (sortCfg.direction === 'asc') { // Use sortCfg.direction
          return av < bv ? -1 : av > bv ? 1 : 0;
        } else {
          return av > bv ? -1 : av < bv ? 1 : 0;
        }
      });
    }
    setSorted(arr);
  }, [sortCfg, filtered]); // Keep sortCfg dependency

  // Handlers - RESTORED FULL LOGIC
   const doSort = (k: keyof Scenario) => { // Use 'k' parameter
    let dir: 'asc' | 'desc' = 'asc';
    if (sortCfg?.key === k && sortCfg.direction === 'asc') dir = 'desc';
    setSortCfg({ key: k, direction: dir }); // Use setSortCfg
  };
  const onSearch = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const onReset = () => setQuery('');
  const onRow = (itm: Scenario) => {
    console.log('ListPage: Row clicked:', itm); // Keep log if desired
    setSel(itm);
    setOpen(true);
  };
   const onSave = (up: Scenario) => { // Use 'up' parameter
    if (!up.CuratedWords?.trim()) return toast.error('CuratedWords cannot be empty');
    setData(d => d.map(x => (x.ID === up.ID ? up : x)));
    setOpen(false);
    toast.success(`Saved ${up.ID}`);
  };
   const onDel = useCallback((id: string) => { // Use 'id' parameter
    if (!confirm(`Delete ${id}?`)) return;
    setData(d => d.filter(x => x.ID !== id));
    setOpen(false);
    toast.success(`Deleted ${id}`);
  }, []); // Keep useCallback dependencies if needed (though empty is fine here)

  return (
    <>
      {/* Search bar */}
      <div className="flex mb-4 space-x-2">
        <input
          className="flex-1 px-4 py-2 rounded border border-[#5e4b8b] bg-[#0a3a21] text-[#d9c7f0] placeholder-[#a5a0b3]"
          placeholder="Search or filter (e.g. drv -eq 'Y')" value={query} onChange={onSearch} />
        <Button onClick={onReset} variant="outline" className="border-[#5e4b8b] text-[#d9c7f0] hover:bg-[#5e4b8b]/20"> Reset </Button>
      </div>
      {/* Counts */}
      <div className="mb-4 text-[#a5a0b3]"> Showing <span className="font-semibold text-[#d9c7f0]">{sorted.length}</span> / <span className="font-semibold text-[#d9c7f0]">{data.length}</span> scenarios </div>
      {/* Table - RESTORED */}
      <Table className="bg-[#043119] border border-[#5e4b8b]">
        <TableHeader className="bg-[#01220f]">
          <TableRow>
            {/* Use TableHead */}
            {[
              { key: 'ID', keyName: 'ID', label: 'ID' },
              { key: 'Summary', keyName: 'Summary', label: 'Summary' },
              { key: 'DangerRanking', keyName: 'DangerRanking', label: 'Danger' },
              { key: 'drv', keyName: 'drv', label: 'drv' },
            ].map(col => (
              <TableHead // Use TableHead component
                key={col.keyName}
                onClick={() => doSort(col.key as keyof Scenario)} // Use doSort
                className="cursor-pointer px-6 py-3 text-[#cbb9f5] hover:text-[#b48ead] select-none"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
             <TableRow> <TableCell colSpan={4} className="text-center py-4 text-red-500"> No scenarios found or loaded. Check CSV. </TableCell> </TableRow>
          ) : (
            sorted.map(s => (
              <TableRow key={s.ID} onClick={() => onRow(s)} className="hover:bg-[#064d16] cursor-pointer">
                 <TableCell className="px-6 py-2">{s.ID}</TableCell>
                 <TableCell className="px-6 py-2 hover:underline hover:shadow-[0_0_8px_#b48ead] transition-shadow" title="Click to edit">{s.Summary}</TableCell>
                 <TableCell className="px-6 py-2">{s.DangerRanking}</TableCell>
                 <TableCell className="px-6 py-2">{s.drv}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Edit Modal */}
      {sel && (
        <Dialog key={sel.ID} open={open} onOpenChange={setOpen}>
          <DialogContent className="">
            <DialogTitle>Edit Scenario {sel.ID}</DialogTitle>
            <DialogDescription>Modify the scenario details below.</DialogDescription>
            {/* Pass correct handlers */}
            <EditModal scenario={sel} onSave={onSave} onDelete={onDel} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
```

```markdown
--- END: src/pages/ScenarioListPage.tsx ---
```


```markdown
--- START: src/components/EditModal.tsx ---
```

```tsx
// src/components/EditModal.tsx - FULL CODE with contrast + removed internal scroll
import { useState, useEffect, ChangeEvent } from "react";
import { Scenario } from "../types";

import { Button } from "@/components/ui/button";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from 'react-toastify';

interface EditModalProps {
  scenario: Scenario | null;
  onSave: (updatedScenario: Scenario) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

type Persona = "Serious" | "Top Ophthalmologist" | "Redneck" | "Hillbilly" | "TenYearOld";

const EditModal: React.FC<EditModalProps> = ({
  scenario,
  onSave,
  onDelete,
  onClose,
}) => {
  const [formData, setFormData] = useState<Scenario | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona>("Serious");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  useEffect(() => {
    setFormData(scenario);
    setAiResponse("");
    setSelectedPersona("Serious");
  }, [scenario]);

  if (!formData) {
    return null;
  }

  // --- Handlers (Restored Full Code) ---
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Scenario | null) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleSelectChange = (name: keyof Scenario | "persona") => (value: string) => {
    if (name === "persona") {
      setSelectedPersona(value as Persona);
    } else {
      setFormData((prev: Scenario | null) =>
        prev ? { ...prev, [name]: value } : null
      );
    }
  };

  const handleAiExplain = () => {
      if (!formData) return;
      setIsAiLoading(true);
      setAiResponse("");
      console.log("AI Explain clicked for:", formData.Summary, "with persona:", selectedPersona);

      // ** Placeholder AI Logic **
      setTimeout(() => {
          let explanation = `AI Explanation for '${formData.Summary}' (ID: ${formData.ID}) with persona '${selectedPersona}':\n`;
          explanation += `Impact: ${formData.Impact}\n`;
          explanation += `Narrative: ${formData.Narrative}\n`;
          explanation += `Curated: ${formData.CuratedWords}\n\n`;

          switch (selectedPersona) {
               case "Top Ophthalmologist":
                  explanation += `From an ophthalmological perspective...`;
                  break;
              case "Redneck":
                  explanation += `Well shoot, Jim...`;
                  break;
              case "Hillbilly":
                   explanation += `Lord have mercy...`;
                   break;
              case "TenYearOld":
                   explanation += `Whoa, so like...`;
                   break;
              case "Serious":
              default:
                  explanation += `Scenario ${formData.ID}...`;
                  break;
          }
          setAiResponse(explanation);
          setIsAiLoading(false);
      }, 1000);
  };

  const handleSaveChanges = () => {
      if (!formData) return;
      if (!formData.CuratedWords?.trim()) {
        toast.error('Error: Empty CuratedWords', { autoClose: 3000 });
        return;
      }
      onSave(formData);
  };

  const handleDeleteConfirm = () => {
      if (formData?.ID && confirm(`Delete Scenario ID ${formData.ID}?`)) {
        onDelete(formData.ID);
      }
  };

  const personaOptions: Persona[] = ["Serious", "Top Ophthalmologist", "Redneck", "Hillbilly", "TenYearOld"];
  // --- End Handlers ---

  const inputStyles = "bg-[#0a3a21] border-[#5e4b8b] text-[#d9c7f0] placeholder-[#a5a0b3] focus-visible:ring-[#b48ead] focus-visible:ring-offset-[#022d17]";
  const selectTriggerStyles = `col-span-3 ${inputStyles}`;
  const selectContentStyles = "bg-[#0a3a21] border-[#5e4b8b] text-[#d9c7f0]";
  const selectItemStyles = "hover:bg-[#064d16] focus:bg-[#064d16]";
  const labelStyles = "text-right text-[#a5a0b3]";

  return (
    <>
      {/* Form Grid directly inside DialogContent (no internal scroll div) */}
      <div className="grid gap-4 py-4 pr-2 text-[#d9c7f0]">

        {/* Form Fields with Contrast Styles */}
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ID" className={labelStyles}>ID</Label>
            <Input id="ID" name="ID" value={formData.ID} readOnly className={`col-span-3 bg-[#043119] border-[#5e4b8b] text-[#a5a0b3] cursor-not-allowed`} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Summary" className={labelStyles}>Summary</Label>
            <Input id="Summary" name="Summary" value={formData.Summary ?? ''} onChange={handleChange} className={`col-span-3 ${inputStyles}`} />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="DangerRanking" className={labelStyles}>Danger Ranking</Label>
            <Input id="DangerRanking" name="DangerRanking" type="number" min="1" max="10" value={formData.DangerRanking ?? ''} onChange={handleChange} className={`col-span-3 ${inputStyles}`} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="drv" className={labelStyles}>Devastating (drv)</Label>
            <Select name="drv" value={formData.drv} onValueChange={handleSelectChange("drv")}>
                <SelectTrigger className={selectTriggerStyles}><SelectValue placeholder="Select drv status" /></SelectTrigger>
                <SelectContent className={selectContentStyles}>
                    <SelectItem value="Y" className={selectItemStyles}>Y (Yes)</SelectItem>
                    <SelectItem value="N" className={selectItemStyles}>N (No)</SelectItem>
                </SelectContent>
            </Select>
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="HeightenedCognitiveLoad" className={labelStyles}>Cognitive Load</Label>
            <Select name="HeightenedCognitiveLoad" value={formData.HeightenedCognitiveLoad} onValueChange={handleSelectChange('HeightenedCognitiveLoad')}>
                <SelectTrigger className={selectTriggerStyles}><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent className={selectContentStyles}>
                    <SelectItem value="Y" className={selectItemStyles}>Y (Yes)</SelectItem>
                    <SelectItem value="P" className={selectItemStyles}>P (Partial)</SelectItem>
                    <SelectItem value="N" className={selectItemStyles}>N (No)</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="SocialMisunderstanding" className={labelStyles}>Social Mis.</Label>
            <Select name="SocialMisunderstanding" value={formData.SocialMisunderstanding} onValueChange={handleSelectChange('SocialMisunderstanding')}>
                <SelectTrigger className={selectTriggerStyles}><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent className={selectContentStyles}>
                    <SelectItem value="Y" className={selectItemStyles}>Y (Yes)</SelectItem>
                    <SelectItem value="P" className={selectItemStyles}>P (Partial)</SelectItem>
                    <SelectItem value="N" className={selectItemStyles}>N (No)</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="EssentialActivities" className={labelStyles}>Essential Act.</Label>
            <Select name="EssentialActivities" value={formData.EssentialActivities} onValueChange={handleSelectChange('EssentialActivities')}>
                <SelectTrigger className={selectTriggerStyles}><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent className={selectContentStyles}>
                    <SelectItem value="Y" className={selectItemStyles}>Y (Yes)</SelectItem>
                    <SelectItem value="P" className={selectItemStyles}>P (Partial)</SelectItem>
                    <SelectItem value="N" className={selectItemStyles}>N (No)</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Impact" className={labelStyles}>Impact</Label>
            <Input id="Impact" name="Impact" value={formData.Impact ?? ''} onChange={handleChange} className={`col-span-3 ${inputStyles}`} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Narrative" className={labelStyles}>Narrative</Label>
            <Textarea id="Narrative" name="Narrative" value={formData.Narrative ?? ''} onChange={handleChange} className={`col-span-3 ${inputStyles}`} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="CuratedWords" className="text-right font-bold text-[#cbb9f5]">Curated Words</Label>
            <Textarea id="CuratedWords" name="CuratedWords" value={formData.CuratedWords ?? ''} onChange={handleChange} placeholder="Add your personal notes..." className={`col-span-3 ${inputStyles} border-[#b48ead] focus:border-[#cbb9f5] focus:ring-[#cbb9f5]`} />
        </div>

        <Separator className="my-4 bg-[#5e4b8b]/30" />

        {/* AI Explain Section */}
        <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold text-[#cbb9f5]">AI Explanation</Label>
            <div className="col-span-3 flex items-center gap-2">
                 <Select name="persona" value={selectedPersona} onValueChange={handleSelectChange("persona")}>
                    <SelectTrigger className={`w-[180px] ${inputStyles}`}>
                        <SelectValue placeholder="Select Persona" />
                    </SelectTrigger>
                    <SelectContent className={selectContentStyles}>
                        {personaOptions.map(p => <SelectItem key={p} value={p} className={selectItemStyles}>{p}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button type="button" onClick={handleAiExplain} disabled={isAiLoading}
                        className="bg-[#5e4b8b] text-[#d9c7f0] hover:bg-[#b48ead]/80 disabled:opacity-50">
                    {isAiLoading ? "Thinking..." : "AI Explain"}
                </Button>
            </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3">
                <Textarea
                    readOnly
                    value={aiResponse}
                    placeholder="Click 'AI Explain' to generate summary..."
                    className={`mt-2 h-32 ${inputStyles} bg-[#043119] border-[#5e4b8b] text-[#a5a0b3] cursor-default`}
                 />
            </div>
        </div>

      </div> {/* End Form Grid */}

      {/* Footer Buttons */}
      <DialogFooter>
        <Button variant="outline" onClick={onClose}
                className="border-[#5e4b8b] text-[#a5a0b3] hover:bg-[#5e4b8b]/20 hover:text-[#d9c7f0]">
            Cancel
        </Button>
         <Button variant="destructive" onClick={handleDeleteConfirm} className="text-[#fee2e2] hover:bg-red-700">
            Delete
        </Button>
        <Button type="button" onClick={handleSaveChanges}
                className="bg-[#5e4b8b] text-[#d9c7f0] hover:bg-[#b48ead]/80">
            Save Edits
        </Button>
      </DialogFooter>
    </>
  );
};

export default EditModal;
```

```markdown
--- END: src/components/EditModal.tsx ---
```


```markdown
--- START: src/components/ui/dialog.tsx ---
```

```tsx
// src/components/ui/dialog.tsx - Meticulously Checked Version
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils" // Ensure you have this utility file

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

// --- DIALOG OVERLAY --- Ensure this component exists and is styled
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80", // Covers screen, high z-index, dimmed background
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", // Standard animations
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// --- DIALOG CONTENT --- Ensure it renders Overlay *within* Portal, *before* Content
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal> {/* Portal is essential */}
    <DialogOverlay /> {/* Overlay MUST be rendered here */}
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
         // Standard positioning & sizing
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200",
         // Make scrollable if content overflows height constraint
        "max-h-[95vh] md:max-h-[90vh] overflow-y-auto",
         // Your contrast styles
        "bg-[#01220f] border-[#5e4b8b] text-[#d9c7f0] rounded-lg",
         // Standard animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children} {/* EditModal renders inside this */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4 text-[#a5a0b3]" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// --- Header, Footer, Title, Description (Keep these standard) ---
const DialogHeader = ({className,...props}: React.HTMLAttributes<HTMLDivElement>) => (<div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props}/>)
DialogHeader.displayName = "DialogHeader"
const DialogFooter = ({className,...props}: React.HTMLAttributes<HTMLDivElement>) => (<div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t border-[#5e4b8b]/50 pt-4 mt-auto", className)} {...props}/>)
DialogFooter.displayName = "DialogFooter"
const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>,React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({ className, ...props }, ref) => (<DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight text-[#cbb9f5]", className)} {...props}/>))
DialogTitle.displayName = DialogPrimitive.Title.displayName
const DialogDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>,React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(({ className, ...props }, ref) => (<DialogPrimitive.Description ref={ref} className={cn("text-sm text-[#a5a0b3]", className)} {...props}/>))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// --- Ensure everything needed is exported ---
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, }
```

```markdown
--- END: src/components/ui/dialog.tsx ---
```


```markdown
--- START: src/types.ts ---
```

```ts
// src/types.ts
export interface Scenario {
    ID: string;
    Summary: string;
    DangerRanking: string; // Keep as string if CSV loads it as string, or change to number if appropriate
    drv: string; // Y/N
    HeightenedCognitiveLoad: string; // Y/P/N - Added back
    SocialMisunderstanding: string; // Y/P/N - Added back
    EssentialActivities: string; // Y/P/N - Added back
    Impact: string; // Text description - Added back
    Narrative?: string; // Optional text
    CuratedWords?: string; // Optional text
    // Add any other columns from your 10-column CSV if they were missed
  }
```

```markdown
--- END: src/types.ts ---
```


```markdown
--- START: tailwind.config.js ---
```

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}" // Scans src/App.tsx and components
    ],
    theme: {
      extend: {}
    },
    plugins: []
  }
```

```markdown
--- END: tailwind.config.js ---
```


```markdown
--- START: postcss.config.js ---
```

```js
export default {
  plugins: {
    // Use the NEW package here
    '@tailwindcss/postcss': {},
    // Autoprefixer is usually still needed
    autoprefixer: {},
  },
}
```

```markdown
--- END: postcss.config.js ---
```


```markdown
--- START: package.json ---
```

```json
{
  "name": "myapp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slot": "^1.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.488.0",
    "papaparse": "^5.5.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.1",
    "react-toastify": "^11.0.5",
    "tailwind-merge": "^3.2.0",
    "tw-animate-css": "^1.2.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@tailwindcss/postcss": "^4.1.4",
    "@types/node": "^22.14.1",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.21.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^15.15.0",
    "postcss": "^8.5.3",
    "shadcn-ui": "^0.9.5",
    "tailwindcss": "^4.1.4",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.24.1",
    "vite": "^6.2.0"
  }
}

```

```markdown
--- END: package.json ---
```
