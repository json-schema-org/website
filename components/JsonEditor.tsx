import React from 'react'
import { BaseEditor, Text, createEditor } from 'slate'
import { ReactEditor, Slate, Editable, withReact } from 'slate-react'
import classnames from 'classnames'
import getPartsOfJson, { SyntaxPart } from '~/lib/getPartsOfJson'

type CustomElement = { type: 'paragraph', children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}



function getTextPathIndexesFromNodes (nodes, path: number [] = [], acc = []) {
  return nodes.reduce((acc, node, index) => serializeNode(node, [...path, index], acc), acc)
}

const serializeNode = (node, path: number[], acc: any[]): any[] => {
  if (node.type === 'html-entity') {
    const entry = [1, path]
    return [...acc, entry]
  }
  if (typeof node.text === 'string') {
    const entry = [node.text.length, path]
    return [...acc, entry]
  }
  return getTextPathIndexesFromNodes(node?.children || [], path, acc)
}


const calculateNewDecorationsMap = (
  value: any[]
) => {
  const serializedText = serializeNodes(value)
  const textPathIndexes = getTextPathIndexesFromNodes(value)
  const partsOfJson: SyntaxPart[] = getPartsOfJson(serializedText)
  const multipathDecorations = getMultipathDecorationsByMatchesAndTextPathIndexes(partsOfJson, textPathIndexes)
  const highlightingDecorations = multipathDecorations.reduce((acc, multipathDecoration: any) => {
    const decorationsOfNodes = multipathDecoration.nodes.reduce((acc, node) => {
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

const serializeNodes = (nodes, acc = '') => {
  return nodes.reduce((acc, node) => {
    if (node.children) return serializeNodes(node.children, acc)
    return `${acc}${node.text}`
  }, acc)
}

export default function JsonEditor ({ initialCode }: { initialCode: string }) {
  const [editor] = React.useState(() => withReact(createEditor()))

  const parsedCode: null | any = React.useMemo(() => {
    try {
      return JSON.parse(initialCode)
    } catch (e) {
      console.log('error on JSON.parse', e)
      return null
    }
  }, [initialCode])

  const cleanUpCode = React.useMemo(() => {
    return initialCode
      .replace(/"\$schema": "https:\/\/hide-me\/\w*",?/g, '')
      .replace(/"\$validation": "(?<validation>valid|invalid)",?/g, '')
  }, [initialCode])

  const isJsonSchema = parsedCode?.['$schema']
  const validation = parsedCode?.['$validation'] || null

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
      value={value}
    >
      <div className='relative font-mono bg-slate-800 w-full border rounded-xl mt-4 mb-10 overflow-hidden shadow-lg'>
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
            return null
          }}
        />
        {validation === 'valid' && (
          <div className='text-white px-4 py-3 font-sans flex flex-row justify-end items-center bg-emerald-500/30 text-sm'>
            <img src='/icons/checkmark.svg' className='h-5 w-5 mr-2' />
            compliant to schema
          </div>
        )}
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