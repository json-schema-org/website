import React, { useContext } from 'react';
import { BaseEditor, createEditor, Descendant, Text } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import classnames from 'classnames';
import getPartsOfJson, { SyntaxPart } from '~/lib/getPartsOfJson';
import jsonSchemaReferences from './jsonSchemaLinks';
import { useRouter } from 'next/router';
import { FullMarkdownContext } from '~/context';
import getScopesOfParsedJsonSchema, {
  JsonSchemaPathWithScope,
  JsonSchemaScope,
} from '~/lib/getScopesOfParsedJsonSchema';

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

const META_REGEX = /^\s*\/\/ props (?<meta>{.*}).*\n/g;

// Prevent annoying error messages because slate is not SSR ready
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
    customNode?.children || [],
    path,
    acc,
  );
  return textPathIndexesFromNodes;
};

const calculateNewDecorationsMap = (value: CustomElement[]) => {
  const serializedText = serializeNodesWithoutLineBreaks(value);
  const textPathIndexes = getTextPathIndexesFromNodes(value);
  const partsOfJson: SyntaxPart[] = getPartsOfJson(serializedText);
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

export default function JsonEditor({ initialCode }: { initialCode: string }) {
  const fullMarkdown = useContext(FullMarkdownContext);
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
  const cleanedUpCode = React.useMemo(() => {
    return initialCode.replace(META_REGEX, '');
  }, [initialCode]);

  const [value, setValue] = React.useState<CustomElement[]>(
    deserializeCode(cleanedUpCode),
  );
  const serializedCode = React.useMemo(
    () => serializeNodesWithLineBreaks(value),
    [value],
  );

  const [editor] = React.useState(() => withReact(createEditor()));
  //const [] React.useState()

  const meta: null | Meta = (() => {
    const metaRegexFinding = META_REGEX.exec(initialCode);
    if (!metaRegexFinding) return null;
    try {
      const metaString: undefined | string = metaRegexFinding?.groups?.meta;
      if (!metaString) return null;
      const meta = JSON.parse(metaString);
      return meta || null;
    } catch (e) {
      return null;
    }
  })();

  const parsedCode: null | any = React.useMemo(() => {
    try {
      return JSON.parse(serializedCode);
    } catch (e) {
      return null;
    }
  }, [serializedCode]);

  const isJsonSchema = parsedCode?.['$schema'] || meta?.isSchema;

  const jsonPathsWithJsonScope: JsonSchemaPathWithScope[] =
    React.useMemo(() => {
      if (!isJsonSchema) return [];
      return getScopesOfParsedJsonSchema(parsedCode);
    }, [parsedCode, isJsonSchema]);

  const validation: null | 'valid' | 'invalid' =
    typeof meta?.valid === 'boolean'
      ? meta.valid
        ? 'valid'
        : 'invalid'
      : null;
  const caption: null | string = meta?.caption || null;

  // fullCodeText variable is for use in copy pasting the code for the user
  const fullCodeText = React.useMemo(() => {
    let text = '';
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
    () => calculateNewDecorationsMap(value),
    [value],
  );

  return (
    <Slate
      editor={editor}
      initialValue={value as Descendant[]}
      onChange={(e) => setValue(e)}
    >
      <div
        className={classnames(
          'relative font-mono bg-slate-800 border rounded-xl mt-1 overflow-hidden shadow-lg',
          {
            'ml-10': meta?.indent,
          },
        )}
      >
        <div className='flex flex-row absolute right-0 z-10'>
          {/* Copy code button */}
          <div
            className='flex mr-1.5 cursor-pointer group'
            onClick={() => {
              navigator.clipboard.writeText(fullCodeText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <img
              src='/icons/copy.svg'
              title='Copy to clipboard'
              className={`opacity-50 hover:opacity-90 duration-150 ${copied ? 'hidden' : ''}`}
            ></img>
            <img
              src='/icons/copied.svg'
              title='Copied!'
              className={copied ? '' : 'hidden'}
            ></img>
          </div>
          <div className='flex flex-row items-center text-white h-6 font-sans bg-white/20 text-xs px-3 rounded-bl-lg font-semibold'>
            {isJsonSchema ? (
              <>
                <img src='/logo-white.svg' className='h-4 mr-1.5' /> schema
              </>
            ) : (
              <>data</>
            )}
          </div>
        </div>
        <Editable
          onCopy={(e) => {
            e.preventDefault();
            const text = window.getSelection()?.toString();
            navigator.clipboard.writeText(text || '');
          }}
          onCut={(e) => {
            e.preventDefault();
            const text = window.getSelection()?.toString();
            navigator.clipboard.writeText(text || '');
            setValue([{ type: 'paragraph', children: [{ text: '' }] }]);
          }}
          readOnly={true}
          decorate={([node, path]) => {
            if (!Text.isText(node)) return [];
            const stringPath = path.join(',');
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
                    (jsonPathsWithJsonScope) => jsonPathsWithJsonScope.jsonPath,
                  )
                  .includes(leaf.syntaxPart?.parentJsonPath);
                // console.log('jsonPathsWithJsonScope', jsonPathsWithJsonScope, leaf, leaf.syntaxPart?.parentJsonPath)
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
            })();

            const link: null | string = (() =>
              jsonSchemaReferences?.[leaf.syntaxPart?.type]?.[leaf.text] ||
              null)();

            return (
              <span
                onClick={() => {
                  if (!link) return;
                  router.push(link);
                }}
                className={classnames('pb-2', textStyles)}
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
            throw new Error(
              `unknown element.type [${element.type}] in render function`,
            );
          }}
        />

        {validation === 'invalid' && (
          <div className='text-white px-4 py-3 font-sans flex flex-row justify-end items-center bg-red-500/30 text-sm'>
            <img src='/icons/x-mark.svg' className='h-4 w-4 mr-2' />
            not compliant to schema
          </div>
        )}
        {validation === 'valid' && (
          <div className='text-white px-4 py-3 font-sans flex flex-row justify-end items-center bg-slate-500/30 text-sm'>
            <img src='/icons/checkmark.svg' className='h-5 w-5 mr-2' />
            compliant to schema
          </div>
        )}
      </div>
      <div
        className={classnames('text-center text-xs pt-2 text-slate-400', {
          'mb-10': !hasCodeblockAsDescendant,
        })}
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
