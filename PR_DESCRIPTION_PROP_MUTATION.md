# Fix: Remove Direct Prop Mutation During Render

Closes #2052

**What kind of change does this PR introduce?** This PR fixes a React anti-pattern where props were being mutated during render, which violates React's immutability principles and can cause unpredictable behavior with Strict Mode and concurrent rendering.

## Summary

This PR removes direct prop mutation in `ToolingTable.tsx` where `tool.bowtie` was being set during render. Instead, we now compute `bowtieData` and pass it as a prop to `ToolingDetailModal`, maintaining React's immutability principles.

## Problem

Props were being mutated during render in two locations:
- **Lines 182-185**: Desktop table rendering
- **Lines 278-282**: Mobile table rendering

```typescript
// ❌ Before: Mutating props during render
const bowtieData = getBowtieData(tool);
if (bowtieData) {
  tool.bowtie = bowtieData; // Direct mutation - violates React principles
}
```

### Why This Is Problematic

1. **Props should be immutable**: React relies on reference equality for optimizations
2. **Strict Mode issues**: Can cause unpredictable behavior with React's Strict Mode
3. **Concurrent rendering**: May cause issues with React's concurrent features
4. **Debugging difficulty**: Makes it harder to track state changes

## Solution

Instead of mutating the `tool` object, we now:
1. Compute `bowtieData` when opening the modal
2. Store it in component state
3. Pass it as a prop to `ToolingDetailModal`

```typescript
// ✅ After: No mutation, use computed value directly
const bowtieData = getBowtieData(tool);
// Use bowtieData directly - no mutation needed
```

## Changes Made

### 1. ToolingTable.tsx
- **Removed prop mutations** at lines 182-185 and 278-282
- **Added state** to store `bowtieData` for the selected tool
- **Updated `openModal`** to compute and store `bowtieData` when opening modal
- **Updated `closeModal`** to clear `bowtieData` state
- **Pass `bowtieData` as prop** to `ToolingDetailModal`

### 2. ToolingDetailModal.tsx
- **Added `bowtieData` prop** to receive bowtie data instead of reading from `tool.bowtie`
- **Updated all references** from `tool.bowtie` to `bowtieData` prop
- **Added `BowtieData` type import** for proper typing

## Code Changes

### Before
```typescript
{toolsByGroup[group].map((tool: JSONSchemaTool, index) => {
  const bowtieData = getBowtieData(tool);
  if (bowtieData) {
    tool.bowtie = bowtieData; // ❌ Mutation
  }
  return (
    // ... JSX using bowtieData directly
  );
})}
```

### After
```typescript
{toolsByGroup[group].map((tool: JSONSchemaTool, index) => {
  const bowtieData = getBowtieData(tool);
  // ✅ No mutation - use bowtieData directly
  return (
    // ... JSX using bowtieData directly
  );
})}

// When opening modal:
const openModal = (tool: JSONSchemaTool) => {
  setSelectedTool(tool);
  setSelectedToolBowtieData(getBowtieData(tool)); // ✅ Store in state
  // ...
};
```

## Testing

- ✅ No linter errors
- ✅ TypeScript types are correct
- ✅ No breaking changes to component API
- ✅ Functionality preserved - modal still displays bowtie data correctly

## Expected Behavior

- Props are no longer mutated during render
- `bowtieData` is computed and used directly in JSX
- Modal receives `bowtieData` as a prop and displays it correctly
- React's immutability principles are maintained

## Files Changed

1. `pages/tools/components/ToolingTable.tsx` - Removed prop mutations, added state management
2. `pages/tools/components/ToolingDetailModal.tsx` - Updated to receive `bowtieData` as prop

## Risk Assessment

**Risk Level**: **VERY LOW**
- No breaking changes
- No performance impact
- No visual changes
- Follows React best practices
- Easy to verify and test

## Benefits

1. **React Best Practices**: Follows immutability principles
2. **Strict Mode Compatible**: Works correctly with React Strict Mode
3. **Concurrent Rendering Safe**: Compatible with React's concurrent features
4. **Better Debugging**: Clearer data flow and state management
5. **Type Safety**: Proper TypeScript types for `bowtieData`

---

**Ready for review!** 🚀
