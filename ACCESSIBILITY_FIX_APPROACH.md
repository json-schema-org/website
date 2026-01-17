# Fix Approach: Lighthouse Accessibility Score - 81 → 90+

## Summary

Current accessibility score is **81/100** due to missing or generic alt text on images. Target is **90+** to meet WCAG 2.1 Level AA standards.

## Why Fix This

- **Legal Compliance**: WCAG 2.1 Level AA requires meaningful alt text
- **User Impact**: 15% of users depend on assistive technology (screen readers)
- **SEO**: Search engines use alt text for image indexing
- **Professional Standards**: Industry best practice for modern websites

## Issues Identified & Code Solutions

### Issue 1: Main Logo in Layout.tsx

**File**: `components/Layout.tsx` (Line 477)

**Problem**: Generic placeholder alt text `'Dynamic image'` for the main logo.

**Code Fix**:

```typescript
// ❌ BEFORE (Line 477)
<Image
  src={imageSrc}
  width={170}
  height={48}
  className='mr-2'
  alt='Dynamic image'
/>

// ✅ AFTER
<Image
  src={imageSrc}
  width={170}
  height={48}
  className='mr-2'
  alt='JSON Schema logo - Return to homepage'
/>
```

**Explanation**: The logo is functional (clickable link to homepage), so alt text should describe what it is and its function.

---

### Issue 2: Tool Logo in ToolingDetailModal.tsx

**File**: `pages/tools/components/ToolingDetailModal.tsx` (Line 68)

**Problem**: Generic `'landscape logos'` alt text doesn't identify which tool's logo.

**Code Fix**:

```typescript
// ❌ BEFORE (Line 68)
{tool.landscape?.logo && (
  <div className='p-2 flex flex-row items-center dark:bg-white rounded-md flex-none'>
    <Image
      src={`img/tools/logos/${tool.landscape?.logo}`}
      className='h-[48px] w-[48px]'
      height={48}
      width={48}
      alt='landscape logos'
    />
  </div>
)}

// ✅ AFTER
{tool.landscape?.logo && (
  <div className='p-2 flex flex-row items-center dark:bg-white rounded-md flex-none'>
    <Image
      src={`img/tools/logos/${tool.landscape?.logo}`}
      className='h-[48px] w-[48px]'
      height={48}
      width={48}
      alt={`${tool.name} logo`}
    />
  </div>
)}
```

**Explanation**: Use dynamic tool name to create specific, meaningful alt text for each tool's logo.

---

### Issue 3: Decorative Icons in StyledMarkdownBlock.tsx

**File**: `components/StyledMarkdownBlock.tsx` (Lines 231, 247, 269, 292, 315, 338)

**Problem**: Generic alt text like `'star'`, `'info yellow'`, `'bulb'`, `'warning'` for decorative icons. These icons accompany text that already conveys meaning.

**Code Fix**:

#### 3.1 Star Icon (Line 231)

```typescript
// ❌ BEFORE
<Image
  src='/icons/star.svg'
  width={20}
  height={20}
  className='mr-2 mb-1'
  alt='star'
/>

// ✅ AFTER - Decorative icon, text label provides meaning
<Image
  src='/icons/star.svg'
  width={20}
  height={20}
  className='mr-2 mb-1'
  alt=''
  role='presentation'
/>
```

#### 3.2 Info Icons in Warning Component (Lines 247, 269)

```typescript
// ❌ BEFORE (Line 247 - StarInline)
<Image
  src='/icons/info-yellow.svg'
  className='mr-1'
  width={12}
  height={12}
  alt='info yellow'
/>

// ❌ BEFORE (Line 269 - Warning)
<Image
  src='/icons/info-yellow.svg'
  className='h-7 w-7 mr-3'
  width={28}
  height={28}
  alt='info yellow'
/>

// ✅ AFTER - Both are decorative, accompanying text provides meaning
// StarInline (Line 247)
<Image
  src='/icons/info-yellow.svg'
  className='mr-1'
  width={12}
  height={12}
  alt=''
  role='presentation'
/>

// Warning (Line 269)
<Image
  src='/icons/info-yellow.svg'
  className='h-7 w-7 mr-3'
  width={28}
  height={28}
  alt=''
  role='presentation'
/>
```

#### 3.3 Info Blue Icon (Line 292)

```typescript
// ❌ BEFORE
<Image
  src='/icons/info-blue.svg'
  className='mr-3'
  width={28}
  height={28}
  alt='info blue'
/>

// ✅ AFTER
<Image
  src='/icons/info-blue.svg'
  className='mr-3'
  width={28}
  height={28}
  alt=''
  role='presentation'
/>
```

#### 3.4 Bulb Icon (Line 315)

```typescript
// ❌ BEFORE
<Image
  src='/icons/bulb.svg'
  className='mr-3'
  width={28}
  height={28}
  alt='bulb'
/>

// ✅ AFTER
<Image
  src='/icons/bulb.svg'
  className='mr-3'
  width={28}
  height={28}
  alt=''
  role='presentation'
/>
```

#### 3.5 Warning Icon (Line 338)

```typescript
// ❌ BEFORE
<Image
  src='/icons/warning.svg'
  className='mr-3'
  width={28}
  height={28}
  alt='warning'
/>

// ✅ AFTER
<Image
  src='/icons/warning.svg'
  className='mr-3'
  width={28}
  height={28}
  alt=''
  role='presentation'
/>
```

