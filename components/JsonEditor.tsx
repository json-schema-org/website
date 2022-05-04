import React from 'react'
import { BaseEditor, Text, createEditor, Descendant } from 'slate'
import { ReactEditor, Slate, Editable, withReact } from 'slate-react'
import classnames from 'classnames'
import getPartsOfJson, { SyntaxPart } from '~/lib/getPartsOfJson'

type CustomElement = CustomNode | CustomText
type CustomNode = { type: 'paragraph', children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomNode
    Text: CustomText
  }
}

type Meta = {
  caption?: string
  valid?: boolean
  isSchema?: boolean
  indent?: boolean
}

type Path = number[]
type TextPathIndex = [number, Path]

type Address = {
  path: Path
  offset: number
}
type RangeWithSyntaxPart = {
  anchor: Address
  focus: Address
  syntaxPart: SyntaxPart
}
type NodeRange = {
  path: Path
  anchor: number
  focus: number
}
type MultipathDecoration = {
  nodes: NodeRange[]
  syntaxPart: SyntaxPart
}

const META_REGEX = /^\s*\/\/ props (?<meta>{.*}).*\n/g

function getTextPathIndexesFromNodes (elements: CustomElement[], path: number [] = [], acc: TextPathIndex[] = []): TextPathIndex[] {
  const textPathIndexes = elements
    .reduce((acc, node, index) => (
      getTextPathIndexesFromNode(node, [...path, index], acc)
    ), acc)
  return textPathIndexes
}

const getTextPathIndexesFromNode = (customElement: CustomElement, path: number[], acc: TextPathIndex[]): TextPathIndex[] => {
  if (typeof (customElement as CustomText).text === 'string') {
    const customText = customElement as CustomText
    const entry: TextPathIndex = [customText.text.length, path]
    return [...acc, entry]
  }
  const customNode = customElement as CustomNode
  const textPathIndexesFromNodes = getTextPathIndexesFromNodes(customNode?.children || [], path, acc)
  return textPathIndexesFromNodes
}

const calculateNewDecorationsMap = (
  value: any[]
) => {
  const serializedText = serializeNodes(value)
  const textPathIndexes = getTextPathIndexesFromNodes(value)
  const partsOfJson: SyntaxPart[] = getPartsOfJson(serializedText)
  const multipathDecorations = getMultipathDecorationsByMatchesAndTextPathIndexes(partsOfJson, textPathIndexes)
  const highlightingDecorations = multipathDecorations.reduce((acc, multipathDecoration: MultipathDecoration) => {
    const decorationsOfNodes = multipathDecoration.nodes.reduce((acc: RangeWithSyntaxPart[], node: NodeRange) => {
      const decorationOfNode = {
        anchor: {
          offset: node.anchor,
          path: node.path,
        },
        focus: {
          offset: node.focus,
          path: node.path
        },
        syntaxPart: multipathDecoration.syntaxPart
      }
      return [...acc, decorationOfNode]
    }, [])
    return [...acc, ...decorationsOfNodes]
  }, [])

  const decorationMap = makeDecorationsToMap(highlightingDecorations)
  return decorationMap
}

const serializeNodes = (nodes: CustomElement[], acc = ''): string => {
  return nodes.reduce((acc, node) => {
    if ((node as CustomNode).children) return serializeNodes((node as CustomNode).children, acc)
    const customText = node as CustomText
    return `${acc}${customText.text}`
  }, acc)
}

