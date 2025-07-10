/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import { BaseEditor, createEditor, Descendant, Text } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { cn } from '@/lib/utils';
import getPartsOfJson, { SyntaxPart } from '~/lib/getPartsOfJson';
import jsonSchemaReferences from './jsonSchemaLinks';
import { useRouter } from 'next/router';
import { FullMarkdownContext } from '~/context';
import Image from 'next/image';
import getScopesOfParsedJsonSchema, {
  JsonSchemaPathWithScope,
  JsonSchemaScope,
} from '~/lib/getScopesOfParsedJsonSchema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

type CustomElement = CustomNode | CustomText;
type CustomNode = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomNode;
    Text: CustomText;
  }
}

type Meta = {
  caption?: string;
  valid?: boolean;
  isSchema?: boolean;
  indent?: boolean;
};

type Path = number[];
type TextPathIndex = [number, Path];

type Address = {
  path: Path;
  offset: number;
};
type RangeWithSyntaxPart = {
  anchor: Address;
  focus: Address;
  syntaxPart: SyntaxPart;
};
type NodeRange = {
  path: Path;
  anchor: number;
  focus: number;
};
type MultipathDecoration = {
  nodes: NodeRange[];
  syntaxPart: SyntaxPart;
};

const META_REGEX = /^\s*\/\/ props (?<meta>{.*}).*\n/;

// Prevent annoying error messages because slate is not SSR ready
/* istanbul ignore next:
 * This code is used to prevent an error message that occurs when running in a non-browser
 * environment. So ignoring this code in the code coverage reports.
 */
if (typeof process !== 'undefined' && process.browser !== true) {
  React.useLayoutEffect = React.useEffect;
}

function getTextPathIndexesFromNodes(
  elements: CustomElement[],
  path: number[] = [],
  acc: TextPathIndex[] = [],
): TextPathIndex[] {
  const textPathIndexes = elements.reduce(
    (acc, node, index) =>
      getTextPathIndexesFromNode(node, [...path, index], acc),
    acc,
  );
  return textPathIndexes;
}

const getTextPathIndexesFromNode = (
  customElement: CustomElement,
  path: number[],
  acc: TextPathIndex[],
): TextPathIndex[] => {
  if (typeof (customElement as CustomText).text === 'string') {
    const customText = customElement as CustomText;
    const entry: TextPathIndex = [customText.text.length, path];
    return [...acc, entry];
  }
  const customNode = customElement as CustomNode;
  const textPathIndexesFromNodes = getTextPathIndexesFromNodes(
    /* istanbul ignore next: customNode?.children cannot be null */
    customNode?.children || [],
    path,
    acc,
  );
  return textPathIndexesFromNodes;
};

// Function to create basic syntax highlighting for partial schemas
const getBasicSyntaxParts = (serializedText: string): SyntaxPart[] => {
  const parts: SyntaxPart[] = [];

  // Define patterns for basic syntax highlighting
  const patterns = [
    // Strings (including property names)
    { regex: /"[^"\\]*(?:\\.[^"\\]*)*"/g, type: 'stringValue' },
    // Numbers
    { regex: /-?\d+\.?\d*(?:[eE][+-]?\d+)?/g, type: 'numberValue' },
    // Booleans
    { regex: /\b(?:true|false)\b/g, type: 'booleanValue' },
    // Null
    { regex: /\bnull\b/g, type: 'nullValue' },
    // Object brackets
    { regex: /[{}]/g, type: 'objectBracket' },
    // Array brackets
    { regex: /[[\]]/g, type: 'arrayBracket' },
    // Commas
    { regex: /,/g, type: 'comma' },
    // Property names (quoted strings followed by colon)
    { regex: /"[^"\\]*(?:\\.[^"\\]*)*"\s*:/g, type: 'objectProperty' },
  ];

  patterns.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(serializedText)) !== null) {
      // Special handling for property names
      if (type === 'objectProperty') {
        const fullMatch = match[0];
        const colonIndex = fullMatch.lastIndexOf(':');
        const propertyPart = fullMatch.substring(0, colonIndex);

        // Add quotes
        parts.push({
          type: 'objectPropertyStartQuotes',
          index: match.index,
          length: 1,
          match: '"',
          jsonPath: '$',
        });

        // Add property name
        parts.push({
          type: 'objectProperty',
          index: match.index + 1,
          length: propertyPart.length - 2,
          match: propertyPart.slice(1, -1),
          jsonPath: '$',
        });

        // Add closing quotes
        parts.push({
          type: 'objectPropertyEndQuotes',
          index: match.index + propertyPart.length - 1,
          length: 1,
          match: '"',
          jsonPath: '$',
        });
      } else {
        // Map some types to match existing styling
        let mappedType = type;
        if (type === 'objectBracket') {
          mappedType =
            match[0] === '{' ? 'objectStartBracket' : 'objectEndBracket';
        } else if (type === 'arrayBracket') {
          mappedType =
            match[0] === '[' ? 'arrayStartBracket' : 'arrayEndBracket';
        } else if (type === 'comma') {
          mappedType = 'arrayComma';
        }

        parts.push({
          type: mappedType,
          index: match.index,
          length: match[0].length,
          match: match[0],
          jsonPath: '$',
        });
      }
    }
  });

  // Sort parts by index to ensure proper ordering
  return parts.sort((a, b) => a.index - b.index);
};

