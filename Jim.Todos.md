# Jim's Todo List

## Required Dependencies

Install these packages in Firebase Studio to resolve TypeScript errors:

```bash
# Core React libraries
npm install react react-dom

# Routing
npm install react-router-dom

# UI notifications
npm install react-hot-toast

# UI components
npm install lucide-react 
npm install @radix-ui/react-dialog @radix-ui/react-alert-dialog @radix-ui/react-tabs @radix-ui/react-toast
npm install react-toastify

# UI component libraries (shadcn/ui)
npm install @radix-ui/react-badge
npm install @radix-ui/react-table

# Styling utilities
npm install tailwindcss postcss autoprefixer @tailwindcss/postcss
npm install class-variance-authority clsx tailwind-merge

# Data parsing
npm install papaparse
npm install -D @types/papaparse

# TypeScript type definitions
npm install -D @types/react @types/react-dom @types/node
```

## Deployment Steps

1. Build the application:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

3. Test these URLs after deployment:
   - Main app: https://myvisionscenarios.web.app/
   - Ghostbusters test page: https://myvisionscenarios.web.app/ghostbusters/

## Fixing TypeScript errors in components

The main TypeScript errors in App.tsx need to be fixed as follows:

1. **Add type annotations to all wrapper components:**

```tsx
// ScenarioEdit wrapper with proper type annotations
function ScenarioEditWrapper({ scenarios, onUpdate, onDelete, onCreate }: {
  scenarios: Scenario[];
  onUpdate: (scenario: Scenario) => void;
  onDelete?: (id: string) => void;
  onCreate?: (scenario: Omit<Scenario, "ID">) => void;
}) {
  const { id } = useParams();
  const scenario = id ? scenarios.find(s => s.ID === id) : null;
  
  if (id && !scenario) {
    return <div>Scenario not found</div>;
  }
  
  return (
    <ScenarioEdit
      scenario={scenario as Scenario | null}
      onBack={() => {/* navigation handled by router */}}
      onUpdate={onUpdate}
      onDelete={onDelete || (() => {})}
      onCreate={onCreate}
    />
  );
}

// PrintView wrapper with proper type annotations
function PrintViewWrapper({ scenarios }: {
  scenarios: Scenario[];
}) {
  const { id } = useParams();
  const scenario = id ? scenarios.find(s => s.ID === id) : null;
  
  if (!scenario) {
    return <div>Scenario not found</div>;
  }
  
  return <PrintView scenario={scenario} />;
}

// AIExplain wrapper with proper type annotations
function AIExplainWrapper({ scenarios }: {
  scenarios: Scenario[];
}) {
  const { id } = useParams();
  const scenario = id ? scenarios.find(s => s.ID === id) : null;
  
  if (!scenario) {
    return <div>Scenario not found</div>;
  }
  
  return <AIExplain scenario={scenario} />;
}
```

2. **Check the ScenarioEdit, PrintView, and AIExplain component interfaces:**

Make sure these components properly handle null scenarios:

```tsx
// Example for ScenarioEdit.tsx - ensure this matches your implementation
interface ScenarioEditProps {
  scenario: Scenario | null;
  onBack: () => void;
  onUpdate: (scenario: Scenario) => void;
  onDelete: (id: string) => void;
  onCreate?: (scenario: Omit<Scenario, "ID">) => void;
}
```

3. **Fix the ScenarioList component prop types:**

The ScenarioList component requires an `onSelectScenario` prop according to its interface, but it's not being passed in App.tsx. Either:

- Add the missing prop when using ScenarioList:
  ```tsx
  <ScenarioList 
    scenarios={scenarios} 
    onDelete={handleDeleteScenario}
    isLoading={isLoading}
    onSelectScenario={(scenario) => {/* handle selection */}}
  />
  ```

- Or update the ScenarioList.tsx interface to make the prop optional:
  ```tsx
  interface ScenarioListProps {
    scenarios: Scenario[]
    onSelectScenario?: (scenario: Scenario) => void
    onDelete: (id: string) => void
    isLoading?: boolean
  }
  ```

## Cache-Busting Strategy

If the ghost UI issue persists after deployment:

1. Try accessing the app through the alternative "/ghostbusters/" route
2. Use the ghost-buster-deploy.sh script to create a fresh preview channel
3. Clear browser cache and try in an incognito window

The comprehensive ghost-busting strategy in cursor.progress.md has all the details on how we solved this persistent caching issue.

## WhirlwindVibing Party 🎉

Let's keep the WhirlwindVibing spirit alive! With these fixes in place, we should have a fully functioning Vision Scenarios app with all components properly typed and styled. 