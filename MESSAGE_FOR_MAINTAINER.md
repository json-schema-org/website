Hi! I've fixed the prop mutation issue (#2052) in `ToolingTable.tsx`.

## Summary

**Problem**: Props were being mutated during render (`tool.bowtie = bowtieData`), violating React's immutability principles.

**Solution**: 
- Removed the mutations at lines 182-185 and 278-282
- Added state to store `bowtieData` for the selected tool
- Updated `ToolingDetailModal` to receive `bowtieData` as a prop instead of reading from the mutated `tool.bowtie`

## Links

- **PR**: https://github.com/json-schema-org/website/pull/2119
- **Issue**: https://github.com/json-schema-org/website/issues/2052
- **Files Changed**: 
  - `pages/tools/components/ToolingTable.tsx`
  - `pages/tools/components/ToolingDetailModal.tsx`

The fix maintains all existing functionality while following React best practices. Ready for review!