const calculateNewDecorationsMap = (
  value: CustomElement[],
  /* istanbul ignore next: Default parameter is never triggered in current implementation */
  isPartialSchema: boolean = false,
) => {
  const serializedText = serializeNodesWithoutLineBreaks(value);
  const textPathIndexes = getTextPathIndexesFromNodes(value);

  let partsOfJson: SyntaxPart[];

  if (isPartialSchema) {
    // Use basic syntax highlighting for partial schemas
    partsOfJson = getBasicSyntaxParts(serializedText);
  } else {
    // Use full JSON parsing for complete schemas
    partsOfJson = getPartsOfJson(serializedText);
  }

  const multipathDecorations =
    getMultipathDecorationsByMatchesAndTextPathIndexes(
      partsOfJson,
      textPathIndexes,
    );
  const highlightingDecorations = multipathDecorations.reduce(
    (acc, multipathDecoration: MultipathDecoration) => {
      const decorationsOfNodes = multipathDecoration.nodes.reduce(
        (acc: RangeWithSyntaxPart[], node: NodeRange) => {
          const decorationOfNode = {
            anchor: {
              offset: node.anchor,
              path: node.path,
            },
            focus: {
              offset: node.focus,
              path: node.path,
            },
            syntaxPart: multipathDecoration.syntaxPart,
          };
          return [...acc, decorationOfNode];
        },
        [],
      );
      return [...acc, ...decorationsOfNodes];
    },
    [],
  );

  const decorationMap = makeDecorationsToMap(highlightingDecorations);
  return decorationMap;
};

const serializeNodesWithoutLineBreaks = (
  nodes: CustomElement[],
  acc = '',
): string => {
  return nodes.reduce((acc, node) => {
    if ((node as CustomNode).children)
      return serializeNodesWithoutLineBreaks(
        (node as CustomNode).children,
        acc,
      );
    const customText = node as CustomText;
    return `${acc}${customText.text}`;
  }, acc);
};

const serializeNodesWithLineBreaks = (
  nodes: CustomElement[],
  acc = '',
): string => {
  return nodes.reduce((acc, node, index) => {
    if ((node as CustomNode).children) {
      const serializedChildren = serializeNodesWithLineBreaks(
        (node as CustomNode).children,
        '',
      );
      return `${acc}${index > 0 ? '\n' : ''}${serializedChildren}`;
    }
    const customText = node as CustomText;
    return `${acc}${customText.text}`;
  }, acc);
};

const deserializeCode = (code: string): CustomElement[] => {
  const paragraphs = code.split('\n').map(
    (text): CustomElement => ({
      type: 'paragraph',
      children: [{ text }],
    }),
  );
  return paragraphs;
};

