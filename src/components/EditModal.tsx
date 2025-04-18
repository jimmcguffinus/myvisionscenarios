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