**Explanation**: These icons are decorative and appear alongside text labels that convey the same meaning. Using `alt=''` with `role='presentation'` tells screen readers to skip these decorative images, preventing redundant announcements.

---

### Issue 4: Table of Contents Menu Icon

**File**: `components/TableOfContentMarkdown.tsx` (Line 172)

**Problem**: Generic `'menu-icon'` doesn't provide context.

**Code Fix**:

```typescript
// ❌ BEFORE (Line 172)
<Image
  src={'/icons/toc-menu.svg'}
  height={'15'}
  width={'15'}
  alt='menu-icon'
  className='max-sm:w-3 max-sm:h-3'
/>

// ✅ AFTER - Option 1: Descriptive alt text
<Image
  src={'/icons/toc-menu.svg'}
  height={'15'}
  width={'15'}
  alt='Table of contents menu icon'
  className='max-sm:w-3 max-sm:h-3'
/>

// ✅ AFTER - Option 2: If purely decorative (next to "Table of Contents" text)
<Image
  src={'/icons/toc-menu.svg'}
  height={'15'}
  width={'15'}
  alt=''
  role='presentation'
  className='max-sm:w-3 max-sm:h-3'
/>
```

**Explanation**: Since the icon appears next to "Table of Contents" text, Option 2 (`alt=''`) is preferred. If you want to keep some meaning, Option 1 works too.

---

### Issue 5: Markdown Content Images

**Files**: Blog post markdown files (e.g., `pages/blog/posts/manfred-case-study.md`)

**Problem**: Images in markdown with generic `alt='image'`.

**Example Fix**:

```markdown
<!-- ❌ BEFORE -->
<img 
  className='w-full md:w-full lg:w-3/5 xl:w-3/5 2xl:w-3/5 px-20 pt-10 pb-20' 
  src='/img/posts/2024/manfred-case-study/manfred_team.webp' 
  alt='image'
/>

<!-- ✅ AFTER -->
<img 
  className='w-full md:w-full lg:w-3/5 xl:w-3/5 2xl:w-3/5 px-20 pt-10 pb-20' 
  src='/img/posts/2024/manfred-case-study/manfred_team.webp' 
  alt='Manfred team members working together'
/>
```

**Explanation**: Replace generic placeholder with descriptive text that conveys what the image shows.

---

## Implementation Steps

### Step 1: Fix Core Components (High Priority)

1. Fix `components/Layout.tsx` - Main logo alt text
2. Fix `pages/tools/components/ToolingDetailModal.tsx` - Tool logo alt text
3. Fix `components/StyledMarkdownBlock.tsx` - All decorative icons (6 instances)
4. Fix `components/TableOfContentMarkdown.tsx` - Menu icon alt text

### Step 2: Review and Fix Markdown Content

1. Search for markdown files with `<img>` tags
2. Review each image and add descriptive alt text
3. Focus on blog posts and documentation pages

### Step 3: Add ESLint Rule (Optional but Recommended)

Add to `.eslintrc.js` or `.eslintrc.json`:

```json
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/img-redundant-alt": "warn"
  }
}
```

This will catch missing or generic alt text during development.

### Step 4: Validate Changes

1. Run Lighthouse audit:
   ```bash
   # In Chrome DevTools: Lighthouse > Accessibility
   # Or use CLI: lighthouse https://json-schema.org --only-categories=accessibility
   ```

2. Test with screen reader:
   - **Windows**: Use NVDA (free) or JAWS
   - **Mac**: Use built-in VoiceOver (Cmd+F5)
   - Navigate through images and verify announcements

3. Visual regression testing:
   - Ensure all images still render correctly
   - Check that layout hasn't changed

---

## Alt Text Decision Guide

Use this flowchart to decide on alt text:

```
Is the image informative/content? 
├─ YES → Add descriptive alt text
│         (e.g., "JSON Schema logo", "Manfred team photo")
│
└─ NO → Is it purely decorative?
         ├─ YES → Use alt="" with role="presentation"
         │         (e.g., icons next to text labels)
         │
         └─ NO → Is it functional (button/link)?
                  └─ YES → Describe function
                            (e.g., "Submit form", "View details")
```

---

## Testing Checklist

- [ ] Lighthouse accessibility score ≥ 90
- [ ] All images have appropriate alt attributes
- [ ] No generic placeholder alt text remains
- [ ] Screen reader announces images correctly
- [ ] Images render correctly visually
- [ ] No console warnings about missing alt text
- [ ] ESLint passes (if rule added)

---

## Risk Assessment

**Risk Level**: **VERY LOW**

- ✅ No breaking changes
- ✅ No performance impact
- ✅ Easy to revert if needed
- ✅ Improves accessibility without changing visual design
- ✅ Backward compatible

---

## Success Metrics

- ✅ Lighthouse Accessibility Score: **81 → 90+**
- ✅ Zero images with generic/placeholder alt text
- ✅ WCAG 2.1 Level AA compliance
- ✅ All informative images have descriptive alt text
- ✅ All decorative images use `alt=''`

---

## Time Estimate

- **Phase 1** (Core components): 1-2 hours
- **Phase 2** (Markdown content review): 2-3 hours  
- **Phase 3** (Testing & validation): 1-2 hours

**Total**: 4-7 hours

---

## Recommendation

This is a **low-risk, high-value** improvement that:
- Meets accessibility standards (WCAG 2.1 Level AA)
- Improves UX for assistive technology users (15% of population)
- Enhances SEO through better image indexing
- Demonstrates commitment to inclusivity
- Sets positive example for open source community

Ready to implement! 🚀