export default function JsonEditor({
  initialCode,
  isJsonc = false,
}: {
  initialCode: string;
  isJsonc?: boolean;
}) {
  const fullMarkdown = useContext(FullMarkdownContext);
  /* istanbul ignore next: In the test environment, the fullMarkdown is not provided. */
  const hasCodeblockAsDescendant: boolean | undefined = (() => {
    const positionOfCodeInFullMarkdown = fullMarkdown?.indexOf(initialCode);
    if (!positionOfCodeInFullMarkdown) return;
    const endPositionOfCode = positionOfCodeInFullMarkdown + initialCode.length;
    const startPositionOfNextBlock = endPositionOfCode + '\n```\n'.length;
    const markdownAfterCodeBlock = fullMarkdown?.substr(
      startPositionOfNextBlock,
    );
    return markdownAfterCodeBlock?.startsWith('```');
  })();

  const router = useRouter();

  // Clean code and detect partial schema for JSONC
  const cleanedUpCode = React.useMemo(() => {
    let code = initialCode.replace(META_REGEX, '');

    if (isJsonc) {
      // Remove partial schema comments for JSONC
      code = code
        .replace(/\/\/ partial schema\n?/g, '')
        .replace(/\/\* partial schema \*\/\n?/g, '')
        .trim();
    }

    return code;
  }, [initialCode, isJsonc]);

  const [value, setValue] = React.useState<CustomElement[]>(
    deserializeCode(cleanedUpCode),
  );
  const serializedCode = React.useMemo(
    () => serializeNodesWithLineBreaks(value),
    [value],
  );

  const [editor] = React.useState(() => withReact(createEditor()));

  const meta: null | Meta = React.useMemo(() => {
    const metaRegexFinding = META_REGEX.exec(initialCode);
    if (!metaRegexFinding) return null;
    try {
      const metaString: undefined | string = metaRegexFinding?.groups?.meta;
      /* istanbul ignore next: metaString cannot be null if the regex matched */
      if (!metaString) return null;
      const meta = JSON.parse(metaString);
      /* istanbul ignore next: meta cannot be null if the regex matched */
      return meta || null;
    } catch (e) {
      return null;
    }
  }, [initialCode]);

  const parsedCode: null | any = React.useMemo(() => {
    try {
      return JSON.parse(serializedCode);
    } catch (e) {
      return null;
    }
  }, [serializedCode]);

  // Detect partial schema for JSONC
  const isPartialSchema = React.useMemo(() => {
    if (!isJsonc) return false;
    const codeString = String(initialCode || '');
    return (
      codeString.includes('// partial schema') ||
      codeString.includes('/* partial schema */')
    );
  }, [initialCode, isJsonc]);

  const isJsonSchema = React.useMemo(() => {
    return parsedCode?.['$schema'] || meta?.isSchema;
  }, [parsedCode, meta]);

  const jsonPathsWithJsonScope: JsonSchemaPathWithScope[] =
    React.useMemo(() => {
      if (!isJsonSchema) return [];
      return getScopesOfParsedJsonSchema(parsedCode);
    }, [parsedCode, isJsonSchema]);

  const validation: null | 'valid' | 'invalid' = React.useMemo(() => {
    return typeof meta?.valid === 'boolean'
      ? meta.valid
        ? 'valid'
        : 'invalid'
      : null;
  }, [meta]);

  const caption: null | string = React.useMemo(() => {
    return meta?.caption || null;
  }, [meta]);

  // fullCodeText variable is for use in copy pasting the code for the user
  const fullCodeText = React.useMemo(() => {
    let text = '';
    /* istanbul ignore else : there is no else block to test here */
    if (value) {
      value.forEach((e: any) => {
        text += e.children[0].text + '\n';
      });
    }
    return text;
  }, [value]);

  // copy status react state
  const [copied, setCopied] = React.useState(false);

  const allPathDecorationsMap: Record<string, any> = React.useMemo(
    () => calculateNewDecorationsMap(value, isPartialSchema),
    [value, isPartialSchema],
  );

  return (
    <Slate
      editor={editor}
      initialValue={value as Descendant[]}
      onChange={
        /* istanbul ignore next:
         * Editor is read-only, so the onChange function will never be called.
         */
        (e) => setValue(e)
      }
    >
      <Card
        className={cn(
          'relative font-mono bg-slate-800 border-slate-700 rounded-xl mt-1 overflow-hidden shadow-lg py-0',
          {
            'ml-10': meta?.indent,
          },
        )}
      >
        <div className='flex flex-row absolute right-0 z-10'>
          {/* Copy code button */}
          <Button
            variant='ghost'
            size='icon'
            className='mr-1.5 h-6 w-6 opacity-50 hover:opacity-90 duration-150'
            onClick={() => {
              navigator.clipboard.writeText(fullCodeText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            data-test='copy-clipboard-button'
          >
            {copied ? (
              <Image
                src='/icons/copied.svg'
                alt='Copied icon'
                width={20}
                height={20}
                title='Copied!'
              />
            ) : (
              <Image
                src='/icons/copy.svg'
                alt='Copy icon'
                title='Copy to clipboard'
                width={20}
                height={20}
              />
            )}
          </Button>
          <Badge
            variant='secondary'
            className='flex flex-row items-center text-white h-6 font-sans bg-white/20 text-xs px-3 rounded-bl-lg font-semibold border-0'
            data-test='check-json-schema'
          >
            {isJsonc ? (
              isPartialSchema ? (
                <>
                  <Image
                    src='/logo-white.svg'
                    alt=' logo-white'
                    width={16}
                    height={16}
                    className=' mr-1.5'
                  />{' '}
                  part of schema
                </>
              ) : (
                <>code</>
              )
            ) : isJsonSchema ? (
              <>
                <Image
                  src='/logo-white.svg'
                  alt=' logo-white'
                  width={16}
                  height={16}
                  className=' mr-1.5'
                />{' '}
                schema
              </>
            ) : (
              <>data</>
            )}
          </Badge>
        </div>
        <CardContent className='p-0 pt-2 '>
          <Editable
            className='overflow-x-auto'
            data-test='json-editor'
            onCopy={(e) => {
              e.preventDefault();
              const text = window.getSelection()?.toString();
              navigator.clipboard.writeText(text || '');
            }}
            onCut={
              /* istanbul ignore next : 
                 The editor is read-only, so the onCut function will never be called. */
              (e) => {
                e.preventDefault();
                const text = window.getSelection()?.toString();
                navigator.clipboard.writeText(text || '');
                setValue([{ type: 'paragraph', children: [{ text: '' }] }]);
              }
            }
            readOnly={true}
            decorate={([node, path]) => {
              if (!Text.isText(node)) return [];
              const stringPath = path.join(',');
              /* istanbul ignore next: allPathDecorationsMap[stringPath] cannot be null */
              return allPathDecorationsMap[stringPath] || [];
            }}
            renderLeaf={(props: any) => {
              const { leaf, children, attributes } = props;
              const textStyles: undefined | string = (() => {
                if (
                  [
                    'objectPropertyStartQuotes',
                    'objectPropertyEndQuotes',
                  ].includes(leaf.syntaxPart?.type)
                )
                  return 'text-blue-200';
                if (['objectProperty'].includes(leaf.syntaxPart?.type)) {
                  const isJsonScope = jsonPathsWithJsonScope
                    .filter(
                      (jsonPathWithScope) =>
                        jsonPathWithScope.scope ===
                        JsonSchemaScope.TypeDefinition,
                    )
                    .map(
                      (jsonPathsWithJsonScope) =>
                        jsonPathsWithJsonScope.jsonPath,
                    )
                    .includes(leaf.syntaxPart?.parentJsonPath);
                  if (
                    isJsonScope &&
                    jsonSchemaReferences.objectProperty[leaf.text]
                  ) {
                    return 'cursor-pointer text-blue-400 hover:text-blue-300 decoration-blue-500/30 hover:decoration-blue-500/50 underline underline-offset-4';
                  }
                  return 'text-cyan-500';
                }
                if (leaf.syntaxPart?.type === 'stringValue') {
                  if (jsonSchemaReferences.stringValue[leaf.text]) {
                    return 'cursor-pointer text-amber-300 hover:text-amber-300 decoration-amber-500/30 hover:decoration-amber-500/50 underline underline-offset-4';
                  }
                  return 'text-lime-200';
                }
                if (
                  [
                    'objectStartBracket',
                    'objectEndBracket',
                    'arrayComma',
                    'arrayStartBracket',
                    'arrayEndBracket',
                  ].includes(leaf.syntaxPart?.type)
                )
                  return 'text-slate-400';
                if (
                  [
                    'numberValue',
                    'stringValue',
                    'booleanValue',
                    'nullValue',
                  ].includes(leaf.syntaxPart?.type)
                )
                  return 'text-lime-200';

                // Handle partial schema specific highlighting that might not match exactly
                if (!leaf.syntaxPart?.type) {
                  // If no syntax part type, apply default white color for partial schemas
                  return isPartialSchema ? 'text-white' : undefined;
                }
              })();

              const link: null | string = (() =>
                jsonSchemaReferences?.[leaf.syntaxPart?.type]?.[leaf.text] ||
                null)();

              return (
                <span
                  onClick={() => {
                    /* istanbul ignore if : link cannot be null */
                    if (!link) return;
                    router.push(link);
                  }}
                  className={cn('pb-2', textStyles, 'whitespace-pre')}
                  title={leaf.syntaxPart?.type}
                  {...attributes}
                >
                  {children}
                </span>
              );
            }}
            renderElement={(props: any) => {
              // This will be the path to the image element.
              const { element, children, attributes } = props;
              const path = ReactEditor.findPath(editor, element);
              const line = path[0] + 1;
              /* istanbul ignore else : no else block to test */
              if (element.type === 'paragraph') {
                return (
                  <span
                    className='relative flex flex-row first:pt-4 last:pb-4 '
                    {...attributes}
                  >
                    <span
                      className='absolute px-4 w-16 after:content-[attr(data-line-number)] text-slate-500 select-none'
                      data-line-number={line}
                    />
                    <span className='ml-12 text-white pl-4'>{children}</span>
                  </span>
                );
              }
              /* istanbul ignore next:
               * There is no other element type in the render function. Hence this will never be called.*/
              throw new Error(
                `unknown element.type [${element.type}] in render function`,
              );
            }}
          />
        </CardContent>

        {validation === 'invalid' && (
          <Alert
            variant='destructive'
            className='text-white px-4 py-3 font-sans flex flex-row justify-end items-center bg-red-500/30 text-sm border-0 rounded-none'
            data-test='not-compliant-to-schema'
          >
            <Image
              src='/icons/x-mark.svg'
              alt='Error icon'
              width={16}
              height={16}
              className=' mr-2'
            />
            not compliant to schema
          </Alert>
        )}
        {validation === 'valid' && (
          <Alert
            variant='default'
            className='text-white px-4 py-3 font-sans flex flex-row justify-end items-center bg-slate-500/30 text-sm border-0 rounded-none'
            data-test='compliant-to-schema'
          >
            <Image
              src='/icons/checkmark.svg'
              alt='Checkmark icon'
              width={20}
              height={20}
              className='mr-2'
            />
            compliant to schema
          </Alert>
        )}
      </Card>
      <div
        className={cn('text-center text-xs pt-2 text-slate-400', {
          'mb-10': !hasCodeblockAsDescendant,
        })}
        data-test='code-caption'
      >
        {caption}
      </div>
    </Slate>
  );
}

export type RegExpResult = {
  index: number;
  match: string;
  groups: RegExpGroupResult[];
};
export type RegExpGroupResult = {
  name: string | null;
  index: number;
  match: string;
};

export type PathIndex = [number, number[]];

//

const getMultipathDecorationsByMatchesAndTextPathIndexes = (
  syntaxParts: SyntaxPart[],
  textPathIndexes: PathIndex[],
): any[] => {
  const multipathDecorations: any[] = syntaxParts.map((syntaxPart) => {
    const nodes = getNodesFromIndexAndLength(
      syntaxPart.index,
      syntaxPart.length,
      textPathIndexes,
    );
    return {
      nodes: nodes,
      syntaxPart,
    };
  });
  return multipathDecorations;
};

export const getNodesFromIndexAndLength = (
  index: number,
  length: number,
  textPathIndexes: PathIndex[],
): any[] => {
  const { nodes } = textPathIndexes.reduce(
    (
      acc: { nodes: any[]; index: number; length: number },
      textPathIndex: PathIndex,
    ) => {
      if (acc.length <= 0) return acc;
      const [textPathLength, nodePath] = textPathIndex;
      if (textPathLength <= acc.index) {
        return { ...acc, index: acc.index - textPathLength };
      }
      const anchor = acc.index;
      const focus = Math.min(anchor + acc.length, textPathLength);
      const lengthInNode = focus - anchor;
      const node: any = { anchor, focus, path: nodePath };
      return {
        nodes: [...acc.nodes, node],
        index: 0,
        length: acc.length - lengthInNode,
      };
    },
    { nodes: [], index, length },
  );
  return nodes;
};

const makeDecorationsToMap = (decorations: any[]): Record<string, any[]> => {
  return decorations.reduce((acc, decoration) => {
    const stringPath = decoration.anchor.path.join(',');
    return { ...acc, [stringPath]: [...(acc[stringPath] || []), decoration] };
  }, {});
};