export default function JsonEditor ({ initialCode }: { initialCode: string }) {
  const [editor] = React.useState(() => withReact(createEditor()))

  const parsedCode: null | any = React.useMemo(() => {
    try {
      return JSON.parse(initialCode)
    } catch (e) {
      return null
    }
  }, [initialCode])

  const cleanUpCode = React.useMemo(() => {
    return initialCode
      .replace(META_REGEX, '')
  }, [initialCode])

  const meta: null | Meta = (() => {
    const metaRegexFinding = META_REGEX.exec(initialCode)
    if (!metaRegexFinding) return null
    try {
      const metaString: undefined | string = metaRegexFinding?.groups?.meta
      if (!metaString) return null
      const meta = JSON.parse(metaString)
      return meta || null
    } catch (e) {
      return null
    }
  })()

  const isJsonSchema = parsedCode?.['$schema'] || meta?.isSchema
  const validation: null | 'valid' | 'invalid' = typeof meta?.valid === 'boolean' ? (
    meta.valid ? 'valid' : 'invalid'
  ) : null
  const caption: null | string = meta?.caption || null

  const value = React.useMemo(() => {
    const paragraphs = cleanUpCode.split('\n')
      .map(text => ({
        type: 'paragraph',
        children: [{ text }],
      }))
    return paragraphs
  }, [cleanUpCode])

  const allPathDecorationsMap: Record<string, any> = React.useMemo(
    () => calculateNewDecorationsMap(value),
    [value]
  )

  return (
    <Slate
      editor={editor}
      value={value as Descendant[]}
    >
      <div className={classnames('relative font-mono bg-slate-800 border rounded-xl mt-4 overflow-hidden shadow-lg', {
        'ml-10': meta?.indent
      })}>
        <div className='flex flex-row items-center absolute right-0 text-white h-6 font-sans bg-white/20 text-xs px-3 rounded-bl-lg font-semibold'>
          {isJsonSchema
            ? <><img src='/logo-white.svg' className='h-4 mr-1.5' /> schema</>
            : <>data</>
          }
        </div>
        <Editable
          disabled={true}
          decorate={([node, path]) => {
            if (!Text.isText(node)) return []
            const stringPath = path.join(',')
            return allPathDecorationsMap[stringPath] || []
          }}
          renderLeaf={(props: any) => {
            const { leaf, children } = props
            return (
              <span
                onClick={() => {

                  console.log('sdfsdf')
                }}
                className={classnames('p-b-2', {
                  'text-blue-200': ['objectPropertyStartQuotes', 'objectPropertyEndQuotes'].includes(leaf.syntaxPart?.type),
                  'text-blue-400': ['objectProperty'].includes(leaf.syntaxPart?.type),
                  'text-slate-400': ['objectStartBracket', 'objectEndBracket', 'arrayComma', 'arrayStartBracket', 'arrayEndBracket'].includes(leaf.syntaxPart?.type),
                  'text-lime-200': ['numberValue', 'stringValue', 'booleanValue', 'nullValue'].includes(leaf.syntaxPart?.type),
                })}
              >
                {children}
              </span>
            )
          }}
          renderElement={(props: any) => {
            // This will be the path to the image element.

            const { element, children } = props
            const path = ReactEditor.findPath(editor, element)
            const line = path[0] + 1
            if (element.type === 'paragraph') {
              return (
                <span className='relative flex flex-row first:pt-4 last:pb-4 ' {...props}>
                  <div className='absolute px-4 w-16 text-slate-500 select-none' contentEditable={false}>
                    {line}
                  </div>
                  <span className='ml-12 text-white pl-4'>
                    {children}
                  </span>
                </span>
              )
            }
            throw new Error(`unknown element.type [${element.type}] in render function`)
          }}
        />
        {validation === 'invalid' && (
          <div className='text-white px-4 py-3 font-sans flex flex-row justify-end items-center bg-red-500/30 text-sm'>
            <img src='/icons/x-mark.svg' className='h-4 w-4 mr-2' />
            not compliant to schema
          </div>
        )}
        {validation === 'valid' && (
          <div className='text-white px-4 py-3 font-sans flex flex-row justify-end items-center bg-emerald-500/30 text-sm'>
            <img src='/icons/checkmark.svg' className='h-5 w-5 mr-2' />
            compliant to schema
          </div>
        )}
      </div>
      <div className='mb-10 text-center text-xs pt-2 text-slate-400'>
        {caption}
      </div>
    </Slate>
  )
}

export type RegExpResult = { index: number, match: string, groups: RegExpGroupResult[] }
export type RegExpGroupResult = {
  name: string | null
  index: number
  match: string
}

export type PathIndex = [number, number[]]

//

const getMultipathDecorationsByMatchesAndTextPathIndexes = (
  syntaxParts: SyntaxPart[],
  textPathIndexes: PathIndex[]
): any[] => {
  const multipathDecorations: any[] = syntaxParts
    .map((syntaxPart) => {
      const nodes = getNodesFromIndexAndLength(syntaxPart.index, syntaxPart.length, textPathIndexes)
      return {
        nodes: nodes,
        syntaxPart
      }
    })
  return multipathDecorations
}

export const getNodesFromIndexAndLength = (
  index: number,
  length: number,
  textPathIndexes: PathIndex[]
): any[] => {
  const { nodes } = textPathIndexes.reduce((acc: {nodes: any[], index: number, length: number}, textPathIndex: PathIndex) => {
    if (acc.length <= 0) return acc
    const [textPathLength, nodePath] = textPathIndex
    if (textPathLength <= acc.index) {
      return { ...acc, index: acc.index - textPathLength }
    }
    const anchor = acc.index
    const focus = Math.min(anchor + acc.length, textPathLength)
    const lengthInNode = focus - anchor
    const node: any = { anchor, focus, path: nodePath }
    return {
      nodes: [...acc.nodes, node], index: 0, length: acc.length - lengthInNode
    }
  }, { nodes: [], index, length })
  return nodes
}

const makeDecorationsToMap = (decorations: any[]): Record<string, any[]> => {
  return decorations.reduce((acc, decoration) => {
    const stringPath = decoration.anchor.path.join(',')
    return { ...acc, [stringPath]: [...(acc[stringPath] || []), decoration] }
  }, {})
